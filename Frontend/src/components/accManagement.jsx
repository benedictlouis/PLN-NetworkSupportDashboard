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
        if (userRole !== "Admin") {
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
        
                if (!response.ok) throw new Error("Gagal mengambil daftar akun.");
        
                const data = await response.json();
                console.log("Fetched accounts:", data); // Debugging
        
                if (data && data.accounts) {
                    setAccounts(data.accounts);
                } else {
                    throw new Error("Data akun tidak tersedia");
                }
            } catch (err) {
                console.error("Error fetching accounts:", err.message);
                setError(err.message);
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
                targetUsername: selectedAccount.username, // Username lama sebagai target
                newUsername: formData.username, // Username baru
                newRole: formData.role // Role baru
            };
    
            // Hanya tambahkan password jika diisi
            if (formData.password) {
                payload.newPassword = formData.password;
            }
    
            const response = await fetch("http://localhost:5433/user/update-accounts", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            console.log(payload);
    
            if (!response.ok) {
                throw new Error("Failed updating account");
            }
    
            // Ambil data terbaru setelah update
            const updatedResponse = await fetch("http://localhost:5433/user/all-accounts");
            const updatedData = await updatedResponse.json();
            console.log("Updated accounts:", updatedData);
    
            if (updatedData && updatedData.accounts) {
                setAccounts(updatedData.accounts);
                setIsEditing(false);
                addToast('success', 'Account updated successfully');
            } else {
                addToast('error', 'Failed updating account');
            }
        } catch (err) {
            console.error("Error updating account:", err.message);
            addToast('error', 'An error occurred while updating account');
        }
    };      

    const handleDelete = async (id) => {
        if (!window.confirm("Delete account?")) return;

        try {
            const response = await fetch(`http://localhost:5433/user/delete-accounts/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new addToast('error', 'Failed deleting account');

            const updatedResponse = await fetch("http://localhost:5433/user/all-accounts");
            const updatedData = await updatedResponse.json();
            setAccounts(updatedData.accounts);
            addToast('success', 'Account deleted successfully');
        } catch (err) {
            alert("Error: " + err.message);
            addToast('error', 'An error occurred while deleting account');
        }
    };

    if (loading) return <p className="text-center">Loading accounts...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="">
            <div className="bg-white p-4 shadow-md rounded-lg">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-pln">
                            <th className="border p-3">ID</th>
                            <th className="border p-3">Username</th>
                            <th className="border p-3">Role</th>
                            <th className="border p-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account) => (
                            <tr key={account.id} className="text-center text-gray-700">
                                <td className="border p-3">{account.id}</td>
                                <td className="border p-3">{account.username}</td>
                                <td className="border p-3">{account.role}</td>
                                <td className="border p-3 space-x-4">
                                    <button
                                        className="bg-black text-white rounded hover:bg-blue-700 hover:outline-none px-4 py-1"
                                        onClick={() => openEditModal(account)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-black text-white rounded hover:bg-red-700 hover:outline-none px-4 py-1"
                                        onClick={() => handleDelete(account.id)}
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
