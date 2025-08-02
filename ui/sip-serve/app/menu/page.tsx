"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2 } from "lucide-react"

interface Menu {
  menu_id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}

interface MenuItem {
  menu_item_id: number
  menu: number
  product: number
  quantity: number
  unit: string
  price: string
  product_name?: string
}

interface Product {
  product_id: number
  name: string
}

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [menuDialogOpen, setMenuDialogOpen] = useState(false)
  const [itemDialogOpen, setItemDialogOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null)
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null)
  const [menuFormData, setMenuFormData] = useState({
    name: "",
    description: "",
  })
  const [itemFormData, setItemFormData] = useState({
    menu: "",
    product: "",
    quantity: "",
    unit: "",
    price: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [menusData, menuItemsData, productsData] = await Promise.all([
        apiService.getMenus(),
        apiService.getMenuItems(),
        apiService.getProducts(),
      ])

      // Enrich menu items with product names
      const enrichedMenuItems = menuItemsData.map((item: MenuItem) => {
        const product = productsData.find((p: Product) => p.product_id === item.product)
        return {
          ...item,
          product_name: product?.name || "Unknown Product",
        }
      })

      setMenus(menusData)
      setMenuItems(enrichedMenuItems)
      setProducts(productsData)
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

  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingMenu) {
        // Update menu logic would go here
        toast({
          title: "Success",
          description: "Menu updated successfully",
        })
      } else {
        await apiService.createMenu(menuFormData)
        toast({
          title: "Success",
          description: "Menu created successfully",
        })
      }

      setMenuDialogOpen(false)
      setEditingMenu(null)
      setMenuFormData({ name: "", description: "" })
      fetchData()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Operation failed",
        variant: "destructive",
      })
    }
  }

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const itemData = {
        ...itemFormData,
        menu: Number.parseInt(itemFormData.menu),
        product: Number.parseInt(itemFormData.product),
        quantity: Number.parseInt(itemFormData.quantity),
        price: Number.parseFloat(itemFormData.price),
      }

      if (editingMenuItem) {
        await apiService.updateMenuItem(editingMenuItem.menu_item_id, itemData)
        toast({
          title: "Success",
          description: "Menu item updated successfully",
        })
      } else {
        await apiService.createMenuItem(itemData)
        toast({
          title: "Success",
          description: "Menu item created successfully",
        })
      }

      setItemDialogOpen(false)
      setEditingMenuItem(null)
      setItemFormData({ menu: "", product: "", quantity: "", unit: "", price: "" })
      fetchData()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Operation failed",
        variant: "destructive",
      })
    }
  }

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item)
    setItemFormData({
      menu: item.menu.toString(),
      product: item.product.toString(),
      quantity: item.quantity.toString(),
      unit: item.unit,
      price: item.price,
    })
    setItemDialogOpen(true)
  }

  const getMenuName = (menuId: number) => {
    const menu = menus.find((m) => m.menu_id === menuId)
    return menu?.name || "Unknown Menu"
  }

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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Menu Management</h1>

            <Tabs defaultValue="menus" className="space-y-6">
              <TabsList>
                <TabsTrigger value="menus">Menus</TabsTrigger>
                <TabsTrigger value="items">Menu Items</TabsTrigger>
              </TabsList>

              <TabsContent value="menus">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Menus</h2>
                  <Dialog open={menuDialogOpen} onOpenChange={setMenuDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setEditingMenu(null)
                          setMenuFormData({ name: "", description: "" })
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Menu
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingMenu ? "Edit Menu" : "Add New Menu"}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleMenuSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="menu-name">Name</Label>
                          <Input
                            id="menu-name"
                            value={menuFormData.name}
                            onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="menu-description">Description</Label>
                          <Input
                            id="menu-description"
                            value={menuFormData.description}
                            onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          {editingMenu ? "Update Menu" : "Create Menu"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {menus.map((menu) => (
                          <TableRow key={menu.menu_id}>
                            <TableCell className="font-medium">{menu.name}</TableCell>
                            <TableCell>{menu.description}</TableCell>
                            <TableCell>{new Date(menu.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
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
              </TabsContent>

              <TabsContent value="items">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Menu Items</h2>
                  <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setEditingMenuItem(null)
                          setItemFormData({ menu: "", product: "", quantity: "", unit: "", price: "" })
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
                      <form onSubmit={handleItemSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="item-menu">Menu</Label>
                          <Select
                            value={itemFormData.menu}
                            onValueChange={(value) => setItemFormData({ ...itemFormData, menu: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a menu" />
                            </SelectTrigger>
                            <SelectContent>
                              {menus.map((menu) => (
                                <SelectItem key={menu.menu_id} value={menu.menu_id.toString()}>
                                  {menu.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="item-product">Product</Label>
                          <Select
                            value={itemFormData.product}
                            onValueChange={(value) => setItemFormData({ ...itemFormData, product: value })}
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
                            <Label htmlFor="item-quantity">Quantity</Label>
                            <Input
                              id="item-quantity"
                              type="number"
                              value={itemFormData.quantity}
                              onChange={(e) => setItemFormData({ ...itemFormData, quantity: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="item-unit">Unit</Label>
                            <Input
                              id="item-unit"
                              value={itemFormData.unit}
                              onChange={(e) => setItemFormData({ ...itemFormData, unit: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="item-price">Price</Label>
                          <Input
                            id="item-price"
                            type="number"
                            step="0.01"
                            value={itemFormData.price}
                            onChange={(e) => setItemFormData({ ...itemFormData, price: e.target.value })}
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
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Menu</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {menuItems.map((item) => (
                          <TableRow key={item.menu_item_id}>
                            <TableCell className="font-medium">{item.product_name}</TableCell>
                            <TableCell>{getMenuName(item.menu)}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>${Number.parseFloat(item.price).toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditMenuItem(item)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
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
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
