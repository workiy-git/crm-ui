import React, { useEffect, useState } from 'react';
import { Avatar, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MyProfile from '../molecules/my_profile';
import config from '../../config/config';
import axios from 'axios';

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

  useEffect(() => {
    axios.get(`${config.apiUrl}/menus`)
      .then(response => {
        console.log('Menu data received:', response.data);
        const menuDataArray = response.data.data; // Accessing the data array
        const menuData = menuDataArray.find(menu => menu.menu === 'sidemenu');
        if (menuData) {
          const mappedMenuItems = Object.entries(menuData)
            .filter(([key, value]) => key !== 'menu' && key !== '_id')
            .map(([key, value]) => ({
              title: value.title,
              icon: value.icon,
              selectedIcon: value.selected_icon,
              path: `/${key}`
            }));
          console.log('Mapped menu items:', mappedMenuItems);
          setMenuItems(mappedMenuItems);

          const selectedIndex = mappedMenuItems.findIndex(item => item.path === location.pathname);
          setSelectedOptionIndex(selectedIndex);
        } else {
          console.warn('No sidemenu data found in response.');
        }
      })
      .catch(error => {
        console.error('Error fetching menu data:', error);
      });
  }, [location.pathname]);

  const handleOptionClick = (path, index) => {
    setSelectedOptionIndex(index);
    navigate(path);
  };

  return (
    <div style={{ backgroundColor: "#0d2d4e" }}>
      <MyProfile />
      <div style={{ width: 'fit-content', textAlign: 'center', margin: 'auto' }}>
        {menuItems.map((menuItem, index) => {
          const isSelected = selectedOptionIndex === index || (location.pathname === "/" && index === 0);
          return (
            <div
              key={menuItem.title}
              style={{
                display: 'block',
                textAlign: 'center',
                zIndex: '3',
                gap: '50px',
                marginTop: '20px',
                position: 'relative',
                transition: 'transform 0.3s ease',
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                padding: '2px',
                backgroundColor: isSelected ? '#ff3f14' : '',
                borderRadius: '5px'
              }}
              onClick={() => handleOptionClick(menuItem.path, index)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.fontSize = '10px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = isSelected ? 'scale(1.1)' : 'scale(1)';
                e.currentTarget.style.fontSize = '13px';
              }}
            >
              <Avatar
                src={menuItem.icon}
                alt={menuItem.title}
                sx={{
                  width: 20,
                  height: 20,
                  cursor: 'pointer',
                  borderRadius: '0',
                  margin: '10px',
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: '10px !important',
                  color: 'white',
                  transition: 'color 0.3s ease',
                }}
              >
                {menuItem.title}
              </Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;
