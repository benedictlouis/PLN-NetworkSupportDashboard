import React, { useEffect, useState } from "react";

const AccountManagement = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [formData, setFormData] = useState({ username: "", password: "", confirmPassword: "", role: "Admin" });
    const [passwordError, setPasswordError] = useState("");

    const userRole = sessionStorage.getItem("userRole");

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
                setAccounts(data.accounts);
            } catch (err) {
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
            setPasswordError("Password dan konfirmasi password tidak cocok.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5433/user/update-accounts", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedAccount.id,
                    username: formData.username,
                    password: formData.password || selectedAccount.password,
                    role: formData.role
                }),
            });

            if (!response.ok) throw new Error("Gagal memperbarui akun");

            const updatedResponse = await fetch("http://localhost:5433/user/all-accounts");
            const updatedData = await updatedResponse.json();
            setAccounts(updatedData.accounts);
            setIsEditing(false);
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus akun ini?")) return;

        try {
            const response = await fetch(`http://localhost:5433/user/delete-accounts/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Gagal menghapus akun");

            const updatedResponse = await fetch("http://localhost:5433/user/all-accounts");
            const updatedData = await updatedResponse.json();
            setAccounts(updatedData.accounts);
        } catch (err) {
            alert("Error: " + err.message);
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
        </div>
    );
};

export default AccountManagement;
