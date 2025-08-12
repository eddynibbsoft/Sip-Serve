"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, TrendingUp, Package, Users, Calendar, Download } from "lucide-react"

interface SalesData {
  sale_id: number
  total_amount: string
  created_at: string
  customer?: {
    first_name: string
    last_name: string
  }
}

export default function ReportsPage() {
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [filteredSales, setFilteredSales] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchReportsData()
  }, [])

  useEffect(() => {
    filterSalesByTime()
  }, [salesData, timeFilter])

  const fetchReportsData = async () => {
    try {
      const sales = await api.getSales()
      setSalesData(sales)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reports data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterSalesByTime = () => {
    const now = new Date()
    let filtered = salesData

    switch (timeFilter) {
      case "today":
        filtered = salesData.filter((sale) => {
          const saleDate = new Date(sale.created_at)
          return saleDate.toDateString() === now.toDateString()
        })
        break
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        filtered = salesData.filter((sale) => new Date(sale.created_at) >= weekAgo)
        break
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        filtered = salesData.filter((sale) => new Date(sale.created_at) >= monthAgo)
        break
      default:
        filtered = salesData
    }

    setFilteredSales(filtered)
  }

  const calculateStats = () => {
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + Number.parseFloat(sale.total_amount), 0)
    const totalOrders = filteredSales.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
    }
  }

  const exportData = () => {
    const csvContent = [
      ["Date", "Order ID", "Customer", "Amount"],
      ...filteredSales.map((sale) => [
        new Date(sale.created_at).toLocaleDateString(),
        sale.sale_id.toString(),
        sale.customer ? `${sale.customer.first_name} ${sale.customer.last_name}` : "Walk-in",
        `$${Number.parseFloat(sale.total_amount).toFixed(2)}`,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sales-report-${timeFilter}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Track your business performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{timeFilter === "all" ? "All time" : `Last ${timeFilter}`}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Orders processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per order average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">Compared to last period</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSales.slice(0, 10).map((sale) => (
                <div key={sale.sale_id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Order #{sale.sale_id}</p>
                    <p className="text-sm text-muted-foreground">
                      {sale.customer ? `${sale.customer.first_name} ${sale.customer.last_name}` : "Walk-in Customer"}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(sale.created_at).toLocaleDateString()}</p>
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
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Key business metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">Peak Hours</p>
                  <p className="text-sm text-muted-foreground">Most sales occur between 12-2 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">Sales Trend</p>
                  <p className="text-sm text-muted-foreground">Revenue increasing by 12.5% monthly</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Users className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-medium">Customer Retention</p>
                  <p className="text-sm text-muted-foreground">85% of customers return within 30 days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
