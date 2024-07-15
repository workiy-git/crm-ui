import React, { useEffect, useState } from 'react';
import { Avatar, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MyProfile from '../molecules/my_profile';
import config from '../../config/config';
import Text from '@mui/material/Typography';
import axios from 'axios';
import '../../assets/styles/Sidemenu.css';

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isHorizontal, setIsHorizontal] = useState(false);

  useEffect(() => {
    // Retrieve the isHorizontal state from local storage
    const savedIsHorizontal = localStorage.getItem('isHorizontal') === 'true';
    setIsHorizontal(savedIsHorizontal);

    axios.get(`${config.apiUrl}/menus`)
      .then(response => {
        console.log('Menu data received:', response.data);
        const menuDataArray = response.data.data;
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
          console.log('Mapped menu items:', mappedMenuItems[1]);
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
    navigate(`${path}`);
  };

  const handleButtonClick = () => {
    setIsHorizontal(prevState => {
      const newState = !prevState;
      // Save the new state to local storage
      localStorage.setItem('isHorizontal', newState);
      return newState;
    });
  };

  const [expandicon, setexpandicon] = useState(null); // Initialize as null to handle loading state

  useEffect(() => {
    axios.get(`${config.apiUrl}/menus/menu_bar`) // Use apiUrl from the configuration file
      .then((response) => {
        setexpandicon(response.data.data.menu_expander.icon);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="sidemenu-scrollable-container">
            
      <MyProfile value={isHorizontal ? 'username-display' : 'username-hide'}/>
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <button
          style={{ border: 'none', background: 'none', cursor: 'pointer' }}
          onClick={handleButtonClick}
        >
          <img
            style={{ height: '20px', margin: '10px 10px 15px auto', filter: 'brightness(0) invert(1)' }}
            src={expandicon}
            alt=""
          />
        </button>
      </div>
      <div className="sidemenu-profile-container">
        {menuItems.map((menuItem, index) => {
          const isSelected = selectedOptionIndex === index || (location.pathname === "/" && index === 0);
          return (
            <div
              key={menuItem.title}
              className={`sidemenu-menu-item ${isSelected ? 'sidemenu-menu-item-selected' : ''} ${isHorizontal ? 'sidemenu-menu-item-horizontal' : 'sidemenu-menu-item-vertical'}`}
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
              <img
                src={menuItem.icon}
                alt={menuItem.title}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: 'pointer',
                  borderRadius: '0',
                  margin: '0',
                }}
              />
              <Text
                variant="body2"
                className="sidemenu-typography"
              >
                {menuItem.title}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;
