import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Login from "../components/login";

const LoginPage = () => {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch("http://localhost:5433/user/me", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    navigate('/dashboard'); // Redirect jika sudah login
                }
            } catch (error) {
                console.error("Error checking login status:", error);
            } finally {
                setIsChecking(false); // Hentikan loading setelah pengecekan selesai
            }
        };

        checkLoginStatus();
    }, [navigate]);

    if (isChecking) {
        return <div className="flex items-center justify-center h-screen">Checking login status...</div>;
    }

    return (
        <div className="w-screen h-screen relative bg-[#fafafa] pt-2">
            <Navbar />
            <div className="flex flex-col items-center justify-center pl-6 pr-6 pt-16 pb-6">
                <h1 className="font-bold max-md:hidden text-[60px] text-gradient pt-4 pb-4">Log In</h1>
                <h1 className="font-bold md:hidden md:text-[48px] text-gradient pt-4 pb-4">Log In</h1>
                <Login />
            </div>
        </div>
    );
};

export default LoginPage;
