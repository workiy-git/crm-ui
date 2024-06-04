// import * as React from 'react';
// import { useState } from 'react';
// import { PieChart } from '@mui/x-charts/PieChart';
// import { Box, Typography, Paper, Grid, ButtonGroup, Button } from '@mui/material';

// // Assuming your data now includes a date field
// const allData = [
//   { value: 5, label: 'Leads', date: new Date('2024-05-01') },
//   { value: 10, label: 'Sales', date: new Date('2023-07-01') },
//   { value: 15, label: 'New', date: new Date('2024-03-30') },
//   { value: 20, label: 'Old', date: new Date('2020-04-01') },
//   { value: 40, label: 'Marketing', date: new Date('2024-05-11') },

// ];

// export default function BarChaer() {
//   const [data, setData] = useState(allData);

//   const filterData = (months) => {
//     const cutoff = new Date();
//     cutoff.setMonth(cutoff.getMonth() - months);
//     setData(allData.filter(item => item.date >= cutoff));
//   };

//   const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

//   const getArcLabel = (params) => {
//     const percent = params.value / TOTAL;
//     return `${(percent * 100).toFixed(0)}%`;
//   };

//   return (
//     <Box sx={{ width:'50%' }}>
        
//       <Grid item xs={12} sm={6} md={6}>
      
//         <Paper sx={{ p: '20px',m: '10px'}}>
//             <Box sx={{display:'flex', justifyContent:'space-between'}}>
//             <Typography variant="h6" component="div">
//                 Recent Marketing
//             </Typography>
//             <ButtonGroup variant="contained" aria-label="outlined primary button group">
//             <Button onClick={() => setData(allData)}>All</Button>
//             <Button onClick={() => filterData(1)}>1 Month</Button>
//             <Button onClick={() => filterData(3)}>3 Months</Button>
//             <Button onClick={() => filterData(12)}>1 Year</Button>
//             </ButtonGroup>
//             </Box>
          
//           <PieChart
//             series={[
//               {
//                 data,
//                 highlightScope: { faded: 'global', highlighted: 'item' },
//                 faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
//                 arcLabel: getArcLabel,
//                 innerRadius: 30
//               },
//             ]}
//             height={200}
//           />
//         </Paper>
//       </Grid>
//     </Box>
//   );
// }


import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography, Paper } from '@mui/material';

const chartSetting = {
  width: 500,
  height: 300,
};

const valueFormatter = (value) => `${value}`;

export default function BarChartComponent({ data }) {
  return (
    <Box sx={{ width: '100%' }}>
      <div style={{ padding: '20px', margin: '10px' }}>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          Monthly Leads
        </Typography>
        <BarChart
          dataset={data}
          xAxis={[{ scaleType: 'band', dataKey: 'month', label: 'Month' }]}
          yAxis={[{ label: 'Leads' }]}
          series={[
            { dataKey: 'SocialMedia', label: 'SocialMedia Leads', valueFormatter, color: '#1976d2' },
            { dataKey: 'ExternalConnectivity', label: 'ExternalConnectivity Leads', valueFormatter, color: '#a200ff' },
            { dataKey: 'IVR', label: 'IVR Leads', valueFormatter, color: '#ff9800' },
            { dataKey: 'ChannelPartners', label: 'ChannelPartners Leads', valueFormatter, color: '#dc004e' },
            
          ]}
          layout="vertical"
          {...chartSetting}
        />
      </div>
    </Box>
  );
}
