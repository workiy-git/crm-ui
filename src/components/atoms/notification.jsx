import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import config from '../../config/config'; // Import the configuration file

const Notification = () => {
  const [menuData, setMenuData] = useState(null);

  useEffect(() => {
    axios.get(`${config.apiUrl}/menus/menu_bar`) // Use apiUrl from the configuration file
      .then((response) => {
        console.log('Data received:', response.data);
        setMenuData(response.data.data.menu_images);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item>
          {menuData && menuData.notifications_icon && (
            <img
              src={menuData.notifications_icon.icon}
              alt='icon'
              style={{ width: '30px', height: 'auto', cursor: 'pointer' }}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Notification;
