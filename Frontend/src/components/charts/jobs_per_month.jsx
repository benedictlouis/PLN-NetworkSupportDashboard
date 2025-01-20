import React from 'react';
import ReactECharts from 'echarts-for-react';

const JobsPerMonth = ({ data }) => {
    const chartOptions = {
        title: { text: 'Total Pekerjaan per Bulan', left: 'center' },
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
            areaStyle: { color: '#0747a1' },
            lineStyle: { color: '#1065c0' },
        }],
    };

    return <ReactECharts option={chartOptions} style={{ height: '400px', width: '100%' }} />;
};

export default JobsPerMonth;
