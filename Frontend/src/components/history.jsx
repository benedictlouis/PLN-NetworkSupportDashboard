import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const History = () => {
    const { id } = useParams();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch(`http://localhost:5433/data/history/${id}`);

                if (response.status === 404) {
                    setHistory([]);
                    return;
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch history data");
                }

                const data = await response.json();
                setHistory(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        // Memanggil fetchHistory secara berkala
        const intervalId = setInterval(fetchHistory, 3000); // update setiap 5 detik

        // Cleanup interval saat komponen dibuang
        return () => clearInterval(intervalId);
    }, [id]);

    if (loading) return <p className="text-center">Loading history...</p>;

    // **Mengelompokkan data berdasarkan tanggal**
    const groupedHistory = history.reduce((acc, item) => {
        const date = new Date(item.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});

    const formatColumnName = (name) => {
        return name
            .replace(/_/g, " ") // Ganti underscore dengan spasi
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Kapitalisasi kata pertama
    };

    const formatValue = (column, value) => {
        if (column.toLowerCase().includes("tanggal")) {
            if (!value) return "-";

            const formatTanggal = new Date(value).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });

            return formatTanggal === "01 Januari 1970" ? "-" : formatTanggal;
        }

        if (column.toLowerCase().includes("jam")) {
            if (!value) return "-";

            const parsedTime = new Date(`1970-01-01T${value}`);
            if (isNaN(parsedTime)) return "-";

            return parsedTime.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
            }).replace(":", ".") + " WIB";
        }

        if (column.toLowerCase().includes("nama_pelapor_telepon")) {
            if (!value) return "-";

            const lastDashIndex = value.lastIndexOf(" - ");

            let namaPelapor, teleponPelapor;

            if (lastDashIndex !== -1) {
                namaPelapor = value.slice(0, lastDashIndex).trim();
                teleponPelapor = value.slice(lastDashIndex + 3).trim(); // +3 karena " - " memiliki 3 karakter
            } else {
                namaPelapor = value.trim(); // Jika tidak ada "-", anggap semuanya adalah nama
                teleponPelapor = "";
            }

            // **Aturan tampilan**
            if (namaPelapor && teleponPelapor) {
                return `${namaPelapor} - ${teleponPelapor}`;
            } else if (namaPelapor) {
                return namaPelapor;
            } else if (teleponPelapor) {
                return teleponPelapor;
            } else {
                return "-";
            }
        }

        return value || "-";
    };

    return (
        <div className="pt-6">
            <h1 className="font-bold text-[20px] text-gradient px-4">History</h1>
            <div className="p-4 overflow-y-auto bg-gray-50 max-h-screen">
                {Object.keys(groupedHistory).length === 0 && (
                    <p className="flex justify-center items-center text-center text-gray-500">Tidak ada history saat ini</p>
                )}
                {Object.keys(groupedHistory).map((date, index) => (
                    <div key={index} className="p-4 mb-4 border border-gray-200 rounded-lg bg-white">
                        <time className="text-lg font-semibold text-gray-900">{date}</time>
                        <ol className="mt-3 divide-y divide-gray-200">
                            {groupedHistory[date].map((item, idx) => (
                                <li key={idx} className="p-3 hover:bg-gray-100">
                                    <p className="text-xs font-normal text-gray-500 pb-2 flex justify-start">
                                        {new Date(item.date).toLocaleTimeString("id-ID", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }).replace(":", ".") + " WIB"}
                                    </p>
                                    {item.column_name === "created" && item.new_value.includes("telah membuat pekerjaan baru") ? (
                                        <p className="text-sm font-normal text-gray-700">
                                            <span className="font-medium text-black">{item.username}</span> menambahkan pekerjaan.
                                        </p>
                                    ) : (
                                        <>
                                            <p className="text-sm font-normal text-gray-700">
                                                <span className="font-medium text-black">{item.username}</span> mengubah
                                                <span className="font-medium text-black"> {formatColumnName(item.column_name)}</span>.
                                            </p>
                                            <p className="pt-1 text-xs text-gray-500 flex items-center">
                                                {formatValue(item.column_name, item.old_value)}
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    className="mx-1"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
                                                </svg>
                                                {formatValue(item.column_name, item.new_value)}
                                            </p>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;