import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Badge from '@mui/material/Badge';
import Hamburger from '../molecules/list';
import FullScreen from '../atoms/full_screen';
import Companylogo from '../atoms/company_logo';
import Search from '../atoms/search';
import Notification from '../atoms/notification';
import Dayin from '../atoms/dayin';
import config from '../../config/config';
import '../../assets/styles/header.css'


const Header = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [headerData, setHeaderData] = useState(null);

  useEffect(() => {
    axios.get(`${config.apiUrl}/menus`)
      .then(response => {
        const headerData = response.data.data.find(menu => menu.menu === 'header');
        setHeaderData(headerData);
      })
      .catch(error => {
        console.error('Error fetching header data:', error);
      });
  }, []);

  const handleMinimizeClick = () => {
    setIsMinimized(true);
  };

  const handleMaximizeClick = () => {
    setIsMaximized(!isMaximized);
  };

  const handleCloseClick = () => {
    console.log('Window closed');
  };

  if (isMinimized) {
    return null; // Return null when minimized
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div className="header-container">
        <Toolbar className="header-toolbar">
          <div className="hamburger-box-main">
          <Hamburger className="hamburger-box" />
          </div>
          <Box className="fullscreen-box">
            <FullScreen />
          </Box>
          <Box className="flex-grow" />

          <Box>
            <Search />
          </Box>
          <Box className="flex-grow" />
          <Box className="header-right-box">
            <Box className="dayin-box">
              <Dayin />
            </Box>
            <Box className="notification-box">
              <Badge>
                <Notification />
              </Badge>
            </Box>
            <Companylogo  style={{background:'white'}}/>
          </Box>
        </Toolbar>
      </div>
    </Box>
  );
}

export default Header;
