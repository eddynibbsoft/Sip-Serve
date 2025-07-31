"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SupplierList.css";

interface Supplier {
  supplier_id: number;
  name: string;
  contact_person?: string;
  phone_number?: string;
  email: string;
  address?: string;
}

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({});
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
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

  // Fetch all suppliers
  useEffect(() => {
    axiosInstance
      .get("suppliers/")
      .then((response) => {
        setSuppliers(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch suppliers");
        setIsLoading(false);
      });
  }, []);

  // Create a new supplier
  const handleCreate = () => {
    if (!newSupplier.name || !newSupplier.email) {
      toast.error("Name and Email are required!");
      return;
    }

    axiosInstance
      .post("suppliers/", newSupplier)
      .then((response) => {
        setSuppliers([...suppliers, response.data]);
        setNewSupplier({});
        toast.success("Supplier created successfully!");
      })
      .catch(() => toast.error("Failed to create supplier!"));
  };

  // Update supplier
  const handleUpdate = () => {
    if (!selectedSupplier) return;

    axiosInstance
      .put(`suppliers/${selectedSupplier.supplier_id}/`, selectedSupplier)
      .then((response) => {
        const updatedSuppliers = suppliers.map((sup) =>
          sup.supplier_id === selectedSupplier.supplier_id ? response.data : sup
        );
        setSuppliers(updatedSuppliers);
        setEditMode(false);
        setSelectedSupplier(null);
        toast.success("Supplier updated successfully!");
      })
      .catch(() => toast.error("Failed to update supplier!"));
  };

  // Delete supplier
  const handleDelete = (supplier_id: number) => {
    axiosInstance
      .delete(`suppliers/${supplier_id}/`)
      .then(() => {
        setSuppliers(suppliers.filter((sup) => sup.supplier_id !== supplier_id));
        toast.success("Supplier deleted successfully!");
      })
      .catch(() => toast.error("Failed to delete supplier!"));
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Supplier
  ) => {
    if (editMode && selectedSupplier) {
      setSelectedSupplier({ ...selectedSupplier, [field]: event.target.value });
    } else {
      setNewSupplier({ ...newSupplier, [field]: event.target.value });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="supplier-list">
      <h1>Supplier Management</h1>

      {/* Create Supplier */}
      <div className="create-supplier">
        <h2>Create New Supplier</h2>
        <input
          type="text"
          value={newSupplier.name || ""}
          onChange={(e) => handleInputChange(e, "name")}
          placeholder="Name"
        />
        <input
          type="email"
          value={newSupplier.email || ""}
          onChange={(e) => handleInputChange(e, "email")}
          placeholder="Email"
        />
        <textarea
          value={newSupplier.address || ""}
          onChange={(e) => handleInputChange(e, "address")}
          placeholder="Address"
        />
        <button onClick={handleCreate}>Create Supplier</button>
      </div>

      {/* Supplier List */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact Person</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.supplier_id}>
              {editMode && selectedSupplier?.supplier_id === supplier.supplier_id ? (
                <>
                  <td>
                    <input
                      value={selectedSupplier.name}
                      onChange={(e) => handleInputChange(e, "name")}
                    />
                  </td>
                  <td>
                    <input
                      value={selectedSupplier.email}
                      onChange={(e) => handleInputChange(e, "email")}
                    />
                  </td>
                  <td>
                    <input
                      value={selectedSupplier.contact_person}
                      onChange={(e) => handleInputChange(e, "contact_person")}
                    />
                  </td>
                  <td>
                    <input
                      value={selectedSupplier.phone_number}
                      onChange={(e) => handleInputChange(e, "phone_number")}
                    />
                  </td>
                  <td>
                    <textarea
                      value={selectedSupplier.address}
                      onChange={(e) => handleInputChange(e, "address")}
                    />
                  </td>
                  <td>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditMode(false)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{supplier.name}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.contact_person}</td>
                  <td>{supplier.phone_number}</td>
                  <td>{supplier.address}</td>
                  <td>
                    <button onClick={() => { setEditMode(true); setSelectedSupplier(supplier); }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(supplier.supplier_id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
};

export default SupplierList;
