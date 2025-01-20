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
      '#0747a1', 
      '#1065c0', 
      '#1477d2', 
      '#1a8ae5', 
      '#1e97f3', 
      '#41a7f5', 
      '#64b7f6', 
      '#90cbf9',
      '#bbdffb',
      '#CBDCEB',
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
