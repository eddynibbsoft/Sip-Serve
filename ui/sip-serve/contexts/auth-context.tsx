"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: "cashier" | "manager" | "admin"
  is_verified: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
}

interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  role: "cashier" | "manager" | "admin"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token")
      const storedUser = localStorage.getItem("user")

      if (storedToken && storedUser && storedUser !== "undefined") {
        setToken(storedToken)
        try {
          const parsedUser = JSON.parse(storedUser)
          if (parsedUser && typeof parsedUser === "object") {
            setUser(parsedUser)
          } else {
            localStorage.removeItem("user")
            localStorage.removeItem("token")
          }
        } catch (parseError) {
          console.error("Error parsing stored user data:", parseError)
          localStorage.removeItem("user")
          localStorage.removeItem("token")
        }
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }

      const data = await response.json()

      setToken(data.access)
      setUser(data.user)

      localStorage.setItem("token", data.access)
      localStorage.setItem("user", JSON.stringify(data.user))

      router.push("/dashboard")
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Registration failed")
      }

      const data = await response.json()

      setToken(data.access)
      setUser(data.user)

      localStorage.setItem("token", data.access)
      localStorage.setItem("user", JSON.stringify(data.user))

      router.push("/dashboard")
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
