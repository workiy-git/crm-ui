import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config/config'; // Import the configuration file
import { headers } from '../atoms/Authorization';

const Refresh = ({ onClick }) => {
  const [menuData, setMenuData] = useState(null);

  useEffect(() => {
    // Fetch notification icon
    axios.get(`${config.apiUrl}/menus/menu_bar`, {headers})
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
            src={menuData.refresh_icon.icon}
            alt='icon'
            style={{ width: '30px', height: 'auto', cursor: 'pointer' }}
            onClick={onClick}
          />
        )}
      </div>
    </div>
  );
}

export default Refresh;