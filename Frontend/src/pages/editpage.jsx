import Navbar from "../components/navbar";
import EditForm from "../components/editform";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");

        if (isLoggedIn === "false") {
            navigate('/login');
        } else if (sessionStorage.getItem("userRole") != "Admin") {
            navigate('/dashboard');
        };
    }, [navigate]);

    return (
        <div className="w-screen min-h-screen relative bg-[#fafafa] pt-2">
            <Navbar />

            <div className="flex flex-col items-center justify-center pl-6 pr-6 pt-16 pb-6">
                <div className="flex flex-col items-center justify-center w-full">
                    <h1 className="font-bold max-md:hidden text-[60px] text-gradient pt-4 pb-2">Edit Pekerjaan</h1>
                    <h2 className="max-md:hidden text-[20px] text-gray-700 pb-6">Edit informasi detail pekerjaan yang ada</h2>
                    <h1 className="font-bold md:hidden md:text-[48px] text-gradient pt-4 pb-2">Edit Pekerjaan</h1>
                    <h2 className="md:hidden md:text-[16px] text-gray-700 pb-6">Edit informasi detail pekerjaan yang ada</h2>
                </div>

                <div className="flex justify-center h-full pt-4 bg-[#fafafa]">
                    <EditForm />
                </div>
            </div>
        </div>
    )
}

export default EditPage;