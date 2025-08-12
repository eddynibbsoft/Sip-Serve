"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Search } from "lucide-react"

interface MenuItem {
  menu_item_id: number
  product: number
  product_name: string
  quantity: number
  unit: string
  price: string
}

interface Product {
  product_id: number
  name: string
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    unit: "",
    price: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = menuItems.filter((item) => item.product_name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredMenuItems(filtered)
  }, [menuItems, searchTerm])

  const fetchData = async () => {
    try {
      const [menuData, productsData] = await Promise.all([api.getMenuItems(), api.getProducts()])
      setMenuItems(menuData)
      setProducts(productsData)
      setFilteredMenuItems(menuData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const menuItemData = {
        product: Number.parseInt(formData.product),
        quantity: Number.parseInt(formData.quantity),
        unit: formData.unit,
        price: Number.parseFloat(formData.price),
      }

      if (editingMenuItem) {
        await api.updateMenuItem(editingMenuItem.menu_item_id, menuItemData)
        toast({
          title: "Success",
          description: "Menu item updated successfully",
        })
      } else {
        await api.createMenuItem(menuItemData)
        toast({
          title: "Success",
          description: "Menu item created successfully",
        })
      }

      setDialogOpen(false)
      setEditingMenuItem(null)
      setFormData({ product: "", quantity: "", unit: "", price: "" })
      fetchData()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Operation failed",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem)
    setFormData({
      product: menuItem.product.toString(),
      quantity: menuItem.quantity.toString(),
      unit: menuItem.unit,
      price: menuItem.price,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      try {
        await api.deleteMenuItem(id)
        toast({
          title: "Success",
          description: "Menu item deleted successfully",
        })
        fetchData()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete menu item",
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
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">Manage menu items and pricing</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingMenuItem(null)
                setFormData({ product: "", quantity: "", unit: "", price: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMenuItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select
                  value={formData.product}
                  onValueChange={(value) => setFormData({ ...formData, product: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.product_id} value={product.product_id.toString()}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingMenuItem ? "Update Menu Item" : "Create Menu Item"}
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
              placeholder="Search menu items..."
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
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMenuItems.map((item) => (
                <TableRow key={item.menu_item_id}>
                  <TableCell className="font-medium">{item.product_name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>${Number.parseFloat(item.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(item.menu_item_id)}>
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
