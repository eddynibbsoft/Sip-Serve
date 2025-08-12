"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")

        if (token && userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error("Failed to parse user data:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock authentication - replace with real API call
      const mockUser = {
        id: 1,
        email: email,
        first_name: "Edmore",
        last_name: "Munemo",
        role: "admin",
      }

      const mockToken = "mock-jwt-token-" + Date.now()

      localStorage.setItem("token", mockToken)
      localStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)

      router.push("/dashboard")
    } catch (error) {
      throw new Error("Invalid credentials")
    }
  }

  const register = async (userData: any) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock registration - replace with real API call
      const newUser = {
        id: Date.now(),
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role || "cashier",
      }

      const mockToken = "mock-jwt-token-" + Date.now()

      localStorage.setItem("token", mockToken)
      localStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)

      router.push("/dashboard")
    } catch (error) {
      throw new Error("Registration failed")
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
