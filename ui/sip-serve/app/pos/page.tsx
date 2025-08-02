"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"

interface MenuItem {
  id: number
  name: string
  price: string
  quantity: number
  category: string
}

interface CartItem extends MenuItem {
  cartQuantity: number
}

interface Customer {
  id: number
  name: string
  email: string
}

export default function POSPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [menuResponse, customersResponse] = await Promise.all([api.getMenuItems(), api.getCustomers()])
      setMenuItems(menuResponse)
      setCustomers(customersResponse)
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

  const addToCart = (item: MenuItem) => {
    if (item.quantity <= 0) {
      toast({
        title: "Out of Stock",
        description: `${item.name} is currently out of stock`,
        variant: "destructive",
      })
      return
    }

    setCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        if (existingItem.cartQuantity >= item.quantity) {
          toast({
            title: "Stock Limit",
            description: `Only ${item.quantity} ${item.name} available`,
            variant: "destructive",
          })
          return prev
        }
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, cartQuantity: cartItem.cartQuantity + 1 } : cartItem,
        )
      }
      return [...prev, { ...item, cartQuantity: 1 }]
    })
  }

  const updateCartQuantity = (id: number, change: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.cartQuantity + change
            if (newQuantity <= 0) {
              return null
            }
            if (newQuantity > item.quantity) {
              toast({
                title: "Stock Limit",
                description: `Only ${item.quantity} ${item.name} available`,
                variant: "destructive",
              })
              return item
            }
            return { ...item, cartQuantity: newQuantity }
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + Number.parseFloat(item.price) * item.cartQuantity, 0)
  }

  const processOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before processing order",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)
    try {
      const orderData = {
        customer: selectedCustomer ? Number.parseInt(selectedCustomer) : null,
        items: cart.map((item) => ({
          menu_item: item.id,
          quantity: item.cartQuantity,
          price: item.price,
        })),
        total_amount: calculateTotal(),
      }

      await api.createOrder(orderData)

      toast({
        title: "Success",
        description: "Order processed successfully!",
      })

      setCart([])
      setSelectedCustomer("")
      fetchData() // Refresh menu items to update stock
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process order",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
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
    <div className="flex h-full">
      {/* Menu Items */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Point of Sale</h1>
          <p className="text-muted-foreground">Select items to add to cart</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {menuItems.map((item) => (
            <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span>${Number.parseFloat(item.price).toFixed(2)}</span>
                  <Badge variant={item.quantity > 0 ? "secondary" : "destructive"}>Stock: {item.quantity}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => addToCart(item)} disabled={item.quantity <= 0} className="w-full">
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="w-96 border-l bg-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingCart className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Cart</h2>
        </div>

        <div className="mb-4">
          <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
            <SelectTrigger>
              <SelectValue placeholder="Select customer (optional)" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id.toString()}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 mb-6 max-h-96 overflow-auto">
          {cart.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Cart is empty</p>
          ) : (
            cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{item.name}</h4>
                    <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      ${Number.parseFloat(item.price).toFixed(2)} each
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => updateCartQuantity(item.id, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.cartQuantity}</span>
                      <Button variant="outline" size="sm" onClick={() => updateCartQuantity(item.id, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right mt-2 font-medium">
                    ${(Number.parseFloat(item.price) * item.cartQuantity).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-2xl font-bold">${calculateTotal().toFixed(2)}</span>
          </div>
          <Button onClick={processOrder} disabled={cart.length === 0 || processing} className="w-full" size="lg">
            {processing ? "Processing..." : "Process Order"}
          </Button>
        </div>
      </div>
    </div>
  )
}
