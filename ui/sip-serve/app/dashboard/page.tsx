"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Package, Users, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    {
      title: "Total Sales",
      value: "$12,345",
      description: "Today's revenue",
      icon: DollarSign,
    },
    {
      title: "Products",
      value: "156",
      description: "Items in inventory",
      icon: Package,
    },
    {
      title: "Customers",
      value: "89",
      description: "Registered customers",
      icon: Users,
    },
    {
      title: "Orders",
      value: "23",
      description: "Orders today",
      icon: ShoppingCart,
    },
  ]

  const quickActions = [
    {
      title: "New Sale",
      description: "Process a new order",
      href: "/pos",
      roles: ["cashier", "manager", "admin"],
    },
    {
      title: "Add Product",
      description: "Add new product to inventory",
      href: "/products",
      roles: ["manager", "admin"],
    },
    {
      title: "View Reports",
      description: "Check sales analytics",
      href: "/reports",
      roles: ["manager", "admin"],
    },
    {
      title: "Manage Users",
      description: "User management",
      href: "/settings",
      roles: ["admin"],
    },
  ]

  const filteredActions = quickActions.filter((action) => (user?.role ? action.roles.includes(user.role) : false))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.first_name}! Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2 w-full bg-transparent"
                >
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
