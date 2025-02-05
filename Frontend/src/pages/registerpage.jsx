import React from 'react';
import Navbar from '../components/navbar';
import Register from '../components/register';

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const RegisterPage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");

        if (isLoggedIn === "false") {
            navigate('/login');
        } else if (sessionStorage.getItem("userRole") !== "Admin" && sessionStorage.getItem("userRole") !== "Super Admin") {
            navigate('/dashboard');
        }
    }, [navigate]);

    return (
        <div className="w-screen h-screen relative bg-[#fafafa] pt-2">
            <Navbar />

            <div className={`flex flex-col items-center justify-center flex-row items-center justify-center pl-6 pr-6 pt-16 pb-6`}>
                <h1 className="font-bold max-md:hidden text-[60px] text-gradient pt-4 pb-4">Register</h1>
                {/* <h2 className="max-md:hidden text-[20px] text-gray-700 pb-12">Manage all account here.</h2> */}
                <h1 className="font-bold md:hidden md:text-[48px] text-gradient pt-4 pb-4">Register</h1>
                {/* <h2 className="md:hidden md:text-[16px] text-gray-700 pb-8">Manage all account here.</h2> */}
                <Register />
            </div>

        </div>
    )
}

export default RegisterPage;