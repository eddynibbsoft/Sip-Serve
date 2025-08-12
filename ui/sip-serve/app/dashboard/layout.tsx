"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { ProtectedRoute } from "@/components/layout/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
