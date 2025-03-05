import React from 'react';
import ReactECharts from 'echarts-for-react';

const OverdueJobs = ({ data }) => {
  const chartOptions = {
    title: { text: 'Pekerjaan Melebihi SLA', left: 'center' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } }, 
    legend: { top: 'bottom' }, 
    xAxis: {
      type: 'category',
      data: data.map(d => d.id), 
      name: 'ID Pekerjaan',
    },
    yAxis: { type: 'value', name: 'Durasi (Menit)' },
    series: [
      {
        name: 'Batas SLA',
        data: data.map(d => d.sla_limit_minutes),
        type: 'bar',
        stack: 'total', 
        color: '#E6A23C', 
      },
      {
        name: 'Durasi Aktual',
        data: data.map(d => d.actual_duration_minutes),
        type: 'bar',
        stack: 'total', 
        color: '#F56C6C', 
      },
    ],
  };

  return <ReactECharts option={chartOptions} style={{ height: '400px', width: '100%' }} />;
};

export default OverdueJobs;
