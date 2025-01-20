import React from 'react';
import ReactECharts from 'echarts-for-react';

const DurationsByCategory = ({ data }) => {
    const chartOptions = {
        title: { text: 'Durations by Category (Minutes)', left: 'center' },
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                const { name, value } = params[0];
                return `${name}<br>Duration: ${parseFloat(value).toFixed(2)} minutes`;
            },
        },
        xAxis: { 
            type: 'category', 
            data: data.map(d => d.category),
        },
        yAxis: { 
            type: 'value', 
            name: 'Avg Duration (minutes)' 
        },
        series: [{
            data: data.map(d => d.duration_minutes),
            type: 'bar',
            smooth: false,
            color: '#FF7043',
            label: {
                show: true,
                position: 'top',
                color: '{c} min',
            }
        }],
    };

    return <ReactECharts option={chartOptions} />;
};

export default DurationsByCategory;