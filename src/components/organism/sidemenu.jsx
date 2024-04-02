import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Typography } from '@mui/material';

const SideMenu = () => {
  const [sideMenuData, setSideMenuData] = useState([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:9000/api/menudata')
      .then((response) => {
        console.log('Menu data received:', response.data);
        const menuData = response.data[0];
        if (menuData && menuData.menu && menuData.menu.sidemenu) {
          setSideMenuData(menuData.menu.sidemenu);
        }
      })
      .catch((error) => {
        console.error('Error fetching menu data:', error);
      });
  }, []);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleIconClick = (index) => {
    setSelectedOptionIndex(index);
  };

  return (
    <div style={{ width: 'fit-content', textAlign: 'center', margin: 'auto' }}>
      {Object.entries(sideMenuData).map(([key, menuItem], index) => (
        <div
          key={key}
          style={{
            display: 'block',
            textAlign: 'center',
            gap: '50px',
            marginTop: '70px',
            position: 'relative',
            transition: 'transform 0.3s ease',
            transform: hoveredIndex === index || selectedOptionIndex === index ? 'scale(1.1)' : 'scale(1)',
          }}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleIconClick(index)}
        >
          <Avatar
            src={index === selectedOptionIndex ? menuItem.selected_icon : menuItem.icon}
            alt={menuItem.title}
            sx={{
              width: 30,
              height: 30,
              cursor: 'pointer',
              borderRadius: '0',
              margin: '10px',
              filter: index === selectedOptionIndex ? 'brightness(80%)' : 'none',
              transition: 'filter 0.3s ease',
            }}
          />
          <Typography
            variant="body2"
            sx={{
              position: 'absolute',
              bottom: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: index === selectedOptionIndex ? '#00AEF8' : '#000000',
              transition: 'color 0.3s ease',
            }}
          >
            {hoveredIndex === index || index === selectedOptionIndex ? menuItem.title : ''}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default SideMenu;
