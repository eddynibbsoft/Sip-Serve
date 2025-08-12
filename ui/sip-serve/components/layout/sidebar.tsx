"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  Star,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Coffee,
  User,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home, roles: ["admin", "manager", "cashier"] },
  { name: "POS", href: "/pos", icon: ShoppingCart, roles: ["admin", "manager", "cashier"] },
  { name: "Products", href: "/products", icon: Package, roles: ["admin", "manager"] },
  { name: "Customers", href: "/customers", icon: Users, roles: ["admin", "manager", "cashier"] },
  { name: "Menu", href: "/menu", icon: Star, roles: ["admin", "manager"] },
  { name: "Suppliers", href: "/suppliers", icon: Truck, roles: ["admin", "manager"] },
  { name: "Reports", href: "/reports", icon: BarChart3, roles: ["admin", "manager"] },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["admin"] },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const filteredNavigation = navigation.filter((item) => (user?.role ? item.roles.includes(user.role) : false))

  const handleLogout = () => {
    logout()
  }

  return (
    <div
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Sip & Serve</h1>
                <p className="text-xs text-gray-500">POS System</p>
              </div>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="p-1.5">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-10 ${collapsed ? "px-2" : "px-3"} ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className={`w-5 h-5 ${collapsed ? "" : "mr-3"} flex-shrink-0`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`w-full ${collapsed ? "px-2" : "justify-start px-3"} h-12`}>
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                    {user.first_name.charAt(0)}
                    {user.last_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="ml-3 text-left flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
