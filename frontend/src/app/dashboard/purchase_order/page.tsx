"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PurchaseOrderList.css";

interface Supplier {
  supplier_id: number;
  name: string;
}

interface Product {
  product_id: number;
  name: string;
}

interface PurchaseOrder {
  purchase_order_id: number;
  supplier: number;
  order_date: string;
  created_at: string;
  updated_at: string;
}

interface PurchaseOrderItem {
  purchase_order_item_id: number;
  purchase_order: number;
  product: number;
  quantity: number;
  price: number;
  status: string;
}

const PurchaseOrderList = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [purchaseOrderItems, setPurchaseOrderItems] = useState<PurchaseOrderItem[]>([]);
  const [newPurchaseOrder, setNewPurchaseOrder] = useState<Partial<PurchaseOrder>>({});
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [newItem, setNewItem] = useState<Partial<PurchaseOrderItem>>({});
  const [selectedItem, setSelectedItem] = useState<PurchaseOrderItem | null>(null);

  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/restaurant/",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Interceptor to handle token refresh
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const tokenResponse = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh: refreshToken });
          localStorage.setItem("access_token", tokenResponse.data.access);
          axiosInstance.defaults.headers["Authorization"] = `Bearer ${tokenResponse.data.access}`;
          originalRequest.headers["Authorization"] = `Bearer ${tokenResponse.data.access}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          setError("Session expired, please log in again.");
        }
      }
      return Promise.reject(error);
    }
  );

  // Fetch all purchase orders, suppliers, and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseOrderRes, supplierRes, productRes] = await Promise.all([
          axiosInstance.get("purchase-orders/"),
          axiosInstance.get("suppliers/"),
          axiosInstance.get("products/"),
        ]);
        setPurchaseOrders(purchaseOrderRes.data);
        setSuppliers(supplierRes.data);
        setProducts(productRes.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [axiosInstance]);

  // Create a new purchase order
  const handleCreateOrder = async () => {
    if (!newPurchaseOrder.supplier) {
      toast.error("Supplier is required!");
      return;
    }

    try {
      const response = await axiosInstance.post("purchase-orders/", newPurchaseOrder);
      setPurchaseOrders([...purchaseOrders, response.data]);
      setNewPurchaseOrder({});
      toast.success("Purchase order created successfully!");
    } catch (err) {
      toast.error("Failed to create purchase order!");
    }
  };

  // Create a new purchase order item
  const handleCreateItem = async () => {
    if (!newItem.product || !newItem.quantity || !newItem.price) {
      toast.error("Product, quantity, and price are required!");
      return;
    }

    try {
      const response = await axiosInstance.post("purchase-order-items/", { ...newItem, purchase_order: selectedOrder?.purchase_order_id });
      setPurchaseOrderItems([...purchaseOrderItems, response.data]);
      setNewItem({});
      toast.success("Purchase order item created successfully!");
    } catch (err) {
      toast.error("Failed to create purchase order item!");
    }
  };

  // Update purchase order item status
  const handleUpdateStatus = async (itemId: number, newStatus: string) => {
    try {
      const response = await axiosInstance.put(`purchase-order-items/${itemId}/`, { status: newStatus });
      const updatedItems = purchaseOrderItems.map((item) =>
        item.purchase_order_item_id === itemId ? response.data : item
      );
      setPurchaseOrderItems(updatedItems);
      toast.success("Purchase order item status updated!");
    } catch (err) {
      toast.error("Failed to update purchase order item status!");
    }
  };

  // Delete purchase order item
  const handleDeleteItem = async (id: number) => {
    try {
      await axiosInstance.delete(`purchase-order-items/${id}/`);
      setPurchaseOrderItems(purchaseOrderItems.filter((item) => item.purchase_order_item_id !== id));
      toast.success("Purchase order item deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete purchase order item!");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="purchase-order-list">
      <h1>Purchase Orders</h1>

      {/* Create Purchase Order */}
      <div className="create-purchase-order">
        <h2>Create New Purchase Order</h2>
        <select
          value={newPurchaseOrder.supplier || ""}
          onChange={(e) => setNewPurchaseOrder({ ...newPurchaseOrder, supplier: parseInt(e.target.value) })}
        >
          <option value="" key="default">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.supplier_id} value={supplier.supplier_id}>
              {supplier.name}
            </option>
          ))}
        </select>
        <button onClick={handleCreateOrder}>Create Purchase Order</button>
      </div>

      {/* Display Purchase Orders */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Supplier</th>
            <th>Order Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {purchaseOrders.map((po) => (
            <tr key={po.purchase_order_id}>
              <td>{po.purchase_order_id}</td>
              <td>{suppliers.find((s) => s.supplier_id === po.supplier)?.name || "Unknown"}</td>
              <td>{new Date(po.order_date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => setSelectedOrder(po)}>View Items</button>
                <button onClick={() => handleDeleteItem(po.purchase_order_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div>
          <h3>Purchase Order Items</h3>
          <div>
            <select
              value={newItem.product || ""}
              onChange={(e) => setNewItem({ ...newItem, product: parseInt(e.target.value) })}
            >
              <option value="" key="default">Select Product</option>
              {products.map((product) => (
                <option key={product.product_id} value={product.product_id}>
                  {product.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity || ""}
              onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price || ""}
              onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
            />
            <button onClick={handleCreateItem}>Add Item</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrderItems
                .filter((item) => item.purchase_order === selectedOrder.purchase_order_id)
                .map((item) => (
                  <tr key={item.purchase_order_item_id}>
                    <td>{products.find((p) => p.product_id === item.product)?.name || "Unknown"}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item.purchase_order_item_id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => { setSelectedItem(item); }}>Edit</button>
                      <button onClick={() => handleDeleteItem(item.purchase_order_item_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {selectedItem && (
            <div>
              <h3>Edit Purchase Order Item</h3>
              <input
                type="number"
                value={selectedItem.quantity}
                onChange={(e) => setSelectedItem({ ...selectedItem, quantity: parseInt(e.target.value) })}
                placeholder="Quantity"
              />
              <input
                type="number"
                value={selectedItem.price}
                onChange={(e) => setSelectedItem({ ...selectedItem, price: parseFloat(e.target.value) })}
                placeholder="Price"
              />
              <button onClick={() => handleUpdateStatus(selectedItem.purchase_order_item_id, selectedItem.status)}>
                Update Item
              </button>
              <button onClick={() => setSelectedItem(null)}>Cancel</button>
            </div>
          )}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default PurchaseOrderList;
