import { apiFetch } from './client'
import type { BackendLoginResponse, BackendRegisterResponse } from './types'

export async function registerApi(payload: {
  email: string
  username: string
  displayName: string
  password: string
}) {
  return apiFetch<BackendRegisterResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function loginApi(payload: { email: string; password: string }) {
  return apiFetch<BackendLoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function logoutApi() {
  return apiFetch<{ msg?: string; logout?: any }>('/api/auth/logOut', {
    method: 'POST',
  })
}
