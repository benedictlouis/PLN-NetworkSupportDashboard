import Navbar from "../components/navbar";
import Card from "../components/card";

const ListPage = () => {
    return (
        <div className="relative h-screen w-screen bg-[#fafafa] pt-2">
            <Navbar />

            <div className=" flex flex-col items-center justify-center flex-row items-center justify-center pl-6 pr-6 pt-6">
        
                <h1 className="font-bold max-md:hidden text-[60px] text-gradient pt-4 pb-2">Daftar Gangguan</h1>
                <h2 className="max-md:hidden text-[20px] text-gray-700 pb-6">Let's see the current statistics</h2>
                <h1 className="font-bold md:hidden md:text-[48px] text-gradient pt-4 pb-2">Daftar Gangguan</h1>
                <h2 className="md:hidden md:text-[16px] text-gray-700 pb-6">Let's see the current statistics</h2>
                
            </div>

            <div className="h-full pt-6 pl-6 pr-6 pb-6 bg-[#fafafa]">
                <Card />
            </div>

        </div>
    )
}

export default ListPage;