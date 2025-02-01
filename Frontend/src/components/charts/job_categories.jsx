import React from 'react';
import ReactECharts from 'echarts-for-react';

const JobCategories = ({ data }) => {

  // Function to generate or return predefined colors
  const getCategoryColor = (index) => {
    const colors = [
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
    ];    
    return colors[index % colors.length];
  };

  const chartOptions = {
    title: {
      text: 'Total Pekerjaan per Kategori',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} jobs ({d}%)',
    },
    series: [
      {
        name: 'Job Categories',
        type: 'pie',
        radius: '50%',
        data: data.map((cat, index) => ({
          value: cat.total_jobs,
          name: cat.kategori_pekerjaan,
          itemStyle: {
            color: getCategoryColor(index), // Assign custom color
          },
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return <ReactECharts option={chartOptions} style={{ height: '400px', width: '100%' }} />;
};

export default JobCategories;
