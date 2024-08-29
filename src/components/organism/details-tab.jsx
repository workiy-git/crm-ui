import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config/config';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Updates from '../molecules/user-update';
import Comments from '../molecules/user-comments';
import SiteVisits from '../molecules/user-sitevisits';
import '../../assets/styles/style.css';

export default function TabComponent({ mode }) {
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
    <div style={{ width: '100%', height:'100%' }}>
      <Box sx={{ background: '#FFFF', borderRadius: '10px', height:'100%' }}>
        <Box sx={{  borderBottom: 1, borderColor: 'divider', background:'#2C2C2C' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              {Object.keys(companylogoData).map((key, index) => (
                <Tab
                  key={index}
                  style={{
                    color: value === index ? '#FFC03D' : '#808080',
                    // background: value === index ? '#ffffff' : '',
                    borderRadius: '5px 5px 0 0',
                    flexDirection: 'row',
                    gap: '10px',
                    padding:'10px', 
                    marginRight:'5px'
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
        {value === 0 && <Box class="overflow-a" style={{background:'white', borderBottomLeftRadius:'5px', borderBottomRightRadius:'5px', height:'85%'}}><Updates mode= {mode}/></Box>}
        {value === 1 && <Box class="overflow-a" style={{background:'white', borderBottomLeftRadius:'5px', borderBottomRightRadius:'5px', height:'85%'}}><Comments /></Box>}
        {/* {value === 2 && <Box class="overflow-a" style={{background:'white', borderBottomLeftRadius:'5px', borderBottomRightRadius:'5px', height:'85%'}}><SiteVisits /></Box>} */}
        {/* Add similar conditional rendering for other tabs */}
      </Box>
    </div>
  );
}