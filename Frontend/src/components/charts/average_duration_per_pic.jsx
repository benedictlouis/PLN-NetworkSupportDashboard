import React from 'react';
import ReactECharts from 'echarts-for-react';

const AverageDurationPerPIC = ({ data }) => {
  const chartOptions = {
    title: { text: 'Rata-rata Durasi Penyelesaian Pekerjaan per PIC', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.map(d => d.individual_pic), // Nama PIC sebagai kategori
      name: 'PIC',
    },
    yAxis: {
      type: 'value',
      name: 'Durasi (Menit)',
    },
    series: [{
      name: 'Rata-rata Durasi',
      data: data.map(d => d.avg_duration_minutes),
      type: 'bar',
      color: '#3498DB', // Warna biru
      barWidth: '40%', // Atur lebar bar agar proporsional
    }]
  };

  return <ReactECharts option={chartOptions} style={{ height: '400px', width: '100%' }} />;
};

export default AverageDurationPerPIC;
