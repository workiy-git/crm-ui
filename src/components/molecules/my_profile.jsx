import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import config from '../../config/config'; // Import the configuration file

const theme = createTheme({
  components: {
    MuiListItemButton: {
      defaultProps: {
        disableTouchRipple: true,
      },
    },
  },
  palette: {},
});

export default function Myprofile({ backgroundColor }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [myprofileData, setMyprofileData] = useState({});

  useEffect(() => {
    axios.get(`${config.apiUrl}/menus/header`)
      .then((response) => {
        console.log('myprofile Data received:', response.data);
        setMyprofileData(response.data.data.myprofile);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (open && menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.body.addEventListener('click', handleClickOutside);
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, [open]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const buttonFunctions = [
    () => {
      console.log('Function for the first button');
      window.location.href = 'https://example.com/first';
    },
    () => {
      console.log('Function for the second button');
      window.location.href = 'https://example.com/second';
    },
    // Add more functions for each ListItemButton as needed
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <ThemeProvider theme={theme}>
        <div elevation={0} sx={{ maxWidth: 256, backgroundColor: 'transparent' }}>
          <List component="nav" disablePadding ref={menuRef}>
            <ListItemButton
              alignItems="flex-start"
              onClick={handleToggle}
              sx={{
                '&:hover, &:focus': { '& svg': { opacity: open ? 1 : 0 }, background: 'none' },
              }}
              style={{ padding: '15px' }}
            >
              <Avatar
                alt="Profile"
                src={myprofileData.profile_image}
                sx={{ width: 40, height: 40, outline: 'white 2px solid' }}
              />
            </ListItemButton>
            {open && (
              <Box
                sx={{
                  bgcolor: 'white',
                  borderRadius: '10px',
                  pb: 2,
                  pt: 2,
                  position: 'absolute',
                  boxShadow: '2px 2px 19px 0px black',
                  zIndex: 10,
                  marginLeft: '20px',
                  width: 'max-content',
                }}
              >
                <Box style={{ display: 'grid', padding: '15px' }}>
                  {Object.keys(myprofileData)
                    .filter(key => key !== 'profile_image')
                    .map((key, index) => (
                      <ListItemButton
                        key={index}
                        sx={{ py: 0, minHeight: 32, color: 'rgba(255,255,255,.8)' }}
                        onClick={buttonFunctions[index]} // Set appropriate click handlers
                        style={index === 0 ? { borderBottom: '1px dashed black', paddingBottom: '10px' } : {}}
                      >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 'fit-content', marginRight: '15px' }} style={index === 0 ? { height: '40px', padding: '0px' } : {}}>
                          <img src={myprofileData[key].icon} alt="" />
                        </ListItemIcon>
                        <ListItemText
                          primary={myprofileData[key].title}
                          primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium', color: 'black' }}
                        />
                      </ListItemButton>
                    ))}
                </Box>
              </Box>
            )}
          </List>
        </div>
      </ThemeProvider>
    </Box>
  );
}
