import React from 'react';
import ReactECharts from 'echarts-for-react';

const SLACompliancePerPIC = ({ data }) => {
  const chartOptions = {
    title: { text: 'Kepatuhan SLA per PIC', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.map(d => d.individual_pic), // Nama PIC
    },
    yAxis: { type: 'value', name: 'Total Pekerjaan' },
    series: [{
      name: 'Tepat Waktu',
      data: data.map(d => d.on_time_jobs),
      type: 'bar',
      stack: 'total',
      color: '#3498DB', // Biru
    }, {
      name: 'Terlambat',
      data: data.map(d => d.late_jobs),
      type: 'bar',
      stack: 'total',
      color: '#E67E22', // Oranye
    }]
  };

  return <ReactECharts option={chartOptions} style={{ height: '400px', width: '100%' }} />;
};

export default SLACompliancePerPIC;
