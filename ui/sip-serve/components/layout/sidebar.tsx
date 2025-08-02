"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Menu,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["cashier", "manager", "admin"],
  },
  {
    title: "POS",
    href: "/pos",
    icon: ShoppingCart,
    roles: ["cashier", "manager", "admin"],
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
    roles: ["manager", "admin"],
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
    roles: ["cashier", "manager", "admin"],
  },
  {
    title: "Menu",
    href: "/menu",
    icon: Menu,
    roles: ["manager", "admin"],
  },
  {
    title: "Suppliers",
    href: "/suppliers",
    icon: Truck,
    roles: ["manager", "admin"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: ["manager", "admin"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin"],
  },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const filteredMenuItems = menuItems.filter((item) => (user?.role ? item.roles.includes(user.role) : false))

  return (
    <div
      className={cn("flex flex-col h-screen bg-card border-r transition-all duration-300", collapsed ? "w-16" : "w-64")}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h2 className="text-lg font-semibold">Sip & Serve</h2>}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start", collapsed && "px-2")}
              >
                <Icon className="h-4 w-4" />
                {!collapsed && <span className="ml-2">{item.title}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        {!collapsed && user && (
          <div className="mb-4 text-sm">
            <p className="font-medium">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-muted-foreground capitalize">{user.role}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-destructive hover:text-destructive", collapsed && "px-2")}
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  )
}
