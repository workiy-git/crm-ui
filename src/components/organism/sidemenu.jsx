import React, { useEffect, useState, useMemo } from 'react';
import {
  Avatar,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MyProfile from '../molecules/my_profile';
import Text from '@mui/material/Typography';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import config from '../../config/config';
import axios from 'axios';
import '../../assets/styles/Sidemenu.css';

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isHorizontal, setIsHorizontal] = useState(false); // Default to false for vertical mode
  const [open, setOpen] = useState(false);
  const [selectedMenuItems, setSelectedMenuItems] = useState([]);
  const maxVerticalItems = 7;
  const maxHorizontalItems = 7;
  const [expandicon, setexpandicon] = useState(null); // Initialize as null to handle loading state

  useEffect(() => {
    const initializeState = async () => {
      const savedIsHorizontal = localStorage.getItem('isHorizontal') === 'true';
      setIsHorizontal(savedIsHorizontal !== null ? savedIsHorizontal : false);

      const savedSelectedMenuItems = JSON.parse(localStorage.getItem('selectedMenuItems') || '[]');
      
      const fetchMenuData = async () => {
        try {
          const response = await axios.get(`${config.apiUrl}/menus`);
          const menuDataArray = response.data.data;
          const menuData = menuDataArray.find((menu) => menu.menu === 'sidemenu');
          if (menuData) {
            const mappedMenuItems = Object.entries(menuData)
              .filter(([key]) => key !== 'menu' && key !== '_id')
              .map(([key, value]) => ({
                title: value.title,
                icon: value.icon,
                selectedIcon: value.selected_icon,
                path: value.path,
              }));

            setMenuItems(mappedMenuItems);

            if (savedSelectedMenuItems.length === 0) {
              setSelectedMenuItems(mappedMenuItems.slice(0, maxVerticalItems)); // Default to first 7 items
            } else {
              const updatedSelectedMenuItems = savedSelectedMenuItems.filter((savedItem) =>
                mappedMenuItems.some((item) => item.title === savedItem.title)
              );
              setSelectedMenuItems(updatedSelectedMenuItems.length > 0 ? updatedSelectedMenuItems : mappedMenuItems.slice(0, maxVerticalItems));
            }

            const selectedIndex = mappedMenuItems.findIndex((item) => item.path === location.pathname);
            setSelectedOptionIndex(selectedIndex);
          } else {
            console.warn('No sidemenu data found in response.');
          }
        } catch (error) {
          console.error('Error fetching menu data:', error);
        }
      };

      const fetchMenuExpanderIcon = async () => {
        try {
          const response = await axios.get(`${config.apiUrl}/menus/menu_bar`);
          setexpandicon(response.data.data.menu_expander.icon);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchMenuData();
      fetchMenuExpanderIcon();
    };

    initializeState();
  }, [location.pathname]);

  const handleOptionClick = (path, index) => {
    setSelectedOptionIndex(index);
    navigate(`${path}`);
  };

  const handleButtonClick = () => {
    setIsHorizontal((prevState) => {
      const newState = !prevState;
      localStorage.setItem('isHorizontal', newState);
      setSelectedMenuItems(menuItems.slice(0, newState ? maxHorizontalItems : maxVerticalItems));
      return newState;
    });
  };

  const handleMoreClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (index) => {
    const selectedIndex = selectedMenuItems.findIndex((item) => item.title === menuItems[index].title);
    let newSelectedMenuItems = [];

    if (selectedIndex === -1) {
      newSelectedMenuItems = [...selectedMenuItems, menuItems[index]];
    } else {
      newSelectedMenuItems = selectedMenuItems.filter((item) => item.title !== menuItems[index].title);
    }

    if (newSelectedMenuItems.length <= (isHorizontal ? maxHorizontalItems : maxVerticalItems)) {
      setSelectedMenuItems(newSelectedMenuItems);
      localStorage.setItem('selectedMenuItems', JSON.stringify(newSelectedMenuItems));
    } else {
      alert(`You can select up to ${isHorizontal ? maxHorizontalItems : maxVerticalItems} items only.`);
    }
  };

  const isSelected = (index) => selectedMenuItems.some((item) => item.title === menuItems[index].title);

  const displayedMenuItems = useMemo(() => {
    return selectedMenuItems.slice(0, isHorizontal ? maxHorizontalItems : maxVerticalItems);
  }, [selectedMenuItems, isHorizontal]);

  return (
    <div className="sidemenu-scrollable-container">
      <MyProfile value={isHorizontal ? 'username-display' : 'username-hide'} />
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={handleButtonClick}>
          <img
            style={{ height: '20px', margin: '10px 10px 15px auto', filter: 'brightness(0) invert(1)' }}
            src={expandicon}
            alt=""
          />
        </button>
      </div>
      <div className="sidemenu-profile-container">
        {displayedMenuItems.map((menuItem, index) => {
          const isSelected = selectedOptionIndex === index || (location.pathname === '/' && index === 0);
          return (
            <div
              key={menuItem.title}
              className={`sidemenu-menu-item ${
                isSelected ? 'sidemenu-menu-item-selected' : ''
              } ${isHorizontal ? 'sidemenu-menu-item-horizontal' : 'sidemenu-menu-item-vertical'}`}
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
              style={{ cursor: 'pointer' }}
            >
              <img
                src={menuItem.icon}
                alt={menuItem.title}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  borderRadius: '0',
                  margin: '0',
                }}
              />
              <Text variant="body2" className="sidemenu-typography">
                {menuItem.title}
              </Text>
            </div>
          );
        })}
        {menuItems.length > (isHorizontal ? maxHorizontalItems : maxVerticalItems) && (
          <div
            className={`sidemenu-menu-item ${
              isHorizontal ? 'sidemenu-menu-item-horizontal' : 'sidemenu-menu-item-vertical'
            }`}
            onClick={handleMoreClick}
          >
            <MoreHorizIcon sx={{ color: 'white', fontSize: 'x-large' }} />
            <Text variant="body2" className="sidemenu-typography">
              More
            </Text>
          </div>
        )}
      </div>
      <Dialog style={{ display: 'flex', marginLeft: '10%' }} open={open} onClose={handleClose}>
        <DialogTitle>Select Menu Items</DialogTitle>
        <DialogContent>
          <List>
            {menuItems.map((menuItem, index) => (
              <ListItem
                key={menuItem.title}
                button
                onClick={() => handleSelect(index)}
                style={{
                  backgroundColor: isSelected(index) ? 'black' : 'white',
                  color: isSelected(index) ? 'white' : 'black',
                  border: isSelected(index) ? '' : '1px solid black',
                  margin: '5px',
                  borderRadius: '100px',
                  padding: '5px 20px',
                  cursor:'pointer'
                }}
              >
                <ListItemText primary={menuItem.title} />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    checked={isSelected(index)}
                    onChange={() => handleSelect(index)}
                    style={{ color: isSelected(index) ? 'white' : 'black' }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SideMenu;
