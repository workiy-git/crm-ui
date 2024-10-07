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
import { headers } from '../atoms/Authorization'

const FireNav = styled(List)({
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

export default function Hamburger() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [hamburgerData, setHamburgerData] = useState([]);
  const menuRef = useRef(null);

  const handleMenuItemClick = (menuItem) => {
    // console.log('Clicked on:', menuItem.path);
    const url = `${menuItem.path}`;
    window.location.href = url;
  };

  useEffect(() => {
    axios.get(`${config.apiUrl}/menus/header`, {headers})
      .then((response) => {
        // console.log('Data received:', response.data.data.hamburger);
        setHamburgerData(response.data.data.hamburger);
      })
      .catch((error) => {
        // console.error('Error fetching data:', error);
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
  const renderNestedItems = (menuItem) => {
    return (
      <ul className="hamburger-list-container">
        {Object.keys(menuItem)
          .filter((subKey) => subKey !== 'title' && subKey !== 'icon')
          .map((subKey, subIndex) => (
            <li
              className={`hamburger-list-item ${menuItem[subKey].class}`}
              onClick={() => handleMenuItemClick(menuItem[subKey])}
              key={subIndex}
            >
              <img
                alt={menuItem[subKey].title} // Provide meaningful alt text
                src={menuItem[subKey].icon}
                className="hamburger-img"
              />
              {menuItem[subKey].title}
              {menuItem[subKey].children && (
                <Collapse in={true} timeout="auto" unmountOnExit>
                  {renderNestedItems(menuItem[subKey].children)}
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
        <div className="hamburger-menu-container hamburger-desktop" ref={menuRef}>
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
                  <Box sx={{ display: "flex" }}>
                    {Object.keys(hamburgerData)
                      .filter((key) => key !== 'hamburger_image' && key !== 'hamburger_md_image')
                      .map((key, index) => {
                        const menuItem = hamburgerData[key];
                        return (
                          <div key={index}>
                            <ListItemButton
                              sx={{ padding: "0px 16px !important", minHeight: 40, color: 'rgba(255,255,255,.8)', display: 'flex', flexDirection: 'column', width: '100%' }}
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
                            <Collapse in={open} timeout="auto" unmountOnExit>
                              {renderNestedItems(menuItem)}
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
