import React, { useEffect, useState } from 'react';
import { Avatar, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MyProfile from '../molecules/my_profile';
import config from '../../config/config';
import axios from 'axios';
import '../../assets/styles/Sidemenu.css';

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
              path: value.path,
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
    <div className="sidemenu-scrollable-container">
      <MyProfile />
      <div className="sidemenu-profile-container">
        {menuItems.map((menuItem, index) => {
          const isSelected = selectedOptionIndex === index || (location.pathname === "/" && index === 0);
          return (
            <div
              key={menuItem.title}
              className={`sidemenu-menu-item ${isSelected ? 'sidemenu-menu-item-selected' : ''}`}
              onClick={() => handleOptionClick(menuItem.path, index)}
              onMouseEnter={(e) => {
                e.currentTarget.classList.add('sidemenu-menu-item-hover');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove('sidemenu-menu-item-hover');
                if (isSelected) {
                  e.currentTarget.classList.add('sidemenu-menu-item-selected');
                }
              }}
            >
              <Avatar
                src={menuItem.icon}
                alt={menuItem.title}
                // className="sidemenu-avatar"
                sx={{
                  width: 20,
                  height: 20,
                  cursor: 'pointer',
                  borderRadius: '0',
                  margin: '10px auto',
                }}
              />
              <Typography
                variant="body2"
                className="sidemenu-typography"
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
