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
import WindowControls from '../atoms/minimize';
import config from '../../config/config';

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
      <div position="static" style={{ background: "white", color: 'black', boxShadow: 'none', padding: '0px 5px' }}>
        <Toolbar sx={{ flexGrow: 1, height: '10vh' }}>
          <Hamburger />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <FullScreen sx={{ display: { xs: 'none', sm: 'block' } }} />
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Search />
          </Box>
          {/* <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <WindowControls
              onMinimize={handleMinimizeClick}
              onMaximize={handleMaximizeClick}
              onClose={handleCloseClick}
            />
          </Box> */}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { md: 'flex' } }}>
            <Box sx={{ margin: 'auto' }}>
              <Dayin />
            </Box>
            <Box sx={{ margin: 'auto 20px auto auto' }}>
              <Badge badgeContent={7} color="error">
                <Notification />
              </Badge>
            </Box>
            <Companylogo />
          </Box>
        </Toolbar>
      </div>
    </Box>
  );
}

export default Header;
