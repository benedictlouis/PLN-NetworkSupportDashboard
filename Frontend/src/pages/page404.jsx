import Error from "../components/error";
import Navbar from "../components/navbar";

const ErrorPage = () => {
    return (
        <div className="w-screen min-h-screen relative bg-[#fafafa] pt-2">
            <Navbar />

            <div className=" flex flex-col items-center justify-center h-full w-screen flex-row items-center justify-center pl-8 pr-8 pt-8 pb-8">

                <Error />
            </div>
        </div>
    )
}

export default ErrorPage;