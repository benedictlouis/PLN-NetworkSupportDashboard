import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ToastContainer from './ToastContainer';
import Done from "./done"; // Import form

const Detail = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [duration, setDuration] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [toasts, setToasts] = useState([]);
    const [showDone, setShowDone] = useState(false); // State untuk form

    const addToast = (type, message) => {
        const id = new Date().getTime();
        setToasts([...toasts, { id, type, message }]);
        setTimeout(() => removeToast(id), 3000);
    };

    const removeToast = (id) => {
        setToasts(toasts.filter((toast) => toast.id !== id));
    };

    const formatDuration = (durationMinutes) => {
        const totalMinutes = parseFloat(durationMinutes);
        const days = Math.floor(totalMinutes / (60 * 24));
        const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
        const minutes = Math.floor(totalMinutes % 60);

        let formatted = "";
        if (days > 0) formatted += `${days} hari `;
        if (hours > 0) formatted += `${hours} jam `;
        if (minutes > 0) formatted += `${minutes} menit`;

        return formatted.trim();
    };

    useEffect(() => {
        const loginStatus = sessionStorage.getItem("isLoggedIn");
        setIsLoggedIn(loginStatus === "true");

        const fetchData = () => {
            axios
                .get(`http://localhost:5433/data/${id}`)
                .then((response) => {
                    setData(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching job details:", error);
                    setLoading(false);
                });

            axios
                .get(`http://localhost:5433/data/durations`)
                .then((response) => {
                    const durations = response.data;
                    const matchingDuration = durations.find((item) => item.id === parseInt(id));
                    if (matchingDuration) {
                        const formattedDuration = formatDuration(matchingDuration.duration_minutes);
                        setDuration(formattedDuration);
                        console.log("Duration:", formattedDuration);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching durations:", error);
                });
        };

        // Initial fetch
        fetchData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>No data available</div>;
        setTimeout(() => window.location.href = `/list`, 100);
    }

    const picArray = Array.isArray(data.pic) ? data.pic : [data.pic];

    const handleEdit = () => {
        navigate(`/edit/${id}`);
    };

    const handleDelete = () => {
        const confirmDelete = window.confirm("Hapus pekerjaan?");
        if (confirmDelete) {
            axios
                .delete(`http://localhost:5433/data/delete/${id}`)
                .then((response) => {
                    addToast('success', 'Pekerjaan dihapus');
                    setTimeout(() => window.location.href = `/list`, 2000);
                })
                .catch((error) => {
                    console.error("Error deleting job:", error);
                    addToast('error', 'Gagal menghapus pekerjaan');
                });
        }
    };

    const handleMarkAsCompleted = () => setShowDone(true);
    const handleCloseDone = () => setShowDone(false);
    const handleSuccessMarkAsSelesai = (updatedData) => {
        setData(updatedData);
        setShowDone(false);
        addToast("success", "Pekerjaan berhasil diselesaikan!");
    };

    // Format tanggal menjadi "12 Desember 2024"
    const formatDate = (date) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString("id-ID", options);
    };

    // Format jam menjadi "HH:mm WIB"
    const formatTime = (time) => {
        const options = { hour: "2-digit", minute: "2-digit", hour12: false };
        const formattedTime = new Date(`1970-01-01T${time}`).toLocaleTimeString("id-ID", options);
        return `${formattedTime} WIB`;
    };

    if(data.pic === null) {
        data.pic = "Tidak ada PIC";
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col items-center justify-center w-full">
                <h1 className="font-bold text-[60px] text-gradient pt-4 pb-2">{data.kategori_pekerjaan}</h1>
                <h2
                    className={`text-[20px] pb-8 ${data.status_kerja === 'Resolved'
                        ? 'text-green-500'
                        : data.status_kerja === 'In Progress'
                            ? 'text-yellow-500'
                            : data.status_kerja === 'Pending'
                                ? 'text-red-500'
                                : 'text-gray-500'
                        }`}
                >
                    {data.status_kerja}
                </h2>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 pb-4">
                        <p className="text-sm text-gray-500">Minggu</p>
                        <p className="text-gray-700">{data.minggu}</p>
                    </div>
                    <div className="col-span-1 pb-4">
                        <p className="text-sm text-gray-500">Bulan</p>
                        <p className="text-gray-700">{data.bulan}</p>
                    </div>
                    <div className="col-span-1 pb-4">
                        <p className="text-sm text-gray-500">Tahun</p>
                        <p className="text-gray-700">{data.tahun}</p>
                    </div>
                    <div className="col-span-1 pb-4">
                        <p className="text-sm text-gray-500">Tanggal Awal</p>
                        <p className="text-gray-700">{formatDate(data.tanggal_awal)}</p>
                    </div>
                    <div className="col-span-1 pb-4">
                        <p className="text-sm text-gray-500">Jam Awal</p>
                        <p className="text-gray-700">{formatTime(data.jam_awal)}</p>
                    </div>
                    <div className="col-span-1 pb-4">
                        <p className="text-sm text-gray-500">Status Kerja</p>
                        <p className="text-gray-700">{data.status_kerja}</p>
                    </div>
                    <div className="col-span-1 pb-4">
                        <p className="text-sm text-gray-500">Nama - Telepon Pelapor</p>
                        <p className="text-gray-700">{data.nama_pelapor_telepon}</p>
                    </div>
                    <div className="col-span-1 pb-4">
                        <p className="text-sm text-gray-500">Divisi</p>
                        <p className="text-gray-700">{data.divisi || "-"}</p>
                    </div>
                    <div className="col-span-1 pb-4">
                        <p className="text-sm text-gray-500">Lokasi</p>
                        <p className="text-gray-700">{data.lokasi}</p>
                    </div>
                    <div className="col-span-1 pb-4">
                        <p className="text-sm text-gray-500">Kategori Pekerjaan</p>
                        <p className="text-gray-700">{data.kategori_pekerjaan}</p>
                    </div>
                    <div className="col-span-2 pb-4">
                        <p className="text-sm text-gray-500">Detail Pekerjaan</p>
                        <p className="text-gray-700">{data.detail_pekerjaan}</p>
                    </div>
                    <div className="col-span-1 pb-4">
                        <p className="text-sm text-gray-500">Tanggal Selesai</p>
                        <p className="text-gray-700">{data.tanggal_selesai ? formatDate(data.tanggal_selesai) : "-"}</p>
                    </div>
                    <div className="col-span-1 pb-4">
                        <p className="text-sm text-gray-500">Jam Selesai</p>
                        <p className="text-gray-700">{data.jam_selesai ? formatTime(data.jam_selesai) : "-"}</p>
                    </div>
                    <div className="col-span-1 pb-4">
                        <p className="text-sm text-gray-500">Solusi</p>
                        <p className="text-gray-700">{data.solusi_keterangan || "-"}</p>
                    </div>
                    <div className="col-span-1 pb-4">
                        <p className="text-sm text-gray-500">Lama Pekerjaan</p>
                        <p className="text-gray-700">{duration || "-"}</p>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="text-gray-700">
                        <p className="text-sm text-gray-500">PIC</p>
                        <p className="text-gray-700">{data.pic.replace(/{|}/g, "").replace(/,/g, ", ")}</p>
                    </div>
                </div>

                {isLoggedIn && (
                    <div className="mt-8 ease-in transition-all duration-300">
                        <button
                            onClick={handleEdit}
                            className="mr-4 px-4 py-2 bg-black text-white rounded hover:bg-blue-700 hover:outline-none"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-black text-white rounded hover:bg-red-700"
                        >
                            Delete
                        </button>
                        {!data.solusi_keterangan || !data.tanggal_selesai ? (
                            <button
                                onClick={handleMarkAsCompleted}
                                className="mx-4 mt-4 px-4 py-2 bg-black text-white rounded hover:bg-green-700"
                            >
                                Selesai
                            </button>
                        ) : null}
                        {showDone && (
                            <Done
                                existingData={data}
                                id={id}
                                onClose={handleCloseDone}
                                onSuccess={handleSuccessMarkAsSelesai}
                            />
                        )}

                    </div>
                )}
            </div>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

export default Detail;
