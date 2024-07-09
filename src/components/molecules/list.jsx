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
    console.log('Clicked on:', menuItem.title);
    const url = `/${menuItem.title.toLowerCase().replace(/\s+/g, '')}`;
    window.location.href = url;
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

  const renderNestedItems = (menuItem) => {
    return (
      <ul
        style={{
          listStyle: 'none',
          padding: '0px 10px',
          margin: '5px 0',
          width: '100%',
          lineHeight: '2',
        }}
      >
        {Object.keys(menuItem)
          .filter((subKey) => subKey !== 'title' && subKey !== 'icon')
          .map((subKey, subIndex) => (
            <li
            className='hamburger_list'
              onClick={() =>
                handleMenuItemClick(menuItem[subKey])
              }
              style={{
                cursor: 'pointer',
                display: 'flex',
                width: 'max-content',
                lineHeight: 2.5,
                padding:'0 15px',
                margin:'0 10px'
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
        <div elevation={0} sx={{ maxWidth: 256, backgroundColor: 'transparent' }}>
          <FireNav component="nav" disablePadding className="FireNav" ref={menuRef}>
            <ListItemButton
              alignItems="flex-start"
              onClick={() => setOpen(!open)}
              sx={{
                padding: 0,
                margin: '15px',
                '&:hover, &:focus': { '& svg': { opacity: open ? 1 : 0 }, background: 'none' },
                height: { xs: '30px', md: '20px' }
              }}
            >
              <img
                alt={hamburgerData.hamburger_image} // Provide meaningful alt text
                src={isMdUp ? hamburgerData.hamburger_image : hamburgerData.hamburger_md_image}
                style={{ height: "100%", padding: '', }}
              />
            </ListItemButton>
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
                  <Box sx={{ display: "flex" }}>
                    {Object.keys(hamburgerData)
                      .filter((key) => key !== 'hamburger_image')
                      .filter((key) => key !== 'hamburger_md_image')
                      .map((key, index) => {
                        const menuItem = hamburgerData[key];
                        return (
                          <div key={index}>
                            <ListItemButton
                              sx={{ padding: "0px 16px !important", minHeight: 40, color: 'rgba(255,255,255,.8)', display: 'flex', flexDirection: 'column', width:'100%' }}
                            >
                              <ul
                                style={{
                                  listStyle: 'none',
                                  color: 'black',
                                  padding: '0px 10px',
                                  margin: 0,
                                  width: '100%',
                                  display: 'flex',
                                  
                                  
                                }}
                              >
                                <li
                                  style={{ display: 'flex', width: '100%', background:'#0c2d4e', color:'white', padding:'15px', borderRadius:'10px' }}
                                >
                                  <img
                                    alt={menuItem.title} // Provide meaningful alt text
                                    src={menuItem.icon}
                                    style={{ marginRight: '15px', width: '20px', 
                                      filter: 'brightness(0) invert(1)' }}
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
