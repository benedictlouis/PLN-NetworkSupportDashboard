import Navbar from "../components/navbar";
import Login from "../components/login";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");

        if (isLoggedIn === "true") {
            navigate('/dashboard');
        }
    }, [navigate]);

    return (
        <div className="w-screen h-screen relative bg-[#fafafa] pt-2">
            <Navbar />

            <div className={`flex flex-col items-center justify-center flex-row items-center justify-center pl-6 pr-6 pt-16 pb-6`}>
                <h1 className="font-bold max-md:hidden text-[60px] text-gradient pt-4 pb-4">Log In</h1>
                <h1 className="font-bold md:hidden md:text-[48px] text-gradient pt-4 pb-4">Log In</h1>
                <Login />
            </div>

        </div>
    )
};

export default LoginPage;