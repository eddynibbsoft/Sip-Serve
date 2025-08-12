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
import { Plus, Edit, Trash2, Search, Building, User, Mail, Phone } from "lucide-react"

interface Supplier {
  supplier_id: number
  name: string
  contact_person: string
  phone_number: string
  email: string
  address: string
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    phone_number: "",
    email: "",
    address: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchSuppliers()
  }, [])

  useEffect(() => {
    const filtered = suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredSuppliers(filtered)
  }, [suppliers, searchTerm])

  const fetchSuppliers = async () => {
    try {
      const data = await api.getSuppliers()
      setSuppliers(data)
      setFilteredSuppliers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load suppliers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingSupplier) {
        await api.updateSupplier(editingSupplier.supplier_id, formData)
        toast({
          title: "Success",
          description: "Supplier updated successfully",
        })
      } else {
        await api.createSupplier(formData)
        toast({
          title: "Success",
          description: "Supplier created successfully",
        })
      }

      setDialogOpen(false)
      setEditingSupplier(null)
      setFormData({ name: "", contact_person: "", phone_number: "", email: "", address: "" })
      fetchSuppliers()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Operation failed",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      contact_person: supplier.contact_person,
      phone_number: supplier.phone_number,
      email: supplier.email,
      address: supplier.address,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      try {
        await api.deleteSupplier(id)
        toast({
          title: "Success",
          description: "Supplier deleted successfully",
        })
        fetchSuppliers()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete supplier",
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
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground">Manage your supplier relationships</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingSupplier(null)
                setFormData({ name: "", contact_person: "", phone_number: "", email: "", address: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                />
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
                {editingSupplier ? "Update Supplier" : "Create Supplier"}
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
              placeholder="Search suppliers..."
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
                <TableHead>Company</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.supplier_id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span className="font-medium">{supplier.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {supplier.contact_person && (
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3" />
                        <span>{supplier.contact_person}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3" />
                        <span className="text-sm">{supplier.email}</span>
                      </div>
                      {supplier.phone_number && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3" />
                          <span className="text-sm">{supplier.phone_number}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(supplier)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(supplier.supplier_id)}>
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
