import React from 'react';
import ReactECharts from 'echarts-for-react';

const StatusDistribution = ({ data }) => {
    const getCategoryColor = (index) => {
        const colors = [
            '#1C94AC', 
            '#299DCA',
            '#4AABDF',
          ]; 
        return colors[index % colors.length];
    };

    const chartOptions = {
        title: {
            text: 'Total Pekerjaan per Status',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} jobs ({d}%)',
        },
        series: [
            {
                type: 'pie',
                radius: '50%',
                data: data.map((item, index) => ({
                    value: item.total_jobs,
                    name: item.status_kerja,
                    itemStyle: {
                        color: getCategoryColor(index),
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

    return (
        <ReactECharts
            option={chartOptions}
            style={{ height: '400px', width: '100%' }}
        />
    );
};

export default StatusDistribution;
