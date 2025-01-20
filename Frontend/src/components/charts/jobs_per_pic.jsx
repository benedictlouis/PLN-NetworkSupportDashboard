import React from 'react';
import ReactECharts from 'echarts-for-react';

const JobsPerPic = ({ data }) => {
  // Transform data to match the required chart format
  const transformJobsPerPicData = (data) => {
    const categories = [
      'WiFi', 'LAN', 'Whitelist', 'User Access', 'Data Center',
      'WAN', 'Monitoring', 'Pendampingan', 'Pembuatan Laporan/Prosedur/SOP',
      'Konfigurasi', 'Rapat',
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
    title: { text: 'Jobs per PIC by Category', left: 'center' },
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
      '#00008B', // WiFi
      '#00FFFF', // LAN
      '#FF5B00', // Whitelist
      '#FFA07A', // User Access
      '#0000FF', // Data Center
      '#3BA272', // WAN
      '#FFDF00', // Monitoring
      '#9A60B4', // Pendampingan
      '#EA7CCC', // Pembuatan Laporan/Prosedur/SOP
      '#FF0000', // Konfigurasi
      '#800000', // Rapat
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
