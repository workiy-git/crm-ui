import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config/config';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Updates from '../molecules/user-update';
import Comments from '../molecules/user-comments';

export default function TabComponent() {
  const [value, setValue] = useState(0);
  const [companylogoData, setCompanylogoData] = useState({});
  const [pageName, setPageName] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    axios.get(`${config.apiUrl}/pages/detailspage`)
      .then((response) => {
        // console.log('tab Data received:', response.data.data);
        setCompanylogoData(response.data.data.Tab);
      })
      .catch((error) => {
        // console.error('Tab Error fetching data:', error);
      });
  }, []);

  return (
    <div style={{ borderRadius: '10px', width: '100%' }}>
      <Box sx={{ background: '#FFC03D', borderRadius: '10px', padding:'10px', height:'66%' }}>
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
                    background: value === index ? '#ffffff' : '',
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
        {value === 0 && <Box class="overflow-a" style={{background:'white', height:'84%', borderBottomLeftRadius:'5px', borderBottomRightRadius:'5px'}}><Updates /></Box>}
        {value === 1 && <Box  style={{background:'white', height:'84%', borderBottomLeftRadius:'5px', borderBottomRightRadius:'5px'}}><Comments /></Box>}
        {/* Add similar conditional rendering for other tabs */}
      </Box>
    </div>
  );
}