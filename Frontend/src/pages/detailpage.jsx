import Navbar from '../components/navbar';
import Detail from '../components/detail';

const DetailPage = () => {
  return (
    <div className="w-screen min-h-screen relative bg-[#fafafa] pt-2">
      <Navbar />
      <div className="flex justify-center h-full pt-4 bg-[#fafafa]">
        <Detail />
      </div>
    </div>
  )
}

export default DetailPage;