'use client'

import { connectSocket, disconnectSocket } from "@/lib/socket"
import { useEffect } from "react"

export default function SocketProvider({children}: {children: React.ReactNode}) {
    useEffect(() =>{
        const token = localStorage.getItem('token')
        if (token) {
            connectSocket(token)
        }
        return ()=> {
            disconnectSocket()

        }
    },[])
    return children
}