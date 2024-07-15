import React, {useState } from 'react';
import { Box, Typography } from '@mui/material';
import Header from '../organism/header';
import SideMenu from "../organism/sidemenu"
import Popup from '../atoms/smspopup';
import Pushapp from '../atoms/push-app';
import Appbar from '../molecules/details-app-bar';
import DetailsView from '../organism/details-view';
import Tab from '../organism/details-tab';
import Refresh from '../atoms/refresh';
import Footer from '../atoms/Footer';



const DetailsPage = ({ endpoint }) => {



  return (
    <div>
    <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden', backgroundColor: "gray", paddingLeft: 0 }}>
      <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden' }}>
        <div style={{ backgroundColor: "#121A2C" }}>
          <SideMenu />
        </div>
        <div style={{ width: '100%', marginRight: "-10px", overflow: 'hidden' }}>
          <div>
            <Header />
          </div>
          <div>
          <Box>
      <Typography variant="h5" gutterBottom style={{background: 'linear-gradient(90deg, rgba(12,45,78,1) 0%, rgba(28,104,180,1) 100%)', color:'white', padding:"25px", margin:'0'}}>
        Calls Details View
      </Typography>
    </Box>
    <Box>
    <Appbar/>
    </Box>
          </div>
        <div style={{display:'flex',justifyContent:"space-around",  width: '100%', overflow: 'hidden' , marginTop:'40px'}}>
          < DetailsView />
          <Tab/>
        </div>
      </div>
        </div>
      </div>
      <Footer/>
    </div>
  
  );
};

export default DetailsPage;