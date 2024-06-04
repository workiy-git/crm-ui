import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography, Paper } from '@mui/material';

export default function PieChartComponent({ data }) {
  const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

  const getArcLabel = (params) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <div style={{ padding: '20px', margin: '10px' }}>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          Recent Marketing
        </Typography>
        <PieChart
          series={[
            {
              data: data.map(item => ({
                ...item,
                arcLabel: getArcLabel(item),
              })),
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              innerRadius: 30
            },
          ]}
          height={200}
        />
      </div>
    </Box>
  );
}
