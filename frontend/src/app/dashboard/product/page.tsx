"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProductList.css"; // Import your custom CSS for styling

interface Product {
  product_id: number;
  name: string;
  description: string;
  category: number; // Adjust this based on how you handle category references
  unit: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

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
      if (error.response.status === 401 && !originalRequest._retry) {
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

  // Fetch all products
  useEffect(() => {
    axiosInstance
      .get("products/")
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch products");
        setIsLoading(false);
      });
  }, [axiosInstance]);

  // Create a new product
  const handleCreate = () => {
    if (!newProduct || !newProduct.name) {
      setError("Product name is required");
      toast.error("Product name is required!"); // Notification for error
      return;
    }

    axiosInstance
      .post("products/", newProduct)
      .then((response) => {
        setProducts([...products, response.data]);
        setNewProduct(null); // Clear the input after successful creation
        setError(null);
        toast.success("Product created successfully!"); // Notification for success
      })
      .catch(() => {
        setError("Failed to create product");
        toast.error("Failed to create product!"); // Notification for error
      });
  };

  // Update product
  const handleUpdate = () => {
    if (!selectedProduct || !selectedProduct.name) {
      setError("Name is required");
      toast.error("Name is required!"); // Notification for error
      return;
    }

    axiosInstance
      .put(`products/${selectedProduct.product_id}/`, selectedProduct)
      .then((response) => {
        const updatedProducts = products.map((prod) =>
          prod.product_id === selectedProduct.product_id ? response.data : prod
        );
        setProducts(updatedProducts);
        setEditMode(false);
        setSelectedProduct(null); // Clear selected product after update
        setError(null);
        toast.success("Product updated successfully!"); // Notification for success
      })
      .catch(() => {
        setError("Failed to update product");
        toast.error("Failed to update product!"); // Notification for error
      });
  };

  // Delete product
  const handleDelete = (product_id: number) => {
    axiosInstance
      .delete(`products/${product_id}/`)
      .then(() => {
        setProducts(products.filter((prod) => prod.product_id !== product_id));
        toast.success("Product deleted successfully!"); // Notification for success
      })
      .catch(() => {
        setError("Failed to delete product");
        toast.error("Failed to delete product!"); // Notification for error
      });
  };

  // Handle edit click
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditMode(true);
  };

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (editMode && selectedProduct) {
      setSelectedProduct({ ...selectedProduct, [field]: event.target.value });
    } else {
      setNewProduct({ ...newProduct, [field]: event.target.value } as Product);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-list">
      <h1>Product Management</h1>
  
      {/* Create new product */}
      <div className="create-product">
        <h2>Create New Product</h2>
        <div className="input-container">
          <input
            type="text"
            value={newProduct?.name || ""}
            onChange={(e) => handleInputChange(e, 'name')}
            placeholder="Enter product name"
            className="product-input"
          />
          <input
            type="text"
            value={newProduct?.description || ""}
            onChange={(e) => handleInputChange(e, 'description')}
            placeholder="Enter product description"
            className="product-input"
          />
          <input
            type="text"
            value={newProduct?.unit || ""}
            onChange={(e) => handleInputChange(e, 'unit')}
            placeholder="Enter product unit"
            className="product-input"
          />
          <button className="create-button" onClick={handleCreate}>
            Create Product
          </button>
        </div>
      </div>
  
      {/* Display list of products */}
      <div className="product-list-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Description</th>
              <th>Unit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.product_id}>
                {editMode && selectedProduct?.product_id === product.product_id ? (
                  <td colSpan={4}>
                    <div className="edit-product">
                      <input
                        type="text"
                        value={selectedProduct.name}
                        onChange={(e) => handleInputChange(e, 'name')}
                        className="product-input"
                      />
                      <input
                        type="text"
                        value={selectedProduct.description}
                        onChange={(e) => handleInputChange(e, 'description')}
                        className="product-input"
                      />
                      <input
                        type="text"
                        value={selectedProduct.unit}
                        onChange={(e) => handleInputChange(e, 'unit')}
                        className="product-input"
                      />
                      <button className="update-button" onClick={handleUpdate}>
                        Update
                      </button>
                      <button className="cancel-button" onClick={() => setEditMode(false)}>
                        Cancel
                      </button>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="product-name">{product.name}</td>
                    <td className="product-description">{product.description}</td>
                    <td className="product-unit">{product.unit}</td>
                    <td className="button-column">
                      <button className="edit-button" onClick={() => handleEditClick(product)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(product.product_id)}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Toast container for notifications */}
      <ToastContainer />
    </div>
  );
  
};

export default ProductList;
