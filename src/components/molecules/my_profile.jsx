import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import {  ThemeProvider, createTheme } from '@mui/material/styles';
// import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import config from '../../config/config'; // Import the configuration file

// const FireNav = styled(List)({
//   '& .MuiListItemIcon-root': {
//     minWidth: 0,
//     marginRight: 16,
//   },
//   '& .MuiSvgIcon-root': {
//     fontSize: 20,
//   },
// });

export default function Myprofile({ backgroundColor }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [myprofileData, setMyprofileData] = useState([]);


  useEffect(() => {
    axios.get(`${config.apiUrl}/menudata`)
      .then((response) => {
        console.log('Data received:', response.data);
        setMyprofileData(response.data);
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
    <Box sx={{ display: 'flex', justifyContent:'center'}}>
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
          <div component="nav" disablePadding className="FireNav" ref={menuRef}>
            {myprofileData.map((item, index) => (
              <ListItemButton
                alignItems="flex-start"
                onClick={handleToggle}
                sx={{
                  '&:hover, &:focus': { '& svg': { opacity: open ? 1 : 0 },background:'none' },
                }}
                style={{padding:'15px'}}
                key={index}
              >
                <div style={{borderRadius:'100px', }}>
                <Avatar
                  alt="Build"
                  src={item.menu.header.myprofile.profile_image}
                  sx={{ width: 40, height: 40, outline: 'white 2px solid', }}
                /></div>
              </ListItemButton>
            ))}
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
                  marginLeft:'20px',
                }}
              >
                {open && myprofileData[0].menu.header.myprofile && (
                  <Box style={{display:'grid'}}>
                    {Object.keys(myprofileData[0].menu.header.myprofile)
                      .filter(key => key !== 'profile_image')
                      .map((key, index) => (
                        <ListItemButton
                          key={index}
                          sx={{ py: 0, minHeight: 32, color: 'rgba(255,255,255,.8)' }}
                          onClick={buttonFunctions[index]} // Set appropriate click handlers
                          style={index === 0 ? { borderBottom:'1px dashed black', paddingBottom:'10px'} : {}}
                        >
                          <ListItemIcon sx={{ color: 'inherit', minWidth:'fit-content', marginRight:'15px' }}  style={index === 0 ? { height:'40px', padding:'0px'} : {}}>
                            <img src={myprofileData[0].menu.header.myprofile[key].icon} alt="" />
                          </ListItemIcon>
                          <ListItemText
                            primary={myprofileData[0].menu.header.myprofile[key].title}
                            primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium', color: 'black' }}
                          />
                        </ListItemButton>
                      ))}
                  </Box>
                )}
              </Box>
            </Box>
          </div>
        </div>
      </ThemeProvider>
    </Box>
  );
}