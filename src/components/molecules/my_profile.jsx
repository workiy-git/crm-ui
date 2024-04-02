// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Button } from '@mui/material';
// import config from '../../config/config'; // Import the configuration file

// const Myprofile = () => {
//   const [logoData, setLogoData] = useState([]);

//   useEffect(() => {
//     document.title = 'CRM';

//     axios.get(`${config.apiUrl}/menudata`) // Use apiUrl from the configuration file
//       .then((response) => {
//         console.log('Data received:', response.data);
//         setLogoData(response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//       });
//   }, []);

//   return (
//     <div className='header_button'>
//       {logoData.map((item, index) => (
//         <div key={index}>
//           <Button>
//             <img className="full_screen_img" alt="" src={item.menu.header.myprofile.profile_image} />
//           </Button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Myprofile;


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

export default function Myprofile() {
  const [open, setOpen] = React.useState(false);
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
        <Paper elevation={0} sx={{ maxWidth: 256, backgroundColor: 'transparent' }}>
          <FireNav component="nav" disablePadding className="FireNav">
            {myprofileData.map((item, index) => (
              <ListItemButton
                alignItems="flex-start"
                onClick={handleToggle}
                sx={{
                  px: 3,
                  pt: 2.5,
                  pb: 2.5,
                  '&:hover, &:focus': { '& svg': { opacity: open ? 1 : 0 } },
                }}
                key={index}
              >
                <Avatar
                  alt="Build"
                  src={item.menu.header.myprofile.profile_image}
                  sx={{ width: 50, height: 50 }}
                />
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
                  marginLeft:'20px'
                }}
              >
                {open && myprofileData[0].menu.header.myprofile && (
                  <Box>
                    {/* Render the user name and icon */}
                    {/* <ListItemButton
                      sx={{ py: 0, minHeight: 32, color: 'rgba(255,255,255,.8)' }}
                      onClick={buttonFunctions[0]} // You can set the click handler for the user name here
                    >
                      <ListItemIcon sx={{ color: 'inherit', paddingLeft: '20px' }}>
                        <img src={myprofileData[0].menu.header.myprofile.user_neme.user_icon} alt="" />
                      </ListItemIcon>
                      <ListItemText
                        primary={myprofileData[0].menu.header.myprofile.user_neme.title}
                        primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium', color: 'black' }}
                      />
                    </ListItemButton> */}

                    {/* Render the remaining items */}
                    {Object.keys(myprofileData[0].menu.header.myprofile)
                      .filter(key => key !== 'profile_image')
                      .map((key, index) => (
                        <ListItemButton
                          key={index}
                          sx={{ py: 0, minHeight: 32, color: 'rgba(255,255,255,.8)' }}
                          onClick={buttonFunctions[index]} // Set appropriate click handlers
                          style={index === 0 ? { borderBottom:'1px dashed black', paddingBottom:'10px'} : {}}
                        >
                          <ListItemIcon sx={{ color: 'inherit', paddingLeft: '20px' }}  style={index === 0 ? { height:'40px', padding:'0px'} : {}}>
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
          </FireNav>
        </Paper>
      </ThemeProvider>
    </Box>
  );
}