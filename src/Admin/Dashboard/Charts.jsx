import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function BasisChart() {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 5, label: 'Total' },
            { id: 1, value: 25, label: 'Delivered' },
          ],
        },
      ]}
      width={450}
      height={200}
    />
  );
}
