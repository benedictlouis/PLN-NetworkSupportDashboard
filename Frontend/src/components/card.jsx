import { useState, useEffect } from "react";

const Card = ({ reports }) => {
    const [loading, setLoading] = useState(false);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', options); // Format tanggal Indonesia
    };

    if (!reports || reports.length === 0) {
        return <p>No reports found.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
                <div key={report.id} className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
                    <a href={`http://localhost:5173/data/${report.id}`}>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                            {report.kategori_pekerjaan} <br />
                            <span className="text-sm font-normal text-gray-500">ID Task: {report.id}</span>
                        </h5>
                    </a>    
                    <p className="mb-3 font-normal text-gray-500">
                        Tanggal Laporan: {formatDate(report.tanggal_awal)} <br />
                        Jam Laporan: {report.jam_awal.replace(":00", "")} WIB <br />
                        Pelapor: {report.nama_pelapor_telepon
                                ? (() => {
                                    const lastDashIndex = report.nama_pelapor_telepon.lastIndexOf(" - ");
                                    if (lastDashIndex === -1) return report.nama_pelapor_telepon.trim(); // Jika tidak ada " - ", tampilkan apa adanya

                                    const nama = report.nama_pelapor_telepon.slice(0, lastDashIndex).trim();
                                    const telepon = report.nama_pelapor_telepon.slice(lastDashIndex + 3).trim(); // +3 karena " - " memiliki 3 karakter

                                    return [nama, telepon].filter(Boolean).join(" - ") || "-";
                                })()
                                : "-"} <br />
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
                        className="inline-flex py-2 px-3 items-center text-sm font-medium text-center bg-[#1C94AC] text-white rounded-lg hover:bg-opacity-70"
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
};

export default Card;