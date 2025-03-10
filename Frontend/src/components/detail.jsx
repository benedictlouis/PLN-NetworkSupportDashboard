import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ToastContainer from './toastcontainer';
import Done from "./done"; // Import form

import History from "./history";

const Detail = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [duration, setDuration] = useState("");
    const navigate = useNavigate();
    const [toasts, setToasts] = useState([]);
    const [showDone, setShowDone] = useState(false); // State untuk form
    const [existingData, setExistingData] = useState({});
    
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);

    // console.log(sessionStorage.getItem("userId"));
    // console.log(sessionStorage.getItem("username"));
    // console.log(sessionStorage.getItem("userRole"));

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

    const slaMapping = {
        1: "SLA 1 (30 menit)",
        2: "SLA 2 (60 menit)",
        3: "SLA 3 (90 menit)",
        4: "SLA 4 (120 menit)",
        5: "SLA 5 (240 menit)",
        6: "SLA 6 (480 menit / 1 hari kerja)",
        7: "SLA 7 (1440 menit / 2 hari kerja)",
        8: "SLA 8 (2880 menit / 4 hari kerja)",
    };

    

    useEffect(() => {
        if (data) {
            setExistingData(data);
        }
    }, [data]);

    useEffect(() => {
        fetchUserData();
        fetchData();
    }, []);


        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:5433/user/me", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
    
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
    
                const userData = await response.json();
               /* console.log("User Role:", userData.userRole); */
                setUserId(userData.userId);
                setUserRole(userData.userRole);
            } catch (error) {
                console.error("Error fetching user status:", error);
            }
        };
    
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5433/data/${id}`);
                const fetchedData = response.data;
                setData(fetchedData);
                setLoading(false);

                const durationsResponse = await axios.get(`http://localhost:5433/data/durations`);
                const durations = durationsResponse.data;
                const matchingDuration = durations.find((item) => item.id === parseInt(id));
                if (matchingDuration) {
                    const formattedDuration = formatDuration(matchingDuration.duration_minutes);
                    setDuration(formattedDuration);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };


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
                .delete(`http://localhost:5433/data/delete/${id}`, {
                    withCredentials: true 
                })
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

    const handleTolak = () => {
        const confirmDelete = window.confirm("Tolak pekerjaan?");
        if (confirmDelete) {
            axios
                .delete(`http://localhost:5433/data/delete/${id}`, {
                    withCredentials: true 
                })
                .then((response) => {
                    addToast('success', 'Pekerjaan ditolak');
                    setTimeout(() => window.location.href = `/list`, 2000);
                })
                .catch((error) => {
                    console.error("Error deleting job:", error);
                    addToast('error', 'Gagal menolak pekerjaan');
                });
        }
    };

    const handleMarkAsCompleted = () => setShowDone(true);
    const handleCloseDone = () => setShowDone(false);
    const handleSuccessMarkAsSelesai = (updatedData) => {
        setData(updatedData);
        setShowDone(false);
        addToast("success", "Pekerjaan berhasil diselesaikan!");
        fetchData();
    };

    const handleMarkAsInProgress = async () => {
        try {
            const response = await fetch(`http://localhost:5433/data/edit/${id}`, {
                method: "PUT",
                credentials: "include", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status_kerja: "In Progress",
                    solusi_keterangan: null,
                    tanggal_selesai: null,
                    jam_selesai: null,
                    edited_by: userId,
                }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to update status to In Progress");
            }
    
            await response.json();
            addToast("success", "Status pekerjaan berhasil diubah");
    
            // Panggil fetchData untuk mendapatkan data terbaru
            fetchData();
        } catch (error) {
            console.error(error);
            addToast("error", "Gagal mengubah status pekerjaan");
        }
    };
    
    const handleMarkAsPending = async () => {
        try {
            const response = await fetch(`http://localhost:5433/data/edit/${id}`, {
                method: "PUT",
                credentials: "include", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status_kerja: "Pending",
                    solusi_keterangan: null,
                    tanggal_selesai: null,
                    jam_selesai: null,
                    edited_by: userId,
                }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to update status to Pending");
            }
    
            await response.json();
            addToast("success", "Status pekerjaan berhasil diubah");
    
            // Panggil fetchData untuk mendapatkan data terbaru
            fetchData();
        } catch (error) {
            console.error(error);
            addToast("error", "Gagal mengubah status pekerjaan");
        }
    };
    
    

    const handleValidate = async () => {
        const confirmValidate = window.confirm("Terima pekerjaan?");
        if (!confirmValidate) return;
    
        console.log("Mengirim request dengan is_validate: true");
    
        try {
            const response = await fetch(`http://localhost:5433/data/edit/${id}`, {
                method: "PUT",
                credentials: "include", 
                headers: {
                    
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    edited_by: userId,
                    is_validate: true,
                }),
            });
    
            const data = await response.json();
            console.log("Response:", data);
    
            if (!response.ok) {
                throw new Error(data.message || "Failed to update status");
            }
    
            addToast("success", "Pekerjaan diterima");

            setTimeout(() => {
                navigate("/validation");
            }, 1000);
        } catch (error) {
            console.error("Error:", error);
            addToast("error", "Gagal menerima pekerjaan");
        }
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

    if (data.pic === null) {
        data.pic = "Tidak ada PIC";
    }

    function toggleSlideover() {
        document.getElementById('slideover-container').classList.toggle('invisible');
        document.getElementById('slideover-bg').classList.toggle('opacity-0');
        document.getElementById('slideover-bg').classList.toggle('opacity-50');
        document.getElementById('slideover').classList.toggle('translate-x-full');
    }


    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col items-center justify-center w-full z-10">
                <h1 className="font-bold text-[60px] text-gradient pt-4 pb-2">{data.kategori_pekerjaan}</h1>
                <h2
                    className={`text-[20px] pb-2 ${data.status_kerja === 'Resolved'
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

            {/* Button toggle slide-over */}
            <div className="absolute top-44 right-8 max-md:right-2 z-50">
                <div
                    onClick={toggleSlideover} // Pass the function reference here
                    className="flex items-center gap-2 cursor-pointer px-5 py-2 max-md:text-sm text-md hover:text-[#1C94AC] rounded text-gray-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span className="max-md:invisible">History</span>
                </div>
                <div id="slideover-container" className="w-full h-full fixed inset-0 invisible">
                    <div
                        onClick={toggleSlideover}
                        id="slideover-bg"
                        className="w-full h-full duration-500 ease-out transition-all inset-0 absolute bg-gray-900 opacity-0"
                    ></div>
                    <div
                        id="slideover"
                        className="w-96 bg-white h-full absolute right-0 duration-300 ease-out transition-all translate-x-full"
                    >
                        <div
                            className="absolute cursor-pointer text-gray-600 hover:text-[#1C94AC] top-0 w-8 h-8 flex items-center justify-center right-0 mt-5 mr-5"
                            onClick={toggleSlideover}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </div>
                        {/* <div className="p-6">
                            <h1 className="font-bold text-[20px] text-gradient">History</h1>
                            <div className="mt-4">
                                <p className="text-sm text-gray-500">Tanggal</p>
                                <p className="text-gray-700">12 Desember 2024</p>
                            </div>
                        </div> */}
                        <History />
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 z-20">
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
                        <p className="text-gray-700">
                            {data.nama_pelapor_telepon
                                ? (() => {
                                    const lastDashIndex = data.nama_pelapor_telepon.lastIndexOf(" - ");
                                    if (lastDashIndex === -1) return data.nama_pelapor_telepon.trim(); // Jika tidak ada " - ", tampilkan apa adanya

                                    const nama = data.nama_pelapor_telepon.slice(0, lastDashIndex).trim();
                                    const telepon = data.nama_pelapor_telepon.slice(lastDashIndex + 3).trim(); // +3 karena " - " memiliki 3 karakter

                                    return [nama, telepon].filter(Boolean).join(" - ") || "-";
                                })()
                                : "-"}
                        </p>
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
                        <p className="text-sm text-gray-500">SLA</p>
                        <p className="text-gray-700">{slaMapping[data.sla_id] || "-"}</p>
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
                        <p className="text-gray-700">{data?.pic ? data.pic.replace(/{|}/g, "").replace(/,/g, ", ") : "Tidak ada PIC"}</p>
                    </div>
                </div>
                
                {userRole === "Super Admin" && (
                    <div className="mt-8 ease-in transition-all duration-300 flex justify-between items-center">
                        {/* Tombol di kiri */}
                        {data.is_validate === true && (
                            <div>
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
                            </div>
                        )}

                        {/* Tombol di kanan */}
                        <div className="flex gap-4 relative">
                            {/* Tombol Selesai */}
                            {data.status_kerja !== "Resolved" && data.is_validate === true && (
                                <button
                                    onClick={handleMarkAsCompleted}
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-green-700"
                                >
                                    Selesai
                                </button>
                            )}

                            {/* Tombol In Progress */}
                            {data.status_kerja !== "In Progress" && data.is_validate === true && (
                                <button
                                    onClick={handleMarkAsInProgress}
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-yellow-700"
                                >
                                    In Progress
                                </button>
                            )}

                            {/* Tombol Pending */}
                            {data.status_kerja !== "Pending" && data.is_validate === true && (
                                <button
                                    onClick={handleMarkAsPending}
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-red-700"
                                >
                                    Pending
                                </button>
                            )}

                            {/* Tombol Validasi */}
                            {data.is_validate === false && (
                                <div className="justify-end items-end flex gap-2">
                                    <button
                                        onClick={() => handleTolak()}
                                        className="py-2 px-4 bg-white border rounded-full text-xl text-red-500 hover:text-white hover:bg-red-500"
                                    >
                                        &#10006;
                                    </button>
                                    <button
                                        onClick={() => handleValidate()}
                                        className="py-2 px-4 bg-white border rounded-full text-xl text-green-500 hover:text-white hover:bg-green-500"
                                    >
                                        &#10004;
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Modal untuk selesai */}
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

                {userRole === "Admin" && (
                    <div className="mt-8 ease-in transition-all duration-300 flex justify-between items-center">
                        {/* Tombol di kiri */}
                        {data.is_validate === true && (
                            <div>
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
                            </div>
                        )}

                        {/* Tombol di kanan */}
                        <div className="flex gap-4">
                            {/* Tombol Selesai */}
                            {data.status_kerja !== "Resolved" && data.is_validate === true &&(
                                <button
                                    onClick={handleMarkAsCompleted}
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-green-700"
                                >
                                    Selesai
                                </button>
                            )}

                            {/* Tombol In Progress */}
                            {data.status_kerja !== "In Progress" && data.is_validate === true &&(
                                <button
                                    onClick={handleMarkAsInProgress}
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-yellow-700"
                                >
                                    In Progress
                                </button>
                            )}

                            {/* Tombol Pending */}
                            {data.status_kerja !== "Pending" && data.is_validate === true &&(
                                <button
                                    onClick={handleMarkAsPending}
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-red-700"
                                >
                                    Pending
                                </button>
                            )}

                            {/* Tombol Validasi */}
                            {data.is_validate === false && (
                                <div className="justify-end items-end flex gap-2">
                                    <button
                                        onClick={() => handleTolak()}
                                        className="py-2 px-4 bg-white border rounded-full text-xl text-red-500 hover:text-white hover:bg-red-500"
                                    >
                                        &#10006;
                                    </button>
                                    <button
                                        onClick={() => handleValidate()}
                                        className="py-2 px-4 bg-white border rounded-full text-xl text-green-500 hover:text-white hover:bg-green-500"
                                    >
                                        &#10004;
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Modal untuk selesai */}
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

                {userRole === "Support" && (
                    <div className="mt-8 ease-in transition-all duration-300 flex justify-end items-center">
                        {/* Tombol di kanan */}
                        <div className="flex gap-4">
                            {/* Tombol Selesai */}
                            {data.status_kerja !== "Resolved" && (
                                <button
                                    onClick={handleMarkAsCompleted}
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-green-700"
                                >
                                    Selesai
                                </button>
                            )}

                            {/* Tombol In Progress */}
                            {data.status_kerja !== "In Progress" && (
                                <button
                                    onClick={handleMarkAsInProgress}
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-yellow-700"
                                >
                                    In Progress
                                </button>
                            )}

                            {/* Tombol Pending */}
                            {data.status_kerja !== "Pending" && (
                                <button
                                    onClick={handleMarkAsPending}
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-red-700"
                                >
                                    Pending
                                </button>
                            )}
                        </div>

                        {/* Modal untuk selesai */}
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
