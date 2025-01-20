import React from 'react';
import ReactECharts from 'echarts-for-react';

const JobCategories = ({ data }) => {
    const chartOptions = {
        title: {
            text: 'Job Categories Distribution',
            left: 'center',
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} jobs ({d}%)',
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          series: [
            {
              name: 'Job Categories',
              type: 'pie',
              radius: '50%',
              data: data.map(cat => ({
                value: cat.total_jobs,
                name: cat.kategori_pekerjaan,
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
    
    return <ReactECharts option={chartOptions} />;
};

export default JobCategories;