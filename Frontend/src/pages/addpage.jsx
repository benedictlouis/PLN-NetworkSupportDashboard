import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Form from '../components/form';

const AddPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        setIsLoggedIn(isLoggedIn === "true");

        if (isLoggedIn === "false") {
            navigate('/login');
        };
    }, [navigate]);

    return (
        <div className="w-screen h-full relative bg-[#fafafa] pt-2">
            <Navbar />

            <div className="flex flex-col items-center justify-center pl-6 pr-6 pt-16 pb-6">
                <div className="flex flex-col items-center justify-center w-full">
                    <h1 className="font-bold text-[60px] text-gradient pt-4 pb-4">Tambah Pekerjaan</h1>
                    <h2 className="text-[20px] text-gray-500 pb-6">Tambahkan pekerjaan yang baru diterima</h2>
                </div>

                <div className="flex justify-center h-full pt-4 bg-[#fafafa]">
                    <Form />
                </div>
            </div>
        </div>
    );
};

export default AddPage;
