import React, { useEffect, useState } from "react";
import ToastContainer from './toastcontainer';

const AccountManagement = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [formData, setFormData] = useState({ username: "", password: "", confirmPassword: "", role: "Admin" });
    const [passwordError, setPasswordError] = useState("");
    const [toasts, setToasts] = useState([]);

    const userRole = sessionStorage.getItem("userRole");

    const addToast = (type, message) => {
        const id = new Date().getTime();
        setToasts([...toasts, { id, type, message }]);
        setTimeout(() => removeToast(id), 3000);
    };

    const removeToast = (id) => {
        setToasts(toasts.filter((toast) => toast.id !== id));
    };

    useEffect(() => {
        if (userRole !== "Admin" && userRole !== "Super Admin") {
            setError("Anda tidak memiliki izin untuk melihat akun.");
            setLoading(false);
            return;
        }

        const fetchAccounts = async () => {
            try {
                const response = await fetch("http://localhost:5433/user/all-accounts", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });

                let errorMessage = "Gagal mengambil daftar akun.";

                if (!response.ok) {
                    try {
                        const errorData = await response.json(); // Coba parsing error dari backend
                        if (errorData.message) {
                            errorMessage = errorData.message; // Ambil pesan error dari backend jika ada
                        }
                    } catch (error) {
                        console.error("Failed to parse JSON error response:", error);
                    }
                    throw new Error(errorMessage);
                }

                const data = await response.json();

                if (data && data.accounts) {
                    setAccounts(data.accounts);
                } else {
                    throw new Error("Data akun tidak tersedia");
                }
            } catch (err) {
                console.error("Error fetching accounts:", err.message);
                setError(err.message); // Menampilkan error dari backend di UI
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, [userRole]);

    const openEditModal = (account) => {
        setSelectedAccount(account);
        setFormData({
            username: account.username,
            password: "",
            confirmPassword: "",
            role: account.role
        });
        setIsEditing(true);
        setPasswordError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        if (formData.password && formData.password !== formData.confirmPassword) {
            addToast('error', 'Password does not match');
            return;
        }

        try {
            const payload = {
                targetUsername: selectedAccount.username,
                newUsername: formData.username,
                newRole: formData.role
            };

            if (formData.password) {
                payload.newPassword = formData.password;
            }

            const response = await fetch("http://localhost:5433/user/update-account", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            let responseData = {};
            try {
                responseData = await response.json(); // Ambil JSON dari response
            } catch (error) {
                console.error("Failed to parse JSON response:", error);
            }

            if (response.ok) {
                addToast('success', responseData.message || 'Account updated successfully');
                setTimeout(() => window.location.href = "/accountManagement", 1000);
            } else {
                addToast('error', responseData.message || `Failed updating account (Status: ${response.status})`);
            }
        } catch (err) {
            addToast('error', 'An error occurred while updating account');
            console.error("Error updating account:", err);
        }
    };

    const handleDelete = async (account) => {
        if (!window.confirm(`Delete account ${account.username}?`)) return;

        try {
            const response = await fetch(`http://localhost:5433/user/delete-account`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username: account.username }), // Kirim username langsung
            });

            let responseData = {};
            try {
                responseData = await response.json();
            } catch (error) {
                console.error("Failed to parse JSON response:", error);
            }

            if (response.ok) {

                if (account.username === sessionStorage.getItem("usename")) {
                    setTimeout(() => window.location.href = "/accountManagement", 1000);
                }

                addToast('success', responseData.message || 'Account deleted successfully');

                // Refresh daftar akun setelah delete
                setAccounts(accounts.filter(acc => acc.id !== account.id));
            } else {
                addToast('error', responseData.message || `Failed deleting account (Status: ${response.status})`);
            }
        } catch (err) {
            console.error("Error deleting account:", err);
            addToast('error', 'An error occurred while deleting account');
        }
    };

    if (loading) return <p className="text-center">Loading accounts...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="">
            <div className="bg-transparent p-4 ">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-pln">
                            <th className="border py-3 px-4">ID</th>
                            <th className="border py-3 px-8">Username</th>
                            <th className="border py-3 px-8">Role</th>
                            <th className="border py-3 px-8"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account) => (
                            <tr key={account.id} className="text-center text-gray-700">
                                <td className="border py-3 px-4">{account.id}</td>
                                <td className="border py-3 px-8">{account.username}</td>
                                <td className="border py-3 px-8">{account.role}</td>
                                <td className="border py-3 space-x-4">
                                    <button
                                        className="bg-transparent text-blue-700 rounded hover:text-blue-500 hover:outline-none px-4 py-1"
                                        onClick={() => openEditModal(account)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-transparent text-red-700 rounded hover:text-red-500 hover:outline-none px-4 py-1"
                                        onClick={() => handleDelete(account)}
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Edit */}
            {isEditing && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg text-black font-bold mb-4">Edit Akun</h2>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md bg-white text-gray-700 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />

                        <label className="mt-4 block text-sm font-medium text-gray-700">Password baru (opsional)</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md bg-white text-gray-700 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />

                        <label className="mt-4 block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md bg-white text-gray-700 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

                        <label className="mt-4 block text-sm font-medium text-gray-700">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md bg-white text-gray-700 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Support">Support</option>
                        </select>

                        <div className="flex justify-end pt-8">
                            <button
                                className="mr-2 px-4 py-2 bg-white text-red-700 rounded outline-none"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-[#1C94AC] text-white rounded hover:bg-opacity-90"
                                onClick={handleUpdate}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

export default AccountManagement;
