"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./InventoryTransactionList.css"; // Custom CSS for styling

interface Product {
  product_id: number;
  name: string;
}

interface InventoryTransaction {
  transaction_id: number;
  product: number;
  quantity: number;
  transaction_type: string;
  transaction_date: string;
  price: number;
}

const InventoryTransactionList = () => {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<Partial<InventoryTransaction>>({});
  const [selectedTransaction, setSelectedTransaction] = useState<InventoryTransaction | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch all transactions and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionRes, productRes] = await Promise.all([
          axiosInstance.get("inventory-transactions/"),
          axiosInstance.get("products/"),
        ]);
        setTransactions(transactionRes.data);
        setProducts(productRes.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [axiosInstance]);

  // Create a new transaction
  const handleCreateTransaction = async () => {
    if (!newTransaction.product || !newTransaction.quantity || !newTransaction.price || !newTransaction.transaction_type) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await axiosInstance.post("inventory-transactions/", newTransaction);
      setTransactions([...transactions, response.data]);
      setNewTransaction({});
      toast.success("Inventory transaction created successfully!");
    } catch (err) {
      toast.error("Failed to create inventory transaction!");
    }
  };

  // Update a transaction
  const handleUpdateTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      const response = await axiosInstance.put(`inventory-transactions/${selectedTransaction.transaction_id}/`, selectedTransaction);
      const updatedTransactions = transactions.map((transaction) =>
        transaction.transaction_id === selectedTransaction.transaction_id ? response.data : transaction
      );
      setTransactions(updatedTransactions);
      setSelectedTransaction(null);
      toast.success("Inventory transaction updated!");
    } catch (err) {
      toast.error("Failed to update inventory transaction!");
    }
  };

  // Delete a transaction
  const handleDeleteTransaction = async (id: number) => {
    try {
      await axiosInstance.delete(`inventory-transactions/${id}/`);
      setTransactions(transactions.filter((transaction) => transaction.transaction_id !== id));
      toast.success("Inventory transaction deleted!");
    } catch (err) {
      toast.error("Failed to delete inventory transaction!");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="inventory-transaction-list">
      <h1>Inventory Transactions</h1>

      {/* Create Inventory Transaction */}
      <div className="create-inventory-transaction">
        <h2>Create New Transaction</h2>
        <select
          value={newTransaction.product || ""}
          onChange={(e) => setNewTransaction({ ...newTransaction, product: parseInt(e.target.value) })}
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
          value={newTransaction.quantity || ""}
          onChange={(e) => setNewTransaction({ ...newTransaction, quantity: parseInt(e.target.value) })}
          placeholder="Quantity"
        />
        <input
          type="number"
          value={newTransaction.price || ""}
          onChange={(e) => setNewTransaction({ ...newTransaction, price: parseFloat(e.target.value) })}
          placeholder="Price"
        />
        <select
          value={newTransaction.transaction_type || ""}
          onChange={(e) => setNewTransaction({ ...newTransaction, transaction_type: e.target.value })}
        >
          <option value="" key="default">Select Transaction Type</option>
          <option value="purchase">Purchase</option>
          <option value="return">Return</option>
          <option value="adjustment">Adjustment</option>
        </select>
        <button onClick={handleCreateTransaction}>Create</button>
      </div>

      {/* Display Inventory Transactions */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Transaction Type</th>
            <th>Transaction Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.transaction_id}>
              <td>{transaction.transaction_id}</td>
              <td>{products.find((p) => p.product_id === transaction.product)?.name || "Unknown"}</td>
              <td>{transaction.quantity}</td>
              <td>{transaction.price}</td>
              <td>{transaction.transaction_type}</td>
              <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => setSelectedTransaction(transaction)}>Edit</button>
                <button onClick={() => handleDeleteTransaction(transaction.transaction_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Selected Transaction */}
      {selectedTransaction && (
        <div className="edit-transaction">
          <h3>Edit Transaction</h3>
          <select
            value={selectedTransaction.product}
            onChange={(e) => setSelectedTransaction({ ...selectedTransaction, product: parseInt(e.target.value) })}
          >
            {products.map((product) => (
              <option key={product.product_id} value={product.product_id}>
                {product.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={selectedTransaction.quantity}
            onChange={(e) => setSelectedTransaction({ ...selectedTransaction, quantity: parseInt(e.target.value) })}
            placeholder="Quantity"
          />
          <input
            type="number"
            value={selectedTransaction.price}
            onChange={(e) => setSelectedTransaction({ ...selectedTransaction, price: parseFloat(e.target.value) })}
            placeholder="Price"
          />
          <select
            value={selectedTransaction.transaction_type}
            onChange={(e) => setSelectedTransaction({ ...selectedTransaction, transaction_type: e.target.value })}
          >
            <option value="purchase">Purchase</option>
            <option value="return">Return</option>
            <option value="adjustment">Adjustment</option>
          </select>
          <button onClick={handleUpdateTransaction}>Update</button>
          <button onClick={() => setSelectedTransaction(null)}>Cancel</button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default InventoryTransactionList;

