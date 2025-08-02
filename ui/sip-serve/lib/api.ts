const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

class ApiService {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  setToken(token: string | null) {
    this.token = token
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: any) {
    return this.request("/auth/signup/", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  // Restaurant endpoints
  async getProducts() {
    return this.request("/restaurant/products/")
  }

  async getCategories() {
    return this.request("/restaurant/categories/")
  }

  async getCustomers() {
    return this.request("/restaurant/customers/")
  }

  async getMenuItems() {
    return this.request("/restaurant/menu-items/")
  }

  async getSales() {
    return this.request("/restaurant/sales/")
  }

  // POS endpoints
  async createOrder(orderData: any) {
    return this.request("/pos/orders/", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  }

  async getOrders() {
    return this.request("/pos/orders/")
  }
}

export const api = new ApiService(API_BASE_URL)
