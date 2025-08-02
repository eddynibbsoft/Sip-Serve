"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiService } from "@/lib/api"
import { BarChart3, TrendingUp, DollarSign, Package } from "lucide-react"

export default function ReportsPage() {
  const [salesData, setSalesData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportsData()
  }, [])

  const fetchReportsData = async () => {
    try {
      const sales = await apiService.getSales()
      setSalesData(sales)
    } catch (error) {
      console.error("Error fetching reports data:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalRevenue = salesData.reduce((sum, sale) => sum + Number.parseFloat(sale.total_amount || 0), 0)
  const totalOrders = salesData.length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["manager", "admin"]}>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["manager", "admin"]}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Reports & Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">All time revenue</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground">Orders processed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Per order average</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Recent sales performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesData.slice(0, 5).map((sale, index) => (
                      <div key={sale.sale_id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Sale #{sale.sale_id}</p>
                          <p className="text-sm text-gray-500">{sale.description || "No description"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${Number.parseFloat(sale.total_amount).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <BarChart3 className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium">Sales Growth</p>
                        <p className="text-sm text-gray-500">Tracking sales performance</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <TrendingUp className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="font-medium">Revenue Trends</p>
                        <p className="text-sm text-gray-500">Monitor revenue patterns</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Package className="h-8 w-8 text-purple-500" />
                      <div>
                        <p className="font-medium">Inventory Status</p>
                        <p className="text-sm text-gray-500">Track stock levels</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
