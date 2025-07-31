"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PaymentMethodList.css';

// Define the PaymentMethod interface
interface PaymentMethod {
    payment_method_id: number;
    payment_method_name: string;
}

// Define the state interface for the component
interface PaymentMethodListState {
    paymentMethods: PaymentMethod[];
    loading: boolean;
    error: string | null;
    newPaymentMethod: string;
    editingPaymentMethodId: number | null; // Added state for the payment method being edited
    editingPaymentMethodName: string; // Added state for the new name during editing
    notification: string | null; // Added state for notifications
}

const PaymentMethodList: React.FC = () => {
    const [state, setState] = useState<PaymentMethodListState>({
        paymentMethods: [],
        loading: true,
        error: null,
        newPaymentMethod: '',
        editingPaymentMethodId: null,
        editingPaymentMethodName: '',
        notification: null, // Initialize notification state
    });

    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    // Create axios instance
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
                    setState((prev) => ({ ...prev, error: "Session expired, please log in again.", loading: false }));
                }
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const fetchPaymentMethods = async () => {
        try {
            const response = await axiosInstance.get('payment-methods/');
            setState((prev) => ({
                ...prev,
                paymentMethods: response.data,
                loading: false,
                notification: 'Payment methods loaded successfully.', // Success notification
            }));
            clearNotificationAfterDelay();
        } catch (error: unknown) {
            let errorMessage = 'An unexpected error occurred.';
            if (axios.isAxiosError(error)) {
                errorMessage = error.message;
            }
            setState((prev) => ({
                ...prev,
                error: errorMessage,
                loading: false,
                notification: null, // Clear notification on error
            }));
        }
    };

    const handleAddPaymentMethod = async () => {
        try {
            const response = await axiosInstance.post('payment-methods/', { payment_method_name: state.newPaymentMethod });
            setState((prev) => ({
                ...prev,
                paymentMethods: [...prev.paymentMethods, response.data],
                newPaymentMethod: '',
                notification: 'Payment method added successfully.', // Success notification
            }));
            clearNotificationAfterDelay();
        } catch (error: unknown) {
            let errorMessage = 'An unexpected error occurred.';
            if (axios.isAxiosError(error)) {
                errorMessage = error.message;
            }
            setState((prev) => ({
                ...prev,
                error: errorMessage,
                notification: null, // Clear notification on error
            }));
        }
    };

    const handleEditPaymentMethod = (id: number, name: string) => {
        setState((prev) => ({
            ...prev,
            editingPaymentMethodId: id,
            editingPaymentMethodName: name,
            notification: null, // Clear notification when editing
        }));
    };

    const handleUpdatePaymentMethod = async () => {
        if (state.editingPaymentMethodId !== null) {
            try {
                const response = await axiosInstance.put(`payment-methods/${state.editingPaymentMethodId}/`, {
                    payment_method_name: state.editingPaymentMethodName,
                });
                setState((prev) => ({
                    ...prev,
                    paymentMethods: prev.paymentMethods.map(method =>
                        method.payment_method_id === state.editingPaymentMethodId ? response.data : method
                    ),
                    editingPaymentMethodId: null,
                    editingPaymentMethodName: '',
                    notification: 'Payment method updated successfully.', // Success notification
                }));
                clearNotificationAfterDelay();
            } catch (error: unknown) {
                let errorMessage = 'An unexpected error occurred.';
                if (axios.isAxiosError(error)) {
                    errorMessage = error.message;
                }
                setState((prev) => ({
                    ...prev,
                    error: errorMessage,
                    notification: null, // Clear notification on error
                }));
            }
        }
    };

    const handleDeletePaymentMethod = async (id: number) => {
        try {
            await axiosInstance.delete(`payment-methods/${id}/`);
            setState((prev) => ({
                ...prev,
                paymentMethods: prev.paymentMethods.filter(method => method.payment_method_id !== id),
                notification: 'Payment method deleted successfully.', // Success notification
            }));
            clearNotificationAfterDelay();
        } catch (error: unknown) {
            let errorMessage = 'An unexpected error occurred.';
            if (axios.isAxiosError(error)) {
                errorMessage = error.message;
            }
            setState((prev) => ({
                ...prev,
                error: errorMessage,
                notification: null, // Clear notification on error
            }));
        }
    };

    // Function to clear notifications after a delay
    const clearNotificationAfterDelay = () => {
        setTimeout(() => {
            setState((prev) => ({ ...prev, notification: null }));
        }, 5000); // Clear after 5 seconds
    };

    return (
        <div className="payment-method-list">
            <h2>Payment Methods</h2>
            {state.loading && <p>Loading...</p>}
            {state.error && <p className="error">{state.error}</p>}
            {state.notification && <p className="notification">{state.notification}</p>} {/* Notification display */}
            <div>
                <input 
                    type="text" 
                    value={state.newPaymentMethod} 
                    onChange={(e) => setState((prev) => ({ ...prev, newPaymentMethod: e.target.value }))} 
                    placeholder="New Payment Method" 
                />
                <button onClick={handleAddPaymentMethod}>Add</button>
            </div>

            {state.editingPaymentMethodId !== null && (
                <div>
                    <input 
                        type="text" 
                        value={state.editingPaymentMethodName} 
                        onChange={(e) => setState((prev) => ({ ...prev, editingPaymentMethodName: e.target.value }))} 
                        placeholder="Edit Payment Method" 
                    />
                    <button onClick={handleUpdatePaymentMethod}>Update</button>
                </div>
            )}
            
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {state.paymentMethods.map(method => (
                        <tr key={method.payment_method_id}>
                            <td>{method.payment_method_id}</td>
                            <td>{method.payment_method_name}</td>
                            <td>
                                <button onClick={() => handleEditPaymentMethod(method.payment_method_id, method.payment_method_name)}>Edit</button>
                                <button onClick={() => handleDeletePaymentMethod(method.payment_method_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentMethodList;
