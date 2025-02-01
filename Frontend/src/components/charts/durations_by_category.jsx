import React from 'react';
import ReactECharts from 'echarts-for-react';

const DurationsByCategory = ({ data }) => {
    const chartOptions = {
        title: { text: ' Rata-rata Durasi Pekerjaan per Kategori (Menit)', left: 'center' },
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                const { name, value } = params[0];
                return `${name}<br>Duration: ${parseFloat(value).toFixed(2)} minutes`;
            },
        },
        xAxis: { 
            type: 'category', 
            data: data.map(d => d.kategori_pekerjaan),
        },
        yAxis: { 
        },
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
            data: data.map(d => d.avg_duration_minutes),
            type: 'bar',
            smooth: false,
            color: '#1C94AC',
            label: {
                show: true,
                position: 'top',
                color: '{c} min',
            }
        }],
    };

    return <ReactECharts option={chartOptions} style={{ height: '300px', width: '100%' }} />;
};

export default DurationsByCategory;