"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Package, Users, ShoppingCart, TrendingUp, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    {
      title: "Today's Revenue",
      value: "$2,847.50",
      description: "+12.5% from yesterday",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "+12.5%",
    },
    {
      title: "Products in Stock",
      value: "1,247",
      description: "8 items low stock",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "8 low",
    },
    {
      title: "Active Customers",
      value: "342",
      description: "+23 new this week",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "+23",
    },
    {
      title: "Orders Today",
      value: "89",
      description: "15 pending orders",
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      trend: "15 pending",
    },
  ]

  const quickActions = [
    {
      title: "New Sale",
      description: "Process a new customer order",
      href: "/pos",
      icon: ShoppingCart,
      color: "bg-gradient-to-r from-green-500 to-green-600",
    },
    {
      title: "Add Product",
      description: "Add new items to inventory",
      href: "/products",
      icon: Package,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: "View Reports",
      description: "Check sales analytics & insights",
      href: "/reports",
      icon: TrendingUp,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
    {
      title: "Manage Settings",
      description: "Configure system settings",
      href: "/settings",
      icon: AlertCircle,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
    },
  ]

  const recentActivity = [
    { action: "New order #1234", time: "2 minutes ago", customer: "John Doe", amount: "$45.50" },
    { action: "Product added", time: "15 minutes ago", customer: "Admin", amount: "Latte Mix" },
    { action: "Customer registered", time: "1 hour ago", customer: "Jane Smith", amount: "New" },
    { action: "Payment processed", time: "2 hours ago", customer: "Mike Johnson", amount: "$23.75" },
  ]

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.first_name}! ☕</h1>
            <p className="text-gray-600 mt-2 text-lg">Here's what's happening at your restaurant today</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">{stat.description}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      stat.trend.includes("+") ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
              <CardDescription className="text-gray-600">Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Link key={action.title} href={action.href}>
                      <Button
                        variant="outline"
                        className="h-auto p-6 flex flex-col items-start space-y-3 w-full bg-gradient-to-br from-white to-gray-50 border-2 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className={`p-3 rounded-lg ${action.color} text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">{action.title}</div>
                          <div className="text-sm text-gray-600 mt-1">{action.description}</div>
                        </div>
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Recent Activity</CardTitle>
            <CardDescription className="text-gray-600">Latest updates from your restaurant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{activity.amount}</p>
                    <p className="text-xs text-gray-500">{activity.customer}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
