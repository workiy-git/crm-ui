import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import config from '../../config/config'; // Import the configuration file



const PlusButton = ({ onClick }) => {
  const [menuData, setMenuData] = useState(null);

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
  }, []);
  return (
    <div>
      <div>
        {menuData && menuData.notifications_icon && (
      <img
            src={menuData.plus_icon.icon}
            alt='icon'
            style={{ width: '25px', height: 'auto', cursor: 'pointer', padding: 2, background:'#fff', borderRadius: '50%',backgroundopacity: '50%'}}    
            onClick={onClick}
          />
        
        )}
      </div>
    </div>
  );
};

export default PlusButton;
