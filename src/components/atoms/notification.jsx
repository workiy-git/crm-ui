import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid } from '@mui/material';
import config from '../../config/config'; // Import the configuration file

const Notification = () => {
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    axios.get(`${config.apiUrl}/menudata`) // Use apiUrl from the configuration file
      .then((response) => {
        console.log('Data received:', response.data);
        setMenuData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Container>
      <Grid container spacing={2}>
        {menuData.map((menuItem, index) => (
          <Grid item key={index}>
            <img
              src={menuItem.menu.menu_bar.menu_images.notifications_icon.icon}
              alt='icon'
              style={{ width: '30px', height: 'auto', cursor: 'pointer' }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Notification;
