import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Card = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mengambil data dari API
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch("http://localhost:5433/data/all"); // Ganti dengan URL API Anda
                const data = await response.json();
                setReports(data); // Simpan data ke state
            } catch (error) {
                console.error("Error fetching reports:", error);
            } finally {
                setLoading(false); // Set loading menjadi false
            }
        };

        fetchReports();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', options); // Format tanggal Indonesia
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (reports.length === 0) {
        return <p>No reports found.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
                <div key={report.id} className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
                    <a href={`http://localhost:5173/data/${report.id}`}>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{report.kategori_pekerjaan}</h5>
                    </a>
                    <p className="mb-3 font-normal text-gray-500">
                        Tanggal Laporan: {formatDate(report.tanggal_awal)} <br />
                        Jam Laporan: {report.jam_awal} WIB <br />
                        Nama Pelapor: {report.nama_pelapor_telepon} <br />
                        Divisi: {report.divisi || "-"} <br />
                        Lokasi: {report.lokasi || "-"} <br />
                    </p>
                    <p
                        className={`mb-3 font-normal ${report.status_kerja === "Resolved"
                                ? "text-green-500"
                                : report.status_kerja === "In Progress"
                                    ? "text-yellow-500"
                                    : "text-red-500"
                            }`}
                    >
                        {report.status_kerja} <br />
                    </p>

                    <a
                        href={`http://localhost:5173/data/${report.id}`}
                        className="inline-flex py-2 px-3 items-center text-sm font-medium text-center bg-[#1C94AC] text-white rounded-lg hover:bg-blue-700"
                    >
                        Detail
                        <svg
                            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                        </svg>
                    </a>
                </div>
            ))}
        </div>
    );
}

export default Card;
