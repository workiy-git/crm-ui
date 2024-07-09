import React, { useEffect, useState } from 'react';
import Header from '../organism/header';
import SideMenu from "../organism/sidemenu";
import CallsGrid from '../molecules/call_app_bar';
import { Typography } from '@mui/material';



function Leads() {
  const [backgroundColor] = useState(() => {
    // Check if there's a color stored in local storage, otherwise use default
    return localStorage.getItem('backgroundColor') || '#d9d9d9';
  });

  useEffect(() => {
    document.title = 'Calls';

    return () => {
      document.title = 'Default Title';
    };
  }, []);



  return (
    <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden', backgroundColor:"gray" }}>
     
      <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden' }}>
      <div style={{ width: '10vh', overflow: 'hidden', backgroundColor: "#0d2d4e" }}>
          <SideMenu backgroundColor={backgroundColor} />
        </div>
        <div style={{ width: '100%', marginRight: "-10px", backgroundColor: backgroundColor, overflow: 'hidden' }}>
          <div>
            <Header backgroundColor={backgroundColor} />
          </div>
          <Typography style={{ height:'10rem', color:'white', padding:'10px', fontSize:'30px',backgroundColor:{backgroundColor}  }}>
          leads
        </Typography>
       <CallsGrid />
          
        </div>
      </div>
    </div>
  );
}

export default Leads;