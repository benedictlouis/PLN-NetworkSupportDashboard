import React from 'react';
import ReactECharts from 'echarts-for-react';

const Durations = ({ data }) => {
  const chartOptions = {
    title: { text: 'Durasi Pekerjaan (Menit)', left: 'center' },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const { name, value } = params[0];
        return `${name}<br>Duration: ${parseFloat(value).toFixed(2)} minutes`;
      },
    },
    xAxis: { 
      type: 'category', 
      data: data.map(d => `Task ${d.id}`),
    },
    yAxis: { type: 'value',  },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: 0,
        start: 0,
        end: 100,
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: 100,
      },
    ],
    series: [{
      data: data.map(d => d.duration_minutes),
      type: 'line',
      smooth: false,
      lineStyle: { color: '#1C94AC' },
      areaStyle: { color: '#299DCA' },
    }],
  };

  return <ReactECharts option={chartOptions} style={{ height: '300px', width: '100%' }} />;
};

export default Durations;
