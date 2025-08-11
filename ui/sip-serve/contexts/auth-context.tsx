"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: "cashier" | "manager" | "admin"
  is_verified: boolean
}

interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  role: "cashier" | "manager" | "admin"
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const clearStorage = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("refresh")
    localStorage.removeItem("user")
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    api.clearTokens()
    clearStorage()
    router.push("/login")
  }, [router, clearStorage])

  useEffect(() => {
    api.setOnUnauthorized(() => logout())
  }, [logout])

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      api.setToken(storedToken)
      setToken(storedToken)
      api
        .getUser()
        .then((userData) => {
          setUser(userData)
          localStorage.setItem("user", JSON.stringify(userData))
        })
        .catch(() => {
          // Invalid token, clear session
          logout()
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [logout])

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password)
    api.setToken(data.access)
    api.setRefreshToken(data.refresh)
    setToken(data.access)
    localStorage.setItem("token", data.access)
    localStorage.setItem("refresh", data.refresh)

    const userData = await api.getUser()
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const register = async (userData: RegisterData) => {
    const data = await api.register(userData)
    api.setToken(data.access)
    api.setRefreshToken(data.refresh)
    setToken(data.access)
    localStorage.setItem("token", data.access)
    localStorage.setItem("refresh", data.refresh)

    const newUser = await api.getUser()
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}