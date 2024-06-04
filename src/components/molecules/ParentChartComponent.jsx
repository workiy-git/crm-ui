import * as React from 'react';
import { useState } from 'react';
import { Grid } from '@mui/material';
import BarChartComponent from '../atoms/barChart';
import PieChartComponent from '../atoms/piechart';
import FilterComponent from '../atoms/ChartFilter';

const allBarChartData = [
  { SocialMedia: 59, IVR: 57, ChannelPartners: 86, ExternalConnectivity: 21, month: 'Jan' },
  { SocialMedia: 50, IVR: 52, ChannelPartners: 78, ExternalConnectivity: 28, month: 'Feb' },
  { SocialMedia: 47, IVR: 53, ChannelPartners: 106, ExternalConnectivity: 41, month: 'Mar' },
  { SocialMedia: 54, IVR: 56, ChannelPartners: 92, ExternalConnectivity: 73, month: 'Apr' },
  { SocialMedia: 57, IVR: 69, ChannelPartners: 92, ExternalConnectivity: 99, month: 'May' },
  { SocialMedia: 60, IVR: 63, ChannelPartners: 103, ExternalConnectivity: 144, month: 'Jun' },
  { SocialMedia: 59, IVR: 60, ChannelPartners: 105, ExternalConnectivity: 319, month: 'Jul' },
  { SocialMedia: 65, IVR: 60, ChannelPartners: 106, ExternalConnectivity: 249, month: 'Aug' },
  { SocialMedia: 51, IVR: 51, ChannelPartners: 95, ExternalConnectivity: 131, month: 'Sep' },
  { SocialMedia: 60, IVR: 65, ChannelPartners: 97, ExternalConnectivity: 55, month: 'Oct' },
  { SocialMedia: 67, IVR: 64, ChannelPartners: 76, ExternalConnectivity: 48, month: 'Nov' },
  { SocialMedia: 61, IVR: 70, ChannelPartners: 103, ExternalConnectivity: 25, month: 'Dec' },
];

const allPieChartData = [
  { value: 25, label: 'Leads', date: new Date('2024-05-01') },
  { value: 18, label: 'Sales', date: new Date('2023-07-01') },
  { value: 17, label: 'New', date: new Date('2024-03-30') },
  { value: 7, label: 'Old', date: new Date('2020-04-01') },
  { value: 46, label: 'Marketing', date: new Date('2024-05-11') },
];

export default function ParentChartComponent() {
    const [barChartData, setBarChartData] = useState(allBarChartData);
    const [pieChartData, setPieChartData] = useState(allPieChartData);
  
    const filterBarChartData = (months) => {
      if (months === 0) {
        setBarChartData(allBarChartData);
      } else {
        const currentMonthIndex = new Date().getMonth();
        const filteredData = allBarChartData.slice(Math.max(currentMonthIndex - months + 1, 0), currentMonthIndex + 1);
        setBarChartData(filteredData);
      }
    };
  
    const filterPieChartData = (months) => {
      if (months === 0) {
        setPieChartData(allPieChartData);
      } else {
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - months);
        setPieChartData(allPieChartData.filter(item => item.date >= cutoff));
      }
    };
  
    const filterData = (months) => {
      filterBarChartData(months);
      filterPieChartData(months);
    };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2, mt: 1 }}>
        <FilterComponent filterData={filterData} />
      </Grid>
      <Grid item xs={12} md={6}>
        <BarChartComponent data={barChartData} />
      </Grid>
      <Grid item xs={12} md={6}>
        <PieChartComponent data={pieChartData} />
      </Grid>
    </Grid>
  );
}
