import React from 'react';
import Navbar from '../components/Navbar';
import AccountManagement from '../components/accManagement';

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AccountManagePage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");

        if (isLoggedIn === "false") {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="w-screen min-h-screen relative bg-[#fafafa] pt-2">
            <Navbar />

            <div className=" flex flex-col items-center justify-center h-full w-screen flex-row items-center justify-center pl-8 pr-8 pt-8 pb-8">

                <h1 className="font-bold max-md:hidden text-[60px] text-gradient pt-4 pb-2">Account Management</h1>
                <h2 className="max-md:hidden text-[20px] text-gray-700 pb-12">Manage all account here.</h2>
                <h1 className="font-bold md:hidden md:text-[48px] text-gradient pt-4 pb-2">Account Management</h1>
                <h2 className="md:hidden md:text-[16px] text-gray-700 pb-8">Manage all account here.</h2>

                <AccountManagement />
            </div>
        </div>
    )
}

export default AccountManagePage;