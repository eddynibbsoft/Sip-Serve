"use client";
import { useState, useEffect } from "react";
import axios from "axios";
//import { toast } from "react-toastify"; // Import toast for notifications
import "react-toastify/dist/ReactToastify.css"; // Import CSS for notifications
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer

import "./CategoryList.css"; // Importing external CSS file for styling

interface Category {
  category_id: number;
  name: string;
}

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/canteen/",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Interceptor to handle token refresh if access token expires
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
          // Optionally, redirect to login page
        }
      }
      return Promise.reject(error);
    }
  );

  // Fetch all categories
  useEffect(() => {
    axiosInstance
      .get("categories/")
      .then((response) => {
        setCategories(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch categories");
        setIsLoading(false);
      });
  }, [axiosInstance]);

  // Create new category
  const handleCreate = () => {
    if (!newCategoryName) {
      setError("Category name is required");
      toast.error("Category name is required!"); // Notification for error
      return;
    }

    axiosInstance
      .post("categories/", { name: newCategoryName })
      .then((response) => {
        setCategories([...categories, response.data]);
        setNewCategoryName(""); // Clear the input after successful creation
        setError(null);
        toast.success("Category created successfully!"); // Notification for success
      })
      .catch(() => {
        setError("Failed to create category");
        toast.error("Failed to create category!"); // Notification for error
      });
  };

  // Update category
  const handleUpdate = () => {
    if (!selectedCategory || !selectedCategory.name) {
      setError("Name is required");
      toast.error("Name is required!"); // Notification for error
      return;
    }

    axiosInstance
      .put(`categories/${selectedCategory.category_id}/`, { name: selectedCategory.name })
      .then((response) => {
        const updatedCategories = categories.map((cat) =>
          cat.category_id === selectedCategory.category_id ? response.data : cat
        );
        setCategories(updatedCategories);
        setEditMode(false);
        setSelectedCategory(null); // Clear selected category after update
        setError(null);
        toast.success("Category updated successfully!"); // Notification for success
      })
      .catch(() => {
        setError("Failed to update category");
        toast.error("Failed to update category!"); // Notification for error
      });
  };

  // Delete category
  const handleDelete = (category_id: number) => {
    axiosInstance
      .delete(`categories/${category_id}/`)
      .then(() => {
        setCategories(categories.filter((cat) => cat.category_id !== category_id));
        toast.success("Category deleted successfully!"); // Notification for success
      })
      .catch((error) => {
        console.error("Delete error:", error); // Log error details for debugging
        setError("Failed to delete category");
        toast.error("Failed to delete category!"); // Notification for error
      });
  };

  // Handle edit click
  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setEditMode(true);
  };

  // Handle name input change during edit
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedCategory) {
      setSelectedCategory({ ...selectedCategory, name: event.target.value });
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="category-list">
      <h1>Category Management</h1>

      {/* Create new category */}
      <div className="create-category">
        <h2>Create New Category</h2>
        <div className="input-container">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="category-input"
          />
          <button className="create-button" onClick={handleCreate}>
            Create Category
          </button>
        </div>
      </div>

      {/* Display list of categories */}
      <div className="category-list-container">
        {/* <h2>All Categories</h2> */}
        <ol className="category-list-ordered">
          {categories.map((category) => (
            <li key={category.category_id} className="category-item">
              {editMode && selectedCategory?.category_id === category.category_id ? (
                <div className="edit-category">
                  <input
                    type="text"
                    value={selectedCategory.name}
                    onChange={handleNameChange}
                    className="category-input"
                  />
                  <button className="update-button" onClick={handleUpdate}>
                    Update
                  </button>
                  <button className="cancel-button" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="category-actions">
                  <div className="category-name">{category.name}</div>
                  <div className="button-column">
                    <button className="edit-button" onClick={() => handleEditClick(category)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => handleDelete(category.category_id)}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* Toast container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default CategoryList;
