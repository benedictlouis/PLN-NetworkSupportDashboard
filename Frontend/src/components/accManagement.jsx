import React, { useEffect, useState } from "react";

const AccountManagement = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [formData, setFormData] = useState({ username: "", password: "", role: "Admin" });

    const userRole = sessionStorage.getItem("userRole");
    const token = sessionStorage.getItem("SESSION_SECRET");

    // 🛑 Hanya Admin yang boleh melihat akun
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
    }, [userRole, token]);

    // Fungsi membuka modal edit
    const openEditModal = (account) => {
        setSelectedAccount(account);
        setFormData({
            username: account.username,
            password: "",
            role: account.role
        });
        setIsEditing(true);
    };

    // Fungsi menangani input form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Fungsi update akun
    const handleUpdate = async () => {
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

            // Ambil ulang data dari server setelah update
            const updatedResponse = await fetch("http://localhost:5433/user/all-accounts");
            const updatedData = await updatedResponse.json();
            setAccounts(updatedData.accounts);
            setIsEditing(false);
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    // Fungsi delete akun
    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus akun ini?")) return;

        try {
            const response = await fetch(`http://localhost:5433/user/delete-accounts/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Gagal menghapus akun");

            // Ambil ulang data setelah akun dihapus
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
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Manajemen Akun</h1>
            <div className="bg-white p-4 shadow-md rounded-lg">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Username</th>
                            <th className="border p-2">Role</th>
                            <th className="border p-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account) => (
                            <tr key={account.id} className="text-center">
                                <td className="border p-2">{account.id}</td>
                                <td className="border p-2">{account.username}</td>
                                <td className="border p-2">{account.role}</td>
                                <td className="border p-2 space-x-2">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                        onClick={() => openEditModal(account)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
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
                        <h2 className="text-xl font-bold mb-4">Edit Akun</h2>
                        <label className="block text-sm font-semibold">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-3"
                        />

                        <label className="block text-sm font-semibold">Password (opsional)</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Isi jika ingin mengubah password"
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-3"
                        />

                        <label className="block text-sm font-semibold">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-4"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Support">Support</option>
                        </select>

                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
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
