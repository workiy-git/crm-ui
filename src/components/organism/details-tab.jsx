import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config/config';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Update from '../molecules/user-update';
import Comments from '../molecules/user-comments';

export default function TabComponent() {
  const [value, setValue] = useState(0);
  const [companylogoData, setCompanylogoData] = useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    axios.get(`${config.apiUrl}/pages/detailspage`)
      .then((response) => {
        console.log('tab Data received:', response.data.data);
        setCompanylogoData(response.data.data.Tab);
      })
      .catch((error) => {
        console.error('Tab Error fetching data:', error);
      });
  }, []);

  return (
    <div style={{ background: '#0d2d4e', padding: '5px', borderRadius: '10px', width: '65%',height:'70vh' }}>
      <Box sx={{ background: '#0d2d4e', borderRadius: '10px' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              {Object.keys(companylogoData).map((key, index) => (
                <Tab
                  key={index}
                  style={{
                    color: value === index ? '#0d2d4e' : '#ffffff',
                    background: value === index ? '#ffffff' : '#0d2d4e',
                    borderRadius: '5px 5px 0 0',
                    flexDirection: 'row',
                    gap: '10px'
                  }}
                  label={
                    <>
                      <img src={companylogoData[key].icon} alt='icon' style={{ width: '20px' }} />
                      {companylogoData[key].label}
                    </>
                  }
                />
              ))}
            </Tabs>
        </Box>
        {value === 0 && <Box><Update /></Box>}
        {value === 1 && <Box><Comments /></Box>}
        {/* Add similar conditional rendering for other tabs */}
      </Box>
    </div>
  );
}