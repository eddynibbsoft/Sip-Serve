import type React from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Sidebar } from "@/components/layout/sidebar"

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={["cashier", "manager", "admin"]}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
