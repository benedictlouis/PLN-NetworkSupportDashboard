import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Detail = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loginStatus = sessionStorage.getItem("isLoggedIn");
        setIsLoggedIn(loginStatus === "true");

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
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>No data available</div>;
    }

    const picArray = Array.isArray(data.pic) ? data.pic : [data.pic];

    const handleEdit = () => {
        navigate(`/edit/${id}`);
    };

    const handleDelete = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this job?");
        if (confirmDelete) {
            axios
                .delete(`http://localhost:5433/data/${id}`)
                .then((response) => {
                    alert("Job deleted successfully");
                    navigate("/list");
                })
                .catch((error) => {
                    console.error("Error deleting job:", error);
                    alert("Failed to delete the job");
                });
        }
    };

    const handleMarkAsCompleted = () => {
        const updatedData = {
            ...data,
            solusi_keterangan: "Solved",
            tanggal_selesai: new Date().toISOString(),
        };

        axios
            .put(`http://localhost:5433/data/${id}`, updatedData)
            .then((response) => {
                setData(response.data);
                alert("Job marked as completed.");
            })
            .catch((error) => {
                console.error("Error marking job as completed:", error);
                alert("Failed to mark the job as completed");
            });
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

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col items-center justify-center w-full">
                <h1 className="font-bold text-[60px] text-gradient pt-4">{data.kategori_pekerjaan}</h1>
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
                        <p className="text-sm text-gray-500">Nama Pelapor</p>
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
                        {/* <p className="text-gray-700">{calculateDuration(`${data.tanggal_awal}`, data.tanggal_selesai)}</p> */}
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">PIC</h3>
                    <div className="text-gray-700">
                        <p className="text-sm text-gray-500">PIC</p>
                        {picArray.map((pic, index) => (
                            <p key={index}>{pic.replace("{", "").replace("}", "").replace(",", ", ")}</p> 
                        ))}
                    </div>
                </div>

                {isLoggedIn && (
                    <div className="mt-8">
                        <button
                            onClick={handleEdit}
                            className="mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                        >
                            Delete
                        </button>
                        {!data.solusi_keterangan || !data.tanggal_selesai ? (
                            <button
                                onClick={handleMarkAsCompleted}
                                className="mx-4 mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                            >
                                Mark as Selesai
                            </button>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Detail;
