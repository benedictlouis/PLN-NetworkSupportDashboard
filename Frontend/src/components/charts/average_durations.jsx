import React from 'react';
import ReactECharts from 'echarts-for-react';

const AverageDurations = ({ data }) => {
  const chartOptions = {
    title: { text: 'Average Task Durations by Category', left: 'center' },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const { name, value } = params[0];
        return `${name}<br>Average Duration: ${parseFloat(value).toFixed(2)} minutes`;
      },
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.kategori_pekerjaan),  // Using job categories as X-axis data
    },
    yAxis: { type: 'value', name: 'Avg Duration (minutes)' },
    series: [{
      data: data.map(d => d.avg_duration_minutes), // Average task duration
      type: 'bar',
      color: '#409EFF',
    }],
  };

  return <ReactECharts option={chartOptions} style={{ height: '400px', width: '100%' }} />;
};

export default AverageDurations;
