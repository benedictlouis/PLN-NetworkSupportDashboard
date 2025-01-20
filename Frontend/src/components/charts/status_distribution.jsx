import React from 'react';
import ReactECharts from 'echarts-for-react';

const StatusDistribution = ({ data }) => {
    const getCategoryColor = (index) => {
        const colors = [
            '#0747a1',
            '#1a8ae5',
            '#64b7f6',
        ];
        return colors[index % colors.length];
    };

    const chartOptions = {
        title: {
            text: 'Job Status Distribution',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} jobs ({d}%)',
        },
        legend: {
            bottom: 10,
            left: 'center',
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
