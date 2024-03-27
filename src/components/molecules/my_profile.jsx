import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

const FireNav = styled(List)({
  // '& .MuiListItemButton-root': {
  //   paddingLeft: 20,
  //   paddingRight: 20,
  // },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

export default function Myprofile() {
  const [open, setOpen] = React.useState(false);
  const [myprofileData, setMyprofileData] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:9000/api/headerdata')
      .then((response) => {
        console.log('Data received:', response.data);
        setMyprofileData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest('.FireNav')) {
        setOpen(false);
      }
    };
  
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
    () => {
      console.log('Function for the second button');
      window.location.href = 'https://example.com/third';
    },
    () => {
      console.log('Function for the second button');
      window.location.href = 'https://example.com/third';
    },
    // Add more functions for each ListItemButton as needed
  ];

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
        <Paper elevation={0} sx={{ maxWidth: 256, backgroundColor:'transparent' }}>
          <FireNav component="nav" disablePadding className="FireNav">
            {myprofileData && myprofileData[0] && myprofileData[0].myprofile && myprofileData[0].myprofile.length > 0 && (
              <ListItemButton
                alignItems="flex-start"
                onClick={handleToggle}
                sx={{
                  px: 3,
                  pt: 2.5,
                  pb: 2.5,
                  '&:hover, &:focus': { '& svg': { opacity: open ? 1 : 0 } },
                }}
              >
                <Avatar
                  alt="Build"
                  src={myprofileData[0].myprofile[0].myprofile_icon}
                  sx={{ width: 50, height: 50 }}
                />
              </ListItemButton>
            )}
            <Box>
              <Box
                sx={{
                  bgcolor: open ? 'white' : null,
                  borderRadius: '10px',
                  pb: open ? 2 : 0,
                  pt: open ? 2 : 0,
                  position: open ? 'absolute' : 'static',
                  boxShadow: '2px 2px 19px 0px black',
                  zIndex: '10'
                }}
              >
                {open &&
                  myprofileData[0].myprofile.slice(1).map((profile, index) => (
                    <ListItemButton
                      key={index}
                      sx={{ py: 0, minHeight: 32, color: 'rgba(255,255,255,.8)' }}
                      onClick={buttonFunctions[index]} // Directly call the function from the array
                    >
                      <ListItemIcon sx={{ color: 'inherit', paddingLeft:'20px' }}>
                        <img src={profile.icon} alt="" />
                      </ListItemIcon>
                      <ListItemText
                        primary={profile.label}
                        primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium', color: 'black' }}
                      />
                    </ListItemButton>
                  ))}
              </Box>
            </Box>
          </FireNav>
        </Paper>
      </ThemeProvider>
    </Box>
  );
}