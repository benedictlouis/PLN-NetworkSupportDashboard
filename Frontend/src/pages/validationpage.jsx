import Navbar from "../components/navbar";
import Card from "../components/card";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const ValidationPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        setIsLoggedIn(isLoggedIn === "true");

        if (isLoggedIn === "false") {
            navigate('/login');
        } else if (sessionStorage.getItem("userRole") !== "Admin" && sessionStorage.getItem("userRole") !== "Super Admin") {
            navigate('/dashboard');
        }

        fetchTasks();
    }, [navigate]);

    const fetchTasks = async () => {
        try {
            const response = await fetch("http://localhost:5433/data/unvalidate");
            const data = await response.json();
            console.log(data);
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
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
                        Tidak ada pekerjaan baru.
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