import Navbar from "../components/navbar";
import Pie from "../components/piechart";
import Bento from "../components/bento";

const MainPage = () => {
    return (
        <div className="w-screen min-h-screen relative bg-[#fafafa] pt-2">
            <Navbar />

            <div className=" flex flex-col items-center justify-center h-full w-screen flex-row items-center justify-center pl-8 pr-8 pt-8 pb-8">
                {/* <h1 className="biru-pln ">ZOOM LICENSE DASHBOARD</h1> */}
                {/* <Pie /> */}

                <h1 className="font-bold max-md:hidden text-[60px] text-gradient pt-4">Dashboard</h1>
                <h2 className="max-md:hidden text-[20px] text-gray-700 pb-12">Let's see the current statistics</h2>
                <h1 className="font-bold md:hidden md:text-[48px] text-gradient pt-4">Dashboard</h1>
                <h2 className="md:hidden md:text-[16px] text-gray-700 pb-8">Let's see the current statistics</h2>

                <Bento />
            </div>
        </div>
    )
}

export default MainPage;