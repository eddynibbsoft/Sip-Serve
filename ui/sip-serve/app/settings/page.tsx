"use client"

import { ProtectedRoute } from "@/components/layout/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>Configure system-wide settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" placeholder="Your Restaurant Name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                      <Input id="tax-rate" type="number" step="0.01" placeholder="8.25" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input id="address" placeholder="123 Main St, City, State 12345" />
                  </div>
                  <Button>Save Configuration</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Current User</p>
                        <p className="text-sm text-gray-500">
                          {user?.first_name} {user?.last_name} ({user?.role})
                        </p>
                      </div>
                      <Button variant="outline">Edit Profile</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">User Roles</p>
                        <p className="text-sm text-gray-500">Manage user permissions and access levels</p>
                      </div>
                      <Button variant="outline">Manage Roles</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Maintenance</CardTitle>
                  <CardDescription>System maintenance and backup options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Database Backup</p>
                        <p className="text-sm text-gray-500">Create a backup of your data</p>
                      </div>
                      <Button variant="outline">Create Backup</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">System Logs</p>
                        <p className="text-sm text-gray-500">View system activity and error logs</p>
                      </div>
                      <Button variant="outline">View Logs</Button>
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
