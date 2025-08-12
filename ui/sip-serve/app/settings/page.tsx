"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Settings, User, Bell, Database } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    companyName: "Sip & Serve Restaurant",
    taxRate: "8.25",
    currency: "USD",
    address: "123 Main Street, City, State 12345",
    phone: "+1 (555) 123-4567",
    email: "info@sipandserve.com",
    notifications: {
      lowStock: true,
      newOrders: true,
      dailyReports: false,
    },
    theme: "light",
    autoBackup: true,
  })

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    })
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your system preferences and configuration</p>
      </div>

      <div className="grid gap-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Business Information</span>
            </CardTitle>
            <CardDescription>Configure your restaurant's basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>User Profile</span>
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-muted-foreground capitalize">Role: {user?.role}</p>
              </div>
              <Button variant="outline">Edit Profile</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
              <Button variant="outline">Change Password</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Low Stock Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified when inventory is running low</p>
              </div>
              <Switch
                checked={settings.notifications.lowStock}
                onCheckedChange={(value) => handleNotificationChange("lowStock", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Order Notifications</p>
                <p className="text-sm text-muted-foreground">Receive alerts for new customer orders</p>
              </div>
              <Switch
                checked={settings.notifications.newOrders}
                onCheckedChange={(value) => handleNotificationChange("newOrders", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily Reports</p>
                <p className="text-sm text-muted-foreground">Receive daily sales and performance reports</p>
              </div>
              <Switch
                checked={settings.notifications.dailyReports}
                onCheckedChange={(value) => handleNotificationChange("dailyReports", value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>System Settings</span>
            </CardTitle>
            <CardDescription>System maintenance and backup options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Automatic Backup</p>
                <p className="text-sm text-muted-foreground">Automatically backup data daily</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(value) => setSettings({ ...settings, autoBackup: value })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Database Backup</p>
                <p className="text-sm text-muted-foreground">Create a manual backup of your data</p>
              </div>
              <Button variant="outline">Create Backup</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">System Logs</p>
                <p className="text-sm text-muted-foreground">View system activity and error logs</p>
              </div>
              <Button variant="outline">View Logs</Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
