import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const Pie = () => {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'series A', color: '#fafafa' },
            { id: 1, value: 15, label: 'series B', color: '#fafafa' },
            { id: 2, value: 20, label: 'series C', color: '#fafafa' },
          ],
        },
      ]}
      width={400}
      height={200}
      className=''
    />
  );
}

export default Pie;