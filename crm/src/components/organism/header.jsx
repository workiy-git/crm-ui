import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Myprofile from '../molecules/my_profile';
import Listcomponent from '../molecules/list';
import FullScreen from '../atoms/full_screen';
import Companylogo from '../atoms/company_logo';
import Search from '../atoms/search';

function Header() {
  return (
  <Box sx={{ flexGrow: 1 }}>
  <AppBar position="static"  sx={{ bgcolor: "white", color: 'black', boxShadow:'none' }}>
    <Toolbar sx={{ flexGrow: 1 }}>
    <Myprofile/>
    <Listcomponent />
    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
    <FullScreen />
    </Box>
    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
   <Search/>
    </Box>

    <Box sx={{ flexGrow: 1 }} />
    <Box sx={{ display: { md: 'flex'} }}>
      <Companylogo/>
    </Box>
    </Toolbar>
  </AppBar>
  </Box>
  );
}

export default Header;