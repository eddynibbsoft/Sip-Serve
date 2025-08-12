"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Minus, ShoppingCart, User, CreditCard, Trash2 } from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
  image?: string
}

interface CartItem extends Product {
  quantity: number
}

interface Customer {
  id: number
  name: string
  email: string
  phone: string
}

const products: Product[] = [
  { id: 1, name: "Espresso", price: 3.5, category: "Coffee", stock: 50 },
  { id: 2, name: "Cappuccino", price: 4.25, category: "Coffee", stock: 45 },
  { id: 3, name: "Latte", price: 4.75, category: "Coffee", stock: 40 },
  { id: 4, name: "Americano", price: 3.25, category: "Coffee", stock: 55 },
  { id: 5, name: "Croissant", price: 2.5, category: "Pastry", stock: 20 },
  { id: 6, name: "Muffin", price: 3.0, category: "Pastry", stock: 15 },
  { id: 7, name: "Sandwich", price: 6.5, category: "Food", stock: 25 },
  { id: 8, name: "Salad", price: 8.75, category: "Food", stock: 18 },
]

const customers: Customer[] = [
  { id: 1, name: "Walk-in Customer", email: "", phone: "" },
  { id: 2, name: "John Doe", email: "john@example.com", phone: "+1234567890" },
  { id: 3, name: "Jane Smith", email: "jane@example.com", phone: "+1234567891" },
  { id: 4, name: "Mike Johnson", email: "mike@example.com", phone: "+1234567892" },
]

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(customers[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [paymentMethod, setPaymentMethod] = useState("cash")

  const categories = ["All", "Coffee", "Pastry", "Food"]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter((item) => item.id !== id))
    } else {
      const product = products.find((p) => p.id === id)
      if (product && quantity <= product.stock) {
        setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
      }
    }
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  const handleCheckout = () => {
    if (cart.length === 0) return

    // Here you would typically send the order to your backend
    alert(`Order placed successfully!\nTotal: $${total.toFixed(2)}\nPayment: ${paymentMethod}`)
    setCart([])
    setSelectedCustomer(customers[0])
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Products Section */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Point of Sale</h1>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-2xl">☕</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</span>
                  <Badge variant={product.stock > 10 ? "default" : "destructive"}>{product.stock} left</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Current Order
          </h2>

          {/* Customer Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
            <Select
              value={selectedCustomer.id.toString()}
              onValueChange={(value) => {
                const customer = customers.find((c) => c.id === Number.parseInt(value))
                if (customer) setSelectedCustomer(customer)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {customer.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No items in cart</p>
              <p className="text-sm">Add products to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Section */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Credit Card</SelectItem>
                  <SelectItem value="mobile">Mobile Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleCheckout} className="w-full h-12 text-lg font-semibold" disabled={cart.length === 0}>
              <CreditCard className="h-5 w-5 mr-2" />
              Complete Order
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
