import React from 'react';
import ReactECharts from 'echarts-for-react';

const AverageDurations = ({ data }) => {
  const ChartOptions = {
    title: { text: 'Average Task Durations', left: 'center' },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const { name, value } = params[0];
        return `${name}<br>Average Duration: ${parseFloat(value).toFixed(2)} minutes`;
      },
    },
    xAxis: {
      type: 'category',
      data: data.map(d => `Year ${d.year}, Week ${d.week}`),
    },
    yAxis: { type: 'value', name: 'Avg Duration (minutes)' },
    series: [{
      data: data.map(d => d.avg_duration_minutes),
      type: 'bar',
      color: '#409EFF',
    }],
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: 100,
      },
      {
        type: 'inside',
        xAxisIndex: [0],
      },
    ],
  };

  return <ReactECharts option={ChartOptions} />;
};

export default AverageDurations;
