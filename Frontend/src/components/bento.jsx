import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AverageDurations from './charts/average_durations'; // Impor komponen chart

const Bento = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // Ambil data dari API backend
        axios.get('http://localhost:5433/chart/duration-by-category') // Sesuaikan URL dengan endpoint API Anda
            .then(response => {
                setChartData(response.data);
            })
            .catch(error => {
                console.error('Error fetching chart data:', error);
            });
    }, []);

    return (
        <div className="grid h-full w-full grid-cols-10 grid-rows-4 gap-4">
            <div className="col-span-5 row-span-2 bg-gray-200 rounded-3xl flex justify-center items-center text-black">
                <AverageDurations data={chartData} /> {/* Chart akan tampil di sini */}
            </div>
            <div className="col-span-3 row-span-1 bg-gray-200 rounded-3xl flex justify-center items-center text-black">Item 2</div>
            <div className="col-span-2 row-span-1 bg-gray-200 rounded-3xl flex justify-center items-center text-black">Item 3</div>
            <div className="col-span-3 row-span-2 bg-gray-200 rounded-3xl flex justify-center items-center text-black">Item 4</div>
            <div className="col-span-2 row-span-1 bg-gray-200 rounded-3xl flex justify-center items-center text-black">Item 5</div>
            <div className="col-span-3 row-span-1 bg-gray-200 rounded-3xl flex justify-center items-center text-black">Item 6</div>
            <div className="col-span-2 row-span-1 bg-gray-200 rounded-3xl flex justify-center items-center text-black">Item 7</div>
            <div className="col-span-2 row-span-1 bg-gray-200 rounded-3xl flex justify-center items-center text-black">Item 8</div>
            <div className="col-span-10 row-span-1 bg-gray-200 rounded-3xl flex justify-center items-center text-black">Item 9</div>
        </div>
    );
}

export default Bento;
