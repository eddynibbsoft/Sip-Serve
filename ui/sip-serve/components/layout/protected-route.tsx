"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, token, loading } = useAuth()
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (loading || hasRedirected.current) return

    if (!user && !token) {
      hasRedirected.current = true
      router.push("/login")
    } else if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      hasRedirected.current = true
      router.push("/dashboard") // fallback route
    }
  }, [user, token, loading, router, allowedRoles])

  // Show loading indicator while auth state is being determined
  if (loading || (token && !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    // This should ideally not be reached if the useEffect redirect works correctly,
    // but as a fallback, we prevent rendering children.
    return null
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) return null

  return <>{children}</>
}
