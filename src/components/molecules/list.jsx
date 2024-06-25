import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import config from '../../config/config'; // Import the configuration file

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
  const [hamburgerData, setHamburgerData] = useState([]);
  const [openItemIndex, setOpenItemIndex] = useState(null); // Track index of the currently open submenu
  const menuRef = useRef(null);

  const handleCollapseClick = (index) => {
    setOpenItemIndex(openItemIndex === index ? null : index); // Toggle the open submenu index
  };

  const handleMenuItemClick = (menuItem, menuIndex, menuItemIndex) => {
    console.log('Clicked on:', menuItem.title, 'from menu', menuIndex, 'item index', menuItemIndex);
    // Perform actions based on the clicked menu item
    switch (menuItem.title) {
      case 'Chats':
        window.location.href = '/chats';
        break;
      case 'Enquiry':
        window.location.href = '/enquiry';
        break;
      // Add more cases for other menu items if needed
      default:
        // Default action
    }
  };

  useEffect(() => {
    axios.get(`${config.apiUrl}/menus/header`)
      .then((response) => {
        console.log('Data received:', response.data.data.hamburger);
        setHamburgerData(response.data.data.hamburger);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
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
        <div elevation={0} sx={{ maxWidth: 256, backgroundColor: 'transparent' }}>
          <FireNav component="nav" disablePadding className="FireNav" ref={menuRef}>
            {/* {Object.keys(hamburgerData).map((item, index) => ( */}
              <ListItemButton
                alignItems="flex-start"
                onClick={() => setOpen(!open)}
                sx={{
                  padding: 0,
                  '&:hover, &:focus': { '& svg': { opacity: open ? 1 : 0 }, background: 'none' },
                }}
              >
                <img
                  alt={hamburgerData.hamburger_image} // Provide meaningful alt text
                  src={hamburgerData.hamburger_image}
                  style={{ height: 20, padding: '30px 15px' }}
                />
              </ListItemButton>
            {/* ))} */}
            <Box>
              <Box
                sx={{
                  bgcolor: open ? 'white' : null,
                  borderRadius: '10px',
                  pb: open ? 2 : 0,
                  pt: open ? 2 : 0,
                  position: open ? 'absolute' : 'static',
                  boxShadow: '2px 2px 19px 0px black',
                  zIndex: '10',
                  marginLeft: '20px',
                }}
              >
                {open && (
                  <Box>
                    {Object.keys(hamburgerData)
                      .filter((key) => key !== 'hamburger_image')
                      .map((key, index) => {
                        const menuItem = hamburgerData[key];
                        return (
                          <ListItemButton
                            sx={{ py: 0, minHeight: 40, color: 'rgba(255,255,255,.8)' }}
                            key={index}
                            onClick={() => handleCollapseClick(index)}
                          >
                            <ul
                              style={{
                                listStyle: 'none',
                                color: 'black',
                                padding: '0px 10px',
                                margin: 0,
                                width: '100%',
                              }}
                            >
                              <li
                                style={{ display: 'flex', width: '100%' }}
                              >
                                <img
                                  alt={menuItem.title} // Provide meaningful alt text
                                  src={menuItem.icon}
                                  style={{ marginRight: '15px', width: '20px' }}
                                />
                                {menuItem.title}
                              </li>
                            </ul>
                          </ListItemButton>
                        );
                      })}
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  bgcolor: open ? 'white' : null,
                  borderRadius: '10px',
                  position: open ? 'absolute' : 'static',
                  boxShadow: '2px 2px 19px 0px black',
                  zIndex: '10',
                  marginLeft: open ? '12rem' : '10px',
                }}
              >
                {open && (
                  <Box>
                    {Object.keys(hamburgerData)
                      .filter((key) => key !== 'hamburger_image')
                      .map((key, index) => {
                        const menuItem = hamburgerData[key];
                        return (
                          <ListItemButton sx={{ py: 0, color: 'black' }} key={index}>
                            <Collapse in={openItemIndex === index} timeout="auto" unmountOnExit>
                              <ul
                                style={{
                                  listStyle: 'none',
                                  padding: '0px 10px',
                                  lineHeight: '2',
                                }}
                              >
                                {key &&
                                  Object.keys(menuItem)
                                    .filter((subKey) => subKey !== 'title' && subKey !== 'icon')
                                    .map((subKey, subIndex) => (
                                      <li
                                        onClick={() =>
                                          handleMenuItemClick(menuItem[subKey], 0, subIndex)
                                        }
                                        style={{
                                          cursor: 'pointer',
                                          display: 'flex',
                                          width: 'max-content',
                                          lineHeight: 2.5,
                                        }}
                                        key={subIndex}
                                      >
                                        <img
                                          alt={menuItem[subKey].title} // Provide meaningful alt text
                                          src={menuItem[subKey].icon}
                                          style={{
                                            margin: 'auto 15px auto 0',
                                            width: '20px',
                                          }}
                                        />
                                        {menuItem[subKey].title}
                                      </li>
                                    ))}
                              </ul>
                            </Collapse>
                          </ListItemButton>
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
