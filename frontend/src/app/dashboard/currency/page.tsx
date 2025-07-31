// CurrencyList.tsx
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CurrencyList.css"; // Import your custom CSS for styling

interface Currency {
  currency_id: number;
  currency_name: string;
}

const CurrencyList = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [newCurrency, setNewCurrency] = useState<Currency | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
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

  // Fetch all currencies
  useEffect(() => {
    axiosInstance
      .get("currencies/")
      .then((response) => {
        setCurrencies(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch currencies");
        setIsLoading(false);
      });
  }, [axiosInstance]);

  // Create a new currency
  const handleCreate = () => {
    if (!newCurrency || !newCurrency.currency_name) {
      setError("Currency name is required");
      toast.error("Currency name is required!"); // Notification for error
      return;
    }

    axiosInstance
      .post("currencies/", newCurrency)
      .then((response) => {
        setCurrencies([...currencies, response.data]);
        setNewCurrency(null); // Clear the input after successful creation
        setError(null);
        toast.success("Currency created successfully!"); // Notification for success
      })
      .catch(() => {
        setError("Failed to create currency");
        toast.error("Failed to create currency!"); // Notification for error
      });
  };

  // Update currency
  const handleUpdate = () => {
    if (!selectedCurrency || !selectedCurrency.currency_name) {
      setError("Currency name is required");
      toast.error("Currency name is required!"); // Notification for error
      return;
    }

    axiosInstance
      .put(`currencies/${selectedCurrency.currency_id}/`, selectedCurrency)
      .then((response) => {
        const updatedCurrencies = currencies.map((curr) =>
          curr.currency_id === selectedCurrency.currency_id ? response.data : curr
        );
        setCurrencies(updatedCurrencies);
        setEditMode(false);
        setSelectedCurrency(null); // Clear selected currency after update
        setError(null);
        toast.success("Currency updated successfully!"); // Notification for success
      })
      .catch(() => {
        setError("Failed to update currency");
        toast.error("Failed to update currency!"); // Notification for error
      });
  };

  // Delete currency
  const handleDelete = (currency_id: number) => {
    axiosInstance
      .delete(`currencies/${currency_id}/`)
      .then(() => {
        setCurrencies(currencies.filter((curr) => curr.currency_id !== currency_id));
        toast.success("Currency deleted successfully!"); // Notification for success
      })
      .catch(() => {
        setError("Failed to delete currency");
        toast.error("Failed to delete currency!"); // Notification for error
      });
  };

  // Handle edit click
  const handleEditClick = (currency: Currency) => {
    setSelectedCurrency(currency);
    setEditMode(true);
  };

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (editMode && selectedCurrency) {
      setSelectedCurrency({ ...selectedCurrency, [field]: event.target.value });
    } else {
      setNewCurrency({ ...newCurrency, [field]: event.target.value } as Currency);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="currency-list">
      <h1>Currency Management</h1>

      {/* Create new currency */}
      <div className="create-currency">
        <h2>Create New Currency</h2>
        <div className="input-container">
          <input
            type="text"
            value={newCurrency?.currency_name || ""}
            onChange={(e) => handleInputChange(e, 'currency_name')}
            placeholder="Enter currency name"
            className="currency-input"
          />
          <button className="create-button" onClick={handleCreate}>
            Create Currency
          </button>
        </div>
      </div>

      {/* Display list of currencies */}
      <div className="currency-list-container">
        <table className="currency-table">
          <thead>
            <tr>
              <th>Currency Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currencies.map((currency) => (
              <tr key={currency.currency_id}>
                {editMode && selectedCurrency?.currency_id === currency.currency_id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={selectedCurrency.currency_name}
                        onChange={(e) => handleInputChange(e, 'currency_name')}
                        className="currency-input"
                      />
                    </td>
                    <td>
                      <button className="update-button" onClick={handleUpdate}>
                        Update
                      </button>
                      <button className="cancel-button" onClick={() => setEditMode(false)}>
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{currency.currency_name}</td>
                    <td>
                      <button className="edit-button" onClick={() => handleEditClick(currency)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(currency.currency_id)}>
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

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default CurrencyList;
