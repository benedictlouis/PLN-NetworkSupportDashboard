import Navbar from "../components/navbar";
import EditForm from "../components/editform";

const EditPage = () => {
    return (
        <div className="w-screen min-h-screen relative bg-[#fafafa] pt-2">
            <Navbar />

            <div className="flex flex-col items-center justify-center pl-6 pr-6 pt-16 pb-6">
                <div className="flex flex-col items-center justify-center w-full">
                    <h1 className="font-bold text-[60px] text-gradient pt-4 pb-4">Edit Entry</h1>
                    <h2 className="text-[20px] text-gray-500 pb-6">Edit informasi detail pekerjaan yang ada</h2>
                </div>

                <div className="flex justify-center h-full pt-4 bg-[#fafafa]">
                    <EditForm />
                </div>
            </div>
        </div>
    )
}

export default EditPage;