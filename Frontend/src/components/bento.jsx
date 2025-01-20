import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AverageDurations from './charts/average_durations';
import DurationsByCategory from './charts/durations_by_category';
import Durations from './charts/durations';
import JobCategories from './charts/job_categories';
import JobsPerMonths from './charts/jobs_per_month';
import JobsPerPic from './charts/jobs_per_pic';
import StatusDistribution from './charts/status_distribution';

const Bento = () => {
    const [durationsByCategoryData, setDurationsByCategoryData] = useState([]);
    const [durationsData, setDurationsData] = useState([]);
    const [jobCategories, setJobCategories] = useState([]);
    const [jobsPerPicData, setJobsPerPicData] = useState([]);
    const [picPercentageData, setPicPercentageData] = useState([]);
    const [jobsPerMonthData, setJobsPerMonthData] = useState([]);
    const [statusDistributionData, setStatusDistributionData] = useState([]);
    const [summaryData, setSummaryData] = useState([]);
    const [sumCategoryData, setSumCategoryData] = useState([]);
    const [sumStatusData, setSumStatusData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5433/chart/duration-by-category')
            .then(response => {
                console.log('API response: ', response.data)
                setDurationsByCategoryData(response.data)
            })
            .catch(error => console.error('Error fetching durations by category:', error));

        axios.get('http://localhost:5433/chart/durations')
            .then(response => setDurationsData(response.data))
            .catch(error => console.error('Error fetching durations:', error));

        axios.get('http://localhost:5433/chart/job-categories')
            .then(response => setJobCategories(response.data))
            .catch(error => console.error('Error fetching job categories:', error));

        axios.get('http://localhost:5433/chart/jobs-per-pic')
            .then(response => setJobsPerPicData(response.data))
            .catch(error => console.error('Error fetching jobs per PIC:', error));

        axios.get('http://localhost:5433/chart/jobs-per-pic-percentage')
            .then(response => setPicPercentageData(response.data))
            .catch(error => console.error('Error fetching PIC percentage:', error));

        axios.get('http://localhost:5433/chart/job-status-distribution')
            .then(response => setStatusDistributionData(response.data))
            .catch(error => console.error('Error fetching job status distribution:', error));

        axios.get('http://localhost:5433/chart/jobs-per-month')
            .then(response => setJobsPerMonthData(response.data))
            .catch(error => console.error('Error fetching jobs per month:', error));

        axios.get('http://localhost:5433/data/summary')
            .then(response => setSummaryData(response.data))
            .catch(error => console.error('Error fetching job summary:', error));

        axios.get('http://localhost:5433/data/sumcategory')
            .then(response => setSumCategoryData(response.data))
            .catch(error => console.error('Error fetching unfinished jobs by category:', error));

        axios.get('http://localhost:5433/data/sumstatus')
            .then(response => setSumStatusData(response.data))
            .catch(error => console.error('Error fetching jobs by status:', error));
    }, []);

    return (
        <div className="grid h-full w-full grid-cols-6 grid-rows-6 gap-6">
            <div className="col-span-2 row-span-1 bg-gray-100 rounded-3xl flex justify-center items-center text-white py-4 px-4 shadow bg-pln">
                <div className="flex flex-row items-center gap-x-32 max-md:gap-x-16">
                    <div className="flex flex-col items-center">
                        <h2 className="text-lg max-md:text-sm font-semibold mb-2">Selesai</h2>
                        <p className="text-8xl max-md:text-4xl font-bold">{summaryData.total_jobs || 0}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h2 className="text-lg max-md:text-sm font-semibold mb-2">Belum selesai</h2>
                        <p className="text-8xl max-md:text-4xl font-bold">{summaryData.unfinished_jobs || 0}</p>
                    </div>
                </div>
            </div>
            <div className="col-span-4 row-span-2 bg-white rounded-3xl flex flex-col justify-center items-center py-4 px-4">
                <h2 className="text-3xl max-md:text-xl text-black font-semibold mt-12">Tugas Belum Selesai</h2>
                <h2 className="text-xl max-md:text-sm text-gray-500 font-semibold mb-12">Per Kategori</h2>
                <div className="grid grid-cols-5 gap-4 text-black">
                    {['WiFi', 'LAN', 'Whitelist', 'User Access', 'WAN', 'Monitoring', 'Pendampingan', 'Pembuatan Laporan/Prosedur/SOP', 'Konfigurasi', 'Rapat'].map((category, index) => {
                        const categoryData = sumCategoryData.find(item => item.kategori_pekerjaan === category);
                        const totalJobs = categoryData ? categoryData.total_jobs : '-';
                        return (
                            <div key={index} className="text-center">
                                <p className="text-sm max-md:text-xs font-medium mb-2">{category}</p>
                                <p className="text-4xl max-md:text-md font-semibold mb-12">{totalJobs}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="col-span-2 row-span-1 bg-gray-100 rounded-3xl flex flex-col justify-center items-center text-black py-4 px-4 shadow">
                {/* <h2 className="text-xl font-semibold mb-4">Jobs by Status</h2> */}
                <div className="flex flex-row gap-x-20 max-md:gap-x-6">
                    {sumStatusData.map((status, index) => {
                        let bgColor;
                        switch (status.status_kerja.toLowerCase()) {
                            case "resolved":
                                bgColor = "text-green-500";
                                break;
                            case "in progress":
                                bgColor = "text-yellow-500";
                                break;
                            case "pending":
                                bgColor = "text-red-500";
                                break;
                            default:
                                bgColor = "text-gray-300";
                        }

                        return (
                            <div key={index} className="flex flex-col items-center ">
                                <p className="mt-2 mb-2 text-lg max-md:text-xs text-center font-medium">
                                    {status.status_kerja}
                                </p>
                                <div
                                    className={`flex items-center justify-center rounded-full font-bold text-8xl max-md:text-4xl ${bgColor}`}
                                >
                                    {status.total_jobs}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="col-span-3 row-span-2 bg-gray-100 rounded-3xl flex justify-center items-center text-black py-4 px-4 shadow">
                <JobCategories data={jobCategories} />
            </div>
            <div className="col-span-3 row-span-2 bg-gray-100 rounded-3xl flex justify-center items-center text-black py-4 px-4 shadow">
                <StatusDistribution data={statusDistributionData} />
            </div>
            <div className="col-span-3 row-span-2 bg-gray-100 rounded-3xl flex justify-center items-center text-black py-4 px-4 shadow">
                <Durations data={durationsData} />
            </div>
            <div className="col-span-3 row-span-2 bg-gray-100 rounded-3xl flex justify-center items-center text-black py-4 px-4 shadow">
                <DurationsByCategory data={durationsByCategoryData} />
            </div>
            <div className="col-span-6 row-span-1 bg-gray-100 rounded-3xl flex justify-center items-center text-black py-4 px-4 shadow">
                <JobsPerMonths data={jobsPerMonthData} />
            </div>
            <div className="col-span-6 row-span-1 bg-gray-100 rounded-3xl flex justify-center items-center text-black py-4 px-4 shadow">
                <JobsPerPic data={jobsPerPicData} />
            </div>
            {/* <div className="col-span-5 row-span-1 bg-gray-100 rounded-3xl flex justify-center items-center text-black py-4 px-4 shadow">
                <AverageDurations data={picPercentageData} />
            </div> */}
        </div>
    );
}

export default Bento;
