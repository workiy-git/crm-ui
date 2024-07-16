import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Badge } from '@mui/material';
import config from '../../config/config'; // Import the configuration file

const Notification = () => {
  const [menuData, setMenuData] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Fetch notification icon
    axios.get(`${config.apiUrl}/menus/menu_bar`)
      .then((response) => {
        console.log('Data received:', response.data);
        setMenuData(response.data.data.menu_images);
      })
      .catch((error) => {
        console.error('Error fetching menu data:', error);
      });
  
    // Fetch notification count
    axios.get(`${config.apiUrl}/appdata`)
      .then((response) => {
        console.log('Notification data received:', response.data.data);
        const a = response.data.data;
        setCount(a.length);
        console.log("count", a.length); // Assuming 'a' is an array or string
        if (response.data && response.data.count) { // Assuming count is the property holding notification count
          setNotificationCount(response.data.count); // Adjust accordingly if count is named differently
        }
      })
      .catch((error) => {
        console.error('Error fetching notification data:', error);
      });
  }, []);
  

  const handleNotificationClick = () => {
    // Mark notifications as read
    setNotificationCount(0);

    // Additional code to mark notifications as read in the backend could be added here
    axios.post(`${config.apiUrl}/appdata`)
      .then((response) => {
        console.log('Notifications marked as read:', response.data);
      })
      .catch((error) => {
        console.error('Error marking notifications as read:', error);
      });
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item>
          {menuData && menuData.notifications_icon && (
            <Badge badgeContent={count} color="error" max={99999}>
              <img
                src={menuData.notifications_icon.icon}
                alt='icon'
                style={{ width: '30px', height: 'auto', cursor: 'pointer',
                  filter: "brightness(0) invert(1)" }}
                onClick={handleNotificationClick}
              />
            </Badge>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Notification;
