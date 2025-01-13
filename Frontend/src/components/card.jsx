import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Card = () => {
    // const [teams, setTeams] = useState([]);
    // const [searchKeyword, setSearchKeyword] = useState("");
    // const cardsRef = useRef([]);

    // const filteredTeams = teams.filter((team) =>
    //     team.team_name.toLowerCase().includes(searchKeyword.toLowerCase())
    // );

    // useEffect(() => {
    //     fetch("http://localhost:3001/teams") //LINK NYA GANTI
    //         .then((response) => response.json())
    //         .then((data) => setTeams(data))
    //         .catch((error) => console.error("Error fetching data", error));
    // }, []);

    // useEffect(() => {
    //     const observer = new IntersectionObserver(
    //         (entries, observer) => {
    //             entries.forEach((entry) => {
    //                 if (entry.isIntersecting) {
    //                     entry.target.classList.add("opacity-100", "transform-none");
    //                     observer.unobserve(entry.target);
    //                 }
    //             });
    //         },
    //         {
    //             threshold: 0.1,
    //         }
    //     );

    //     cardsRef.current.forEach((card) => {
    //         if (card) {
    //             observer.observe(card);
    //         }
    //     });

    //     return () => {
    //         observer.disconnect();
    //     };
    // }, [filteredTeams]); // Update dependency to include filteredTeams

    // const handleSearchChange = (e) => {
    //     setSearchKeyword(e.target.value);
    // };

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
                    <a href={`http://localhost:5433/data/${report.id}`}>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Wi-Fi</h5>
                    </a>
                    <p className="mb-3 font-normal text-gray-500">
                        Tanggal Laporan: {report.tanggal_awal} <br />
                        Jam Laporan: {report.jam_awal} <br />
                        Nama Pelapor: {report.nama_pelapor_telepon} <br />
                        Divisi: {report.divisi || "N/A"} <br />
                        Lokasi: {report.lokasi || "N/A"} <br />
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
                        href={`http://localhost:5433/data/${report.id}`}
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