import React, { useState, useEffect } from 'react';

const AccountManagement = () => {
    const [tempatSampah, setTempatSampah] = useState([]);
    const [formData, setFormData] = useState({
        nama: '',
        fakultas: '',
        tempatSampahId: '',
        latitude: '',
        longitude: ''
    });
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState([]);

    // Fungsi untuk menambahkan toast
    const addToast = (type, message) => {
        const id = new Date().getTime();
        setToasts((prevToasts) => [...prevToasts, { id, type, message }]);
        setTimeout(() => removeToast(id), 3000);
    };

    // Fungsi untuk menghapus toast
    const removeToast = (id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    // Fungsi untuk mengambil data tempat sampah
    const fetchTempatSampah = async () => {
        try {
            const response = await fetch('http://localhost:3001/TempatSampah');
            if (!response.ok) {
                throw new Error('Failed to fetch tempat sampah');
            }
            const data = await response.json();
            setTempatSampah(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tempat sampah:', error);
            addToast('error', 'Failed to load tempat sampah data');
        }
    };

    useEffect(() => {
        fetchTempatSampah(); // Ambil data saat pertama kali render
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = editing
            ? `http://localhost:3001/EditTempatSampah/${formData.tempatSampahId}` // Edit request
            : 'http://localhost:3001/AddTempatSampah'; // Add request

        const method = editing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nama: formData.nama,
                    fakultas: formData.fakultas,
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save tempat sampah');
            }

            setFormData({ nama: '', fakultas: '', tempatSampahId: '', latitude: '', longitude: '' });
            setEditing(false);
            await fetchTempatSampah(); // Refresh daftar tempat sampah setelah operasi selesai

            addToast('success', editing ? 'Tempat Sampah berhasil diperbarui' : 'Tempat Sampah berhasil ditambahkan');
        } catch (error) {
            console.error('Error saving tempat sampah:', error);
            addToast('error', 'Gagal menyimpan tempat sampah');
        }
    };

    const handleEdit = (tempatSampah) => {
        setFormData({
            nama: tempatSampah.nama,
            fakultas: tempatSampah.fakultas,
            tempatSampahId: tempatSampah.id,
            latitude: tempatSampah.latitude,
            longitude: tempatSampah.longitude,
        });
        setEditing(true);
    };

    const handleDelete = async (tempatSampahId) => {
        try {
            const response = await fetch(`http://localhost:3001/DeleteTempatSampah/${tempatSampahId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete tempat sampah');
            }

            await fetchTempatSampah(); // Refresh daftar tempat sampah setelah delete

            addToast('success', 'Tempat Sampah berhasil dihapus');
        } catch (error) {
            console.error('Error deleting tempat sampah:', error);
            addToast('error', 'Gagal menghapus tempat sampah');
        }
    };

    if (loading) {
        return <p>Loading data...</p>;
    }

    return (
        <div>
            {/* Formulir untuk menambah atau mengedit tempat sampah */}
            <form onSubmit={handleSubmit} className="mb-6">
                <h2 className="text-xl font-semibold">{editing ? 'Edit Tempat Sampah' : 'Tambah Tempat Sampah'}</h2>
                <div className="mb-4 ">
                    <label htmlFor="nama" className="block text-white">Nama Tempat Sampah</label>
                    <input
                        type="text"
                        id="nama"
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4 ">
                    <label htmlFor="fakultas" className="block text-white">Fakultas</label>
                    <input
                        type="text"
                        id="fakultas"
                        name="fakultas"
                        value={formData.fakultas}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4 ">
                    <label htmlFor="latitude" className="block text-white">Latitude</label>
                    <input
                        type="text"
                        id="latitude"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4 ">
                    <label htmlFor="longitude" className="block text-white">Longitude</label>
                    <input
                        type="text"
                        id="longitude"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                    {editing ? 'Simpan Perubahan' : 'Tambah Tempat Sampah'}
                </button>
            </form>

            {/* Daftar tempat sampah */}
            <h2 className="text-xl font-semibold mb-4">Daftar Tempat Sampah</h2>
            <table className="min-w-full table-auto">
                <thead>
                    <tr>
                        <th className="border px-4 py-2 text-white">Nama Tempat Sampah</th>
                        <th className="border px-4 py-2 text-white">Fakultas</th>
                        <th className="border px-4 py-2 text-white">Latitude</th>
                        <th className="border px-4 py-2 text-white">Longitude</th>
                        <th className="border px-4 py-2 text-white">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tempatSampah.map((tempatSampah) => (
                        <tr key={tempatSampah.tempatSampahId}>
                            <td className="border px-4 py-2 text-white">{tempatSampah.nama}</td>
                            <td className="border px-4 py-2 text-white">{tempatSampah.fakultas}</td>
                            <td className="border px-4 py-2 text-white">{tempatSampah.latitude}</td>
                            <td className="border px-4 py-2 text-white">{tempatSampah.longitude}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleEdit(tempatSampah)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(tempatSampah.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Toast Notifications */}
            <div className="fixed bottom-5 right-5 space-y-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`p-3 rounded-md text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AccountManagement;