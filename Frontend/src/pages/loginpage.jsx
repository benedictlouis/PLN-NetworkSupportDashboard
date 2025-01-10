import Navbar from "../components/navbar";
import Login from "../components/login";

const LoginPage = () => {
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