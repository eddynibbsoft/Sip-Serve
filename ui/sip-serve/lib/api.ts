const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = localStorage.getItem("token")

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: "GET" })
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" })
  }

  // Specific API methods
  async getProducts() {
    return this.get("/restaurant/products/")
  }

  async createProduct(data: any) {
    return this.post("/restaurant/products/", data)
  }

  async updateProduct(id: number, data: any) {
    return this.put(`/restaurant/products/${id}/`, data)
  }

  async deleteProduct(id: number) {
    return this.delete(`/restaurant/products/${id}/`)
  }

  async getCategories() {
    return this.get("/restaurant/categories/")
  }

  async getCustomers() {
    return this.get("/restaurant/customers/")
  }

  async createCustomer(data: any) {
    return this.post("/restaurant/customers/", data)
  }

  async updateCustomer(id: number, data: any) {
    return this.put(`/restaurant/customers/${id}/`, data)
  }

  async deleteCustomer(id: number) {
    return this.delete(`/restaurant/customers/${id}/`)
  }

  async createOrder(data: any) {
    return this.post("/pos/sales/", data)
  }

  async getSales() {
    return this.get("/pos/sales/")
  }
}

export const api = new ApiClient(API_BASE_URL)
