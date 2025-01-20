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
    const [averageDurations, setAverageDurations] = useState([]);
    const [durationsData, setDurationsData] = useState([]);
    const [jobCategories, setJobCategories] = useState([]);
    const [jobsPerPicData, setJobsPerPicData] = useState([]);
    const [picPercentageData, setPicPercentageData] = useState([]);
    const [jobsPerMonthData, setJobsPerMonthData] = useState([]);
    const [statusDistributionData, setStatusDistributionData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5433/chart/duration-by-category')
            .then(response => setDurationsByCategoryData(response.data))
            .catch(error => console.error('Error fetching durations by category:', error));
        
            axios.get('http://localhost:5433/chart/durations')
            .then(response => setDurationsData(response.data))
            .catch(error => console.error('Error fetching durations:', error));

        axios.get('http://localhost:5433/chart/average-durations')
            .then(response => setAverageDurations(response.data))
            .catch(error => console.error('Error fetching average durations:', error));

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
        <div className="grid h-full w-full grid-cols-5 grid-rows-4 gap-4">
            <div className="col-span-3 row-span-2 bg-gray-200 rounded-3xl flex justify-center items-center text-black py-4 px-4">
                <DurationsByCategory data={durationsByCategoryData} /> 
            </div>
            <div className="col-span-2 row-span-1 bg-gray-200 rounded-3xl flex justify-center items-center text-black py-4 px-4">
                {/* <Durations data={durationsData} />  */}
            </div>
            <div className="col-span-2 row-span-1 bg-gray-200 rounded-3xl flex justify-center items-center text-black py-4 px-4">
                {/* <JobCategories data={jobCategories} />  */}
            </div>
            <div className="col-span-2 row-span-2 bg-gray-200 rounded-3xl flex justify-center items-center text-black py-4 px-4">
                {/* <JobsPerPic data={jobsPerPicData} />  */}
            </div>
            <div className="col-span-1 row-span-1 bg-gray-200 rounded-3xl flex justify-center items-center text-black py-4 px-4">
                {/* <JobsPerPic data={picPercentageData} />  */}
            </div>
            <div className="col-span-2 row-span-2 bg-gray-200 rounded-3xl flex justify-center items-center text-black py-4 px-4">
                {/* <StatusDistribution data={statusDistributionData} />  */}
            </div>
            <div className="col-span-1 row-span-1 bg-gray-200 rounded-3xl flex justify-center items-center text-black py-4 px-4">
            
            </div>
        </div>
    );
}

export default Bento;
