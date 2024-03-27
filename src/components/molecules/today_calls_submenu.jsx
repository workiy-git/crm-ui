import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Refresh from '../atoms/refresh';
import FullScreen from '../atoms/full_screen';


function TodayCallsSubmenu({ themecolor }) {
  // const { theme } = useContext(ThemeSwitcher);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ color: 'black', background: themecolor, boxShadow:'none' }}>
        <Toolbar sx={{ flexGrow: 1 }}>
         <Refresh/>
         <FullScreen/>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default TodayCallsSubmenu;
