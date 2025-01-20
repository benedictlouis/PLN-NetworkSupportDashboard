import React from 'react';
import ReactECharts from 'echarts-for-react';

const StatusDistribution = ({ data }) => {
    const chartOptions = {
        title: { text: 'Job Status Distribution', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { bottom: 10, left: 'center' },
        series: [{
            type: 'pie',
            radius: '50%',
            data: data.map(d => ({
                value: d.total_jobs,
                name: d.status_kerja,
                itemStyle: {
                    color: d.status_kerja === 'Resolved' ? '#22C55E' : 
                           d.status_kerja === 'In Progress' ? '#FFED29' :
                           d.status_kerja === 'Pending' ? '#EF4444' : 
                            undefined,
                        },
            })),
        }],
    }

    return <ReactECharts option={chartOptions} />;
}

export default StatusDistribution;