import React from 'react';
import ReactECharts from 'echarts-for-react';

const JobsPerMonth = ({ data }) => {
    const chartOptions = {
        title: { text: 'Jobs per Month', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { 
            type: 'category', 
            data: data.map(d => d.month_year),
        },
        yAxis: { 
            type: 'value', 
            name: 'Jobs' 
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: 0,
            start: 0,
            end: Math.min(100, (10 / data.length) * 100), 
          },
          {
            type: 'inside',
            xAxisIndex: 0,
            start: 0,
            end: Math.min(100, (10 / data.length) * 100), 
          },
        ],
        series: [{
            data: data.map(d => d.total_jobs),
            type: 'line',
            smooth: true,
            areaStyle: { color: 'rgba(255, 140, 0, 0.3)' },
            lineStyle: { color: '#FF8C00' },
        }],
    };

    return <ReactECharts option={chartOptions} style={{ height: '400px', width: '100%' }} />;
};

export default JobsPerMonth;
