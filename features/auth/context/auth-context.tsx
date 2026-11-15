/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { loginApi, registerApi, logoutApi } from '@/lib/api/auth'
import type { BackendLoginResponse, BackendRegisterResponse } from '@/lib/api/types'

export interface AuthUser {
  id: string
  username: string
  displayName?: string
  email?: string
  avatarUrl?: string
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string; username: string; displayName: string; password: string }) => Promise<void>
  logout: () => Promise<void>
}

export  const AuthContext = createContext<AuthContextType | undefined>(undefined)

function normalizeUserFromLogin(res: BackendLoginResponse): AuthUser {
  const username = res.user?.username || ''
  return {
    id: res.user?.id,
    username,
    email: res.user?.email,
    displayName: (res.user as any)?.displayName || username,
  }
}

function normalizeUserFromRegister(res: BackendRegisterResponse): AuthUser {
  const username = res.user?.username || res.user?.userName || ''
  return {
    id: res.user?.id,
    username,
    displayName: res.user?.displayName || username,
    email: res.user?.email,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('vesper_token')
      const storedUser = localStorage.getItem('vesper_user')
      if (storedToken) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        return setToken(storedToken)
      }
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await loginApi({ email, password })
    const authToken = res.accessToken || (res as any).token || (res as any).refreshToken || null
    const authUser = normalizeUserFromLogin(res)
    if (authToken) {
      localStorage.setItem('vesper_token', authToken)
      setToken(authToken)
    }
    localStorage.setItem('vesper_user', JSON.stringify(authUser))
    setUser(authUser)
  }

  const register = async (data: { email: string; username: string; displayName: string; password: string }) => {
    const res = await registerApi(data)
    const authToken = (res as any).token || (res as any).accessToken || null
    const authUser = normalizeUserFromRegister(res)
    if (authToken) {
      localStorage.setItem('vesper_token', authToken)
      setToken(authToken)
    }
    localStorage.setItem('vesper_user', JSON.stringify(authUser))
    setUser(authUser)
  }

  const logout = async () => {
    try {
      await logoutApi()
    } catch {
      // best effort
    }
    try {
      localStorage.removeItem('vesper_token')
      localStorage.removeItem('vesper_user')
    } catch {
      // ignore
    }
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
