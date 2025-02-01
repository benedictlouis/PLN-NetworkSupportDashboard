import React from 'react';
import Navbar from '../components/navbar';
import AccountManagement from '../components/accManagement';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AccountManagePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        setIsLoggedIn(isLoggedIn === "true");

        if (isLoggedIn === "false") {
            navigate('/login');
        } else if (sessionStorage.getItem("userRole") != "Admin"){
            navigate('/dashboard');
        };
    }, [navigate]);
    

    return (
        <div className="w-screen min-h-screen relative bg-[#fafafa] pt-2">
            <Navbar />

            <div className=" flex flex-col items-center justify-center h-full w-screen flex-row items-center justify-center pl-8 pr-8 pt-8 pb-8">

                <h1 className="font-bold max-md:hidden text-[60px] text-gradient pt-4 pb-2">Account Management</h1>
                <h2 className="max-md:hidden text-[20px] text-gray-700 pb-12">Manage all accounts here</h2>
                <h1 className="font-bold md:hidden md:text-[48px] text-gradient pt-4 pb-2">Account Management</h1>
                <h2 className="md:hidden md:text-[16px] text-gray-700 pb-8">Manage all accounts here</h2>

                <AccountManagement />
            </div>
            {isLoggedIn && (
                <button
                    onClick={() => (window.location.href = "/register")}
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
            )}
        </div>
    )
}

export default AccountManagePage;