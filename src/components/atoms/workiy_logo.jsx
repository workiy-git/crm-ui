import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config/config'; // Import the configuration file
import '../../assets/styles/style.css'; // Import the CSS file
import { headers } from '../atoms/Authorization'

const WorkiyLogo = ({value}) => {
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
      <div className={`workiy-logo-main  ${value}`}>
        {menuData && menuData.notifications_icon && (
          <img 
            className={`workiy-logo  ${value}`}
            src={menuData.workiy_logo_icon.icon}
            alt='icon'
          />
        )}
      </div>
    </div>
  );
}

export default WorkiyLogo;