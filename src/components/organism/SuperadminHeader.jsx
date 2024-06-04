import React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Myprofile from '../molecules/my_profile';
import Companylogo from '../atoms/company_logo';

function Header() {
  return (
    <Box sx={{ flexGrow: 1, padding: '5px 20px 5px 20px' }}>
      <div style={{ background: "#FFFFFF", color: 'black', boxShadow: 'none', borderRadius: '10px' }}>
        <Toolbar sx={{ flexGrow: 1, height: '10vh' }}>
          <Box>
            <Myprofile />
          </Box>
          <Box sx={{marginLeft: 'auto'}}>
          <Companylogo />
          </Box>
        </Toolbar>
      </div>
    </Box>
  );
}

export default Header;
