import React from 'react';
import ReactECharts from 'echarts-for-react';

const JobsPerPic = ({ data }) => {
  // Transform data to match the required chart format
  const transformJobsPerPicData = (data) => {
    const categories = [
      'WiFi', 'LAN', 'Whitelist', 'User Access', 'WAN',
      'Monitoring', 'Pendampingan', 'Pembuatan Laporan/Prosedur/SOP', 'Konfigurasi', 'Rapat',
    ];

    const picNames = [...new Set(data.map(item => item.pic_name))];

    const series = categories.map(category => ({
      name: category,
      type: 'bar',
      stack: 'Total',
      data: picNames.map(pic => {
        const job = data.find(d => d.pic_name === pic && d.category === category);
        return job ? job.total_jobs : 0;
      }),
    }));

    return { categories, picNames, series };
  };

  const { categories, picNames, series } = transformJobsPerPicData(data);

  const chartOptions = {
    title: { text: 'Total Pekerjaan Per PIC', left: 'center' },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const details = params
          .map(p => `${p.marker} ${p.seriesName}: ${p.value}`)
          .join('<br>');
        return `${params[0].name}<br>${details}`;
      },
    },
    legend: {
      data: categories,
      bottom: 0,
    },
    color: [
      '#1C94AC',  // warna utama
      '#2499B7',  
      '#299DCA',
      '#33A1DC',
      '#4AABDF',
      '#64B4E2',
      '#80C2E4',
      '#A0D1E7',
      '#B8D9EB',
      '#D0E2EE',
    ],    
    xAxis: {
      type: 'category',
      data: picNames,
      axisLabel: { rotate: 45 },
    },
    yAxis: {
      type: 'value',
      name: 'Total Jobs',
    },
    series,
  };

  return <ReactECharts option={chartOptions} style={{ height: '400px', width: '100%' }} />;
};

export default JobsPerPic;
