import Navbar from "../components/navbar";
import Card from "../components/card";
import { useState, useEffect } from "react";

const ValidationPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const [mingguFilter, setMingguFilter] = useState("");
    const [bulanFilter, setBulanFilter] = useState("");
    const [tahunFilter, setTahunFilter] = useState("");
    const [kategoriFilter, setKategoriFilter] = useState("");
    const [newestFilter, setNewestFilter] = useState("");
    const [latestFilter, setLatestFilter] = useState("");
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);

    useEffect(() => {
        const loginStatus = sessionStorage.getItem("isLoggedIn");
        setIsLoggedIn(loginStatus === "true");

        // Fetch tasks from the API or other data source
        fetchTasks();
    }, []);

    useEffect(() => {
        handleFilterChange(); // Call the filter function every time a filter value changes
    }, [statusFilter, mingguFilter, bulanFilter, tahunFilter, kategoriFilter, newestFilter, latestFilter]);

    const fetchTasks = async () => {
        try {
            const response = await fetch("http://localhost:5433/data/all");
            const data = await response.json();
            setTasks(data);
            setFilteredTasks(data); // Initially display all tasks
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleFilterChange = () => {
        let filtered = tasks;

        // Filter by status
        if (statusFilter) {
            filtered = filtered.filter((task) => task.status_kerja === statusFilter);
        }

        // Filter by minggu (week) with format "Minggu X"
        if (mingguFilter) {
            filtered = filtered.filter((task) => task.minggu === `Minggu ${mingguFilter}`);
        }

        // Filter by bulan (month)
        if (bulanFilter) {
            filtered = filtered.filter((task) => new Date(task.tanggal_awal).getMonth() + 1 === parseInt(bulanFilter));
        }

        // Filter by tahun (year)
        if (tahunFilter) {
            filtered = filtered.filter((task) => new Date(task.tanggal_awal).getFullYear() === parseInt(tahunFilter));
        }

        // Filter by kategori
        if (kategoriFilter) {
            filtered = filtered.filter((task) => task.kategori_pekerjaan === kategoriFilter);
        }

        // Sorting logic
        if (newestFilter === "newest") {
            filtered = filtered.sort((a, b) => a.id - b.id); // Ascending
        } else if (newestFilter === "latest") {
            filtered = filtered.sort((a, b) => b.id - a.id); // Descending
        }

        setFilteredTasks(filtered);
    };

    // Helper function to get the week number of a date
    const getWeekNumber = (date) => {
        const startDate = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
        return Math.ceil((days + startDate.getDay() + 1) / 7);
    };

    return (
        <div className="relative w-screen bg-[#fafafa] pt-2">
            <Navbar />

            <div className="flex flex-col items-center justify-center pl-6 pr-6 pt-6">
                <h1 className="font-bold max-md:hidden text-[60px] text-gradient pt-4 pb-2">Validasi Pekerjaan</h1>
                <h2 className="max-md:hidden text-[20px] text-gray-700 pb-6">Pastikan kembali apakah pekerjaan sudah sesuai dengan SOP</h2>
                <h1 className="font-bold md:hidden md:text-[48px] text-gradient pt-4 pb-2">Validasi Pekerjaan</h1>
                <h2 className="md:hidden md:text-[16px] text-gray-700 pb-6">Pastikan kembali apakah pekerjaan sudah sesuai dengan SOP</h2>
            </div>

            <div className="min-h-screen pt-6 pl-6 pr-6 pb-6 bg-[#fafafa] justify-center items-center">
                {/* Tampilkan pesan jika tidak ada data yang cocok */}
                {tasks.length === 0 ? (
                    <div className="text-center text-xl text-gray-600 mt-6">
                        Data kosong.
                    </div>
                ) : (
                    <Card reports={tasks} />
                )}
            </div>

            {/* {isLoggedIn && (
                <button
                    onClick={() => (window.location.href = "/add")}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-black-700 hover:bg-[#1C94AC] text-white rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 z-50"
                    aria-label="Tambah"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                </button>
            )} */}
        </div>
    );
}

export default ValidationPage;