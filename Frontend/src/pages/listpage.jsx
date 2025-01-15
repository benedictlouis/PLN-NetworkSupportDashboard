import Navbar from "../components/navbar";
import Card from "../components/card";
import { useState, useEffect } from "react";

const ListPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loginStatus = sessionStorage.getItem("isLoggedIn");
        setIsLoggedIn(loginStatus === "true");
    }, []);

    return (
        <div className="relative h-full w-screen bg-[#fafafa] pt-2">
            <Navbar />

            <div className="flex flex-col items-center justify-center pl-6 pr-6 pt-6">
                <h1 className="font-bold max-md:hidden text-[60px] text-gradient pt-4 pb-2">Daftar Pekerjaan</h1>
                <h2 className="max-md:hidden text-[20px] text-gray-700 pb-6">Lihat pekerjaan yang sudah diterima hingga saat ini</h2>
                <h1 className="font-bold md:hidden md:text-[48px] text-gradient pt-4 pb-2">Daftar Pekerjaan</h1>
                <h2 className="md:hidden md:text-[16px] text-gray-700 pb-6">Lihat pekerjaan yang sudah diterima hingga saat ini</h2>
            </div>

            <div className="h-full pt-6 pl-6 pr-6 pb-6 bg-[#fafafa]">
                <Card />
            </div>

            {isLoggedIn && (
                <button
                    onClick={() => (window.location.href = "/add")}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-black-700 hover:bg-black-400 text-white rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 z-50"
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
            )}
        </div>
    );
};

export default ListPage;
