import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Box } from '@mui/material';
import Header from '../organism/header';
import SideMenu from '../organism/sidemenu';
import Grid from '../molecules/grid';
import ActionBar from '../organism/action_bar';

function Calls() {
  const endpoint= '/appdata'
  const [backgroundColor] = useState(() => localStorage.getItem('backgroundColor') || '#d9d9d9');

  useEffect(() => {
    document.title = 'Home';
    return () => {
      document.title = 'Default Title';
    };
  }, []);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#c1c1c1' }}>
      <Box style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden', padding:'20px 0 10px 50px'  }}>
        <Box style={{ overflow: 'hidden', backgroundColor: "#0d2d4e", padding:'10px', borderRadius:'10px'}}>
          <SideMenu backgroundColor={backgroundColor} />
        </Box>
        <Box sx={{ width: '100%', backgroundColor: backgroundColor, overflow: 'hidden' }}>
          
          <Header backgroundColor={backgroundColor} />
    
       
         <ActionBar/>
         <Grid endpoint={endpoint} />
     
          </Box>
        
      </Box>

          </Box>
  );
}

export default Calls;
Actions
