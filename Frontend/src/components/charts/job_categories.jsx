import React from 'react';
import ReactECharts from 'echarts-for-react';

const JobCategories = ({ data }) => {

  // Function to generate or return predefined colors
  const getCategoryColor = (index) => {
    const colors = [
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

    ];
    return colors[index % colors.length];
  };

  const chartOptions = {
    title: {
      text: 'Job Categories Distribution',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} jobs ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
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
