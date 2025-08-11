const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

class ApiService {
  private baseURL: string
  private token: string | null = null
  private refreshToken: string | null = null
  private onUnauthorized?: () => void // callback to log out if refresh fails

  constructor(baseURL: string) {
    this.baseURL = baseURL
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token")
      const storedRefresh = localStorage.getItem("refresh")
      if (storedToken) this.setToken(storedToken)
      if (storedRefresh) this.setRefreshToken(storedRefresh)
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== "undefined" && token) {
      localStorage.setItem("token", token)
    }
  }

  setRefreshToken(refreshToken: string | null) {
    this.refreshToken = refreshToken
    if (typeof window !== "undefined" && refreshToken) {
      localStorage.setItem("refresh", refreshToken)
    }
  }

  setOnUnauthorized(callback: () => void) {
    this.onUnauthorized = callback
  }

  private async refreshAccessToken() {
    if (!this.refreshToken) throw new Error("No refresh token available")

    const res = await fetch(`${this.baseURL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: this.refreshToken }),
    })

    if (!res.ok) {
      throw new Error("Refresh token expired")
    }

    const data = await res.json()
    this.setToken(data.access) // update access token
    return data.access
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, retry = true): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, { ...options, headers })

    // Auto-refresh if unauthorized
    if (response.status === 401 && retry && this.refreshToken) {
      try {
        const newAccess = await this.refreshAccessToken()
        return this.request<T>(endpoint, options, false) // retry once
      } catch (error) {
        this.clearTokens()
        if (this.onUnauthorized) this.onUnauthorized()
        throw error
      }
    }

    let data: any
    try {
      data = await response.json()
    } catch {
      data = {}
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data as T
  }

  clearTokens() {
    this.token = null
    this.refreshToken = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("refresh")
    }
  }

  // ---------- AUTH ----------
  login(email: string, password: string) {
    return this.request<{ access: string; refresh: string; user: any }>("/token/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  register(userData: Record<string, unknown>) {
    return this.request<{ access: string; refresh: string; user: any }>("/auth/signup/", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  getUser() {
    return this.request<any>("/auth/user/")
  }

  // ---------- RESTAURANT ----------
  getProducts() {
    return this.request<any[]>("/restaurant/products/")
  }

  getCategories() {
    return this.request<any[]>("/restaurant/categories/")
  }

  getCustomers() {
    return this.request<any[]>("/restaurant/customers/")
  }

  getMenuItems() {
    return this.request<any[]>("/restaurant/menu-items/")
  }

  getSales() {
    return this.request<any[]>("/restaurant/sales/")
  }

  // ---------- POS ----------
  createOrder(orderData: Record<string, unknown>) {
    return this.request("/pos/orders/", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  }

  getOrders() {
    return this.request<any[]>("/pos/orders/")
  }
}

export const api = new ApiService(API_BASE_URL)
