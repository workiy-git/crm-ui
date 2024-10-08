import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import config from '../../config/config'; // Import the configuration file
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import "../../assets/styles/header.css";
import { headers } from '../atoms/Authorization';

const FireNav = styled(List)({
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

export default function HamburgerMobile() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [hamburgerData, setHamburgerData] = useState([]);
  const [openItems, setOpenItems] = useState({}); // New state to track open submenus
  const menuRef = useRef(null);

  const handleMenuItemClick = (menuItem) => {
    // Handle navigation to different URLs
    const url = `${menuItem.path}`;
    window.location.href = url;
  };

  const toggleSubmenu = (index) => {
    // Toggle the open state for the clicked menu item
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [index]: !prevOpenItems[index], // Toggle the specific index
    }));
  };

  useEffect(() => {
    axios.get(`${config.apiUrl}/menus/header`, {headers})
      .then((response) => {
        setHamburgerData(response.data.data.hamburger);
      })
      .catch((error) => {
        // Handle error
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderNestedItems = (menuItem, parentIndex) => {
    return (
      <ul className="hamburger-list-container">
        {Object.keys(menuItem)
          .filter((subKey) => subKey !== 'title' && subKey !== 'icon')
          .map((subKey, subIndex) => (
            <li
              className={`hamburger-list-item ${menuItem[subKey].class}`}
              onClick={() => handleMenuItemClick(menuItem[subKey])}
              key={`${parentIndex}-${subIndex}`}
            >
              <img
                alt={menuItem[subKey].title} // Provide meaningful alt text
                src={menuItem[subKey].icon}
                className="hamburger-img"
              />
              {menuItem[subKey].title}
              {menuItem[subKey].children && (
                <Collapse in={openItems[`${parentIndex}-${subIndex}`]} timeout="auto" unmountOnExit>
                  {renderNestedItems(menuItem[subKey].children, `${parentIndex}-${subIndex}`)}
                </Collapse>
              )}
            </li>
          ))}
      </ul>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <ThemeProvider
        theme={createTheme({
          components: {
            MuiListItemButton: {
              defaultProps: {
                disableTouchRipple: true,
              },
            },
          },
          palette: {},
        })}
      >
        <div className="hamburger-menu-container hamburger-mobile" ref={menuRef}>
          <FireNav component="nav" disablePadding className="hamburger-nav">
            <ListItemButton
              alignItems="flex-start"
              onClick={() => setOpen(!open)}
              className={`hamburger-list-item-button ${isMdUp ? '' : 'hamburger-list-item-button-md'}`}
            >
              <img
                alt={hamburgerData.hamburger_image} // Provide meaningful alt text
                src={isMdUp ? hamburgerData.hamburger_image : hamburgerData.hamburger_md_image}
                className="hamburger-menu-img"
              />
            </ListItemButton>
            <Box>
              <Box
                className={`hamburger-nav ${open ? 'hamburger-nav-open' : 'hamburger-nav-close'}`}
              >
                {open && (
                  <Box sx={{ display: "block" }}>
                    {Object.keys(hamburgerData)
                      .filter((key) => key !== 'hamburger_image' && key !== 'hamburger_md_image')
                      .map((key, index) => {
                        const menuItem = hamburgerData[key];
                        return (
                          <div style={{margin:'5px 0'}} key={index}>
                            <ListItemButton
                              sx={{
                                padding: "0px 16px !important", 
                                minHeight: 40, 
                                color: 'rgba(255,255,255,.8)', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                width: '100%'
                              }}
                              onClick={() => toggleSubmenu(index)} // Toggle the submenu
                            >
                              <ul className="hamburger-nested-item">
                                <li className="hamburger-nested-list-item">
                                  <img
                                    alt={menuItem.title} // Provide meaningful alt text
                                    src={menuItem.icon}
                                    className="hamburger-nested-list-img"
                                  />
                                  {menuItem.title}
                                </li>
                              </ul>
                            </ListItemButton>
                            <Collapse in={openItems[index]} timeout="auto" unmountOnExit>
                              {renderNestedItems(menuItem, index)}
                            </Collapse>
                          </div>
                        );
                      })}
                  </Box>
                )}
              </Box>
            </Box>
          </FireNav>
        </div>
      </ThemeProvider>
    </Box>
  );
}
