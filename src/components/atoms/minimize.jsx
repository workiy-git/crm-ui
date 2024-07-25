import React, { useState, useEffect } from 'react';

import axios from 'axios';
import config from '../../config/config';

const Minimize = ({ onClick }) => {
  
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
            src={menuData.minimize_icon.icon}
            alt='icon'
            style={{ width: '30px', height: 'auto', cursor: 'pointer',padding: '0 0  10px 0'}}
            onClick={onClick}
          />
        )}
      </div>
    </div>
  );
};

export default Minimize;
