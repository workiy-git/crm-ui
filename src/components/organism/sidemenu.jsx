import React, { useEffect, useState } from 'react';
import { Avatar, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Myprofile from '../molecules/my_profile';
import config from '../../config/config';
import axios from 'axios';

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuItems, setMenuItems] = useState([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

  useEffect(() => {
    axios.get(`${config.apiUrl}/menudata`)
      .then(response => {
        const menuData = response.data[0];
        if (menuData && menuData.menu && menuData.menu.sidemenu) {
          const mappedMenuItems = Object.entries(menuData.menu.sidemenu).map(([key, menuItem]) => ({
            ...menuItem,
            path: `/${key}`
          }));
          setMenuItems(mappedMenuItems);

          const selectedIndex = mappedMenuItems.findIndex(item => item.path === location.pathname);
          setSelectedOptionIndex(selectedIndex);
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
    <div style={{backgroundColor: "#0d2d4e"}}>
      <Myprofile />
    <div style={{ width: 'fit-content', textAlign: 'center', margin: 'auto' }}>
      {menuItems.map((menuItem, index) => {
        const isSelected = selectedOptionIndex === index || (location.pathname === "/" && index === 0);
        return (
          <div
            key={menuItem.title}
            style={{
              display: 'block',
              textAlign: 'center',
              zIndex:'3',
              gap: '50px',
              marginTop: '20px',
              position: 'relative',
              transition: 'transform 0.3s ease',
              transform: isSelected ? 'scale(1.1)' : 'scale(1)',
              padding:'2px',
              backgroundColor: isSelected ? '#ff3f14' : '',
              borderRadius:'5px'
            }}
            onClick={() => handleOptionClick(menuItem.path, index)}
           
            // onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            // onMouseLeave={(e) => e.currentTarget.style.transform = isSelected ? 'scale(1.1)' : 'scale(1)'}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              // e.currentTarget.style.backgroundColor = '#ff3f14';
              e.currentTarget.style.fontSize = '10px';

            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = isSelected ? 'scale(1.1)' : 'scale(1)';
              // e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.fontSize = '13px';

            }}
          >
            <Avatar
              // src={isSelected ? menuItem.selected_icon : menuItem.icon}
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
                fontSize:'10px !important',
                // color: isSelected ? '#00AEF8' : 'white',
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