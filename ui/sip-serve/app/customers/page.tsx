"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Search, Mail, Phone, MapPin } from "lucide-react"

interface Customer {
  customer_id: number
  first_name: string
  last_name: string
  email: string
  phone_number: string
  address: string
  created_at: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone_number.includes(searchTerm),
    )
    setFilteredCustomers(filtered)
  }, [customers, searchTerm])

  const fetchCustomers = async () => {
    try {
      const data = await api.getCustomers()
      setCustomers(data)
      setFilteredCustomers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingCustomer) {
        await api.updateCustomer(editingCustomer.customer_id, formData)
        toast({
          title: "Success",
          description: "Customer updated successfully",
        })
      } else {
        await api.createCustomer(formData)
        toast({
          title: "Success",
          description: "Customer created successfully",
        })
      }

      setDialogOpen(false)
      setEditingCustomer(null)
      setFormData({ first_name: "", last_name: "", email: "", phone_number: "", address: "" })
      fetchCustomers()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Operation failed",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone_number: customer.phone_number,
      address: customer.address,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        await api.deleteCustomer(id)
        toast({
          title: "Success",
          description: "Customer deleted successfully",
        })
        fetchCustomers()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete customer",
          variant: "destructive",
        })
      }
    }
  }

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
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer database</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCustomer(null)
                setFormData({ first_name: "", last_name: "", email: "", phone_number: "", address: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCustomer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingCustomer ? "Update Customer" : "Create Customer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.customer_id}>
                  <TableCell className="font-medium">
                    {customer.first_name} {customer.last_name}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      {customer.phone_number && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3" />
                          <span className="text-sm">{customer.phone_number}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer.address && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3" />
                        <span className="text-sm">{customer.address}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(customer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(customer.customer_id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
