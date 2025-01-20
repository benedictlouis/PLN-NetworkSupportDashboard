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

    useEffect(() => {
        axios.get('http://localhost:5433/chart/duration-by-category')
            .then(response => {
                console.log ('API response: ', response.data)
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
    }, []);

    return (
        <div className="grid h-full w-full grid-cols-10 grid-rows-4 gap-6">
            <div className="col-span-5 row-span-1 bg-gray-100 rounded-3xl flex justify-center items-center text-black py-4 px-4 shadow">
                <DurationsByCategory data={durationsByCategoryData} /> 
            </div>
            <div className="col-span-5 row-span-1 bg-gray-100 rounded-3xl flex justify-center items-center text-black py-4 px-4 shadow">
                <Durations data={durationsData} /> 
            </div>
            <div className="col-span-5 row-span-1 bg-gray-100 rounded-3xl flex justify-center items-center text-black py-4 px-4 shadow">
                <JobCategories data={jobCategories} /> 
            </div>
            <div className="col-span-5 row-span-1 bg-gray-100 rounded-3xl flex justify-center items-center text-black py-4 px-4 shadow">
                <StatusDistribution data={statusDistributionData} /> 
            </div>
            <div className="col-span-10 row-span-1 bg-gray-100 rounded-3xl flex justify-center items-center text-black py-4 px-4 shadow">
                <JobsPerPic data={jobsPerPicData} /> 
            </div>
            {/* <div className="col-span-5 row-span-1 bg-gray-100 rounded-3xl flex justify-center items-center text-black py-4 px-4 shadow">
                <AverageDurations data={picPercentageData} />
            </div> */}
            <div className="col-span-10 row-span-1 bg-gray-100 rounded-3xl flex justify-center items-center text-black py-4 px-4 shadow">
                <JobsPerMonths data={jobsPerMonthData} />
            </div>
        </div>
    );
}

export default Bento;
