import React from "react";
import { Box, Typography } from '@mui/material';
import Header from "../organism/header";
import SideMenu from "../organism/sidemenu";
import Footer from "../atoms/Footer";
import EditPage from "./edit";

const DetailsPage = ({ endpoint }) => {



  return (
    <div>
    <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden', backgroundColor: "gray", paddingLeft: 0 }}>
      <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden' }}>
        <div style={{ width: '10vh', backgroundColor: "#0d2d4e" }}>
          <SideMenu />
        </div>
        <div style={{ width: '100%', marginRight: "-10px", overflow: 'hidden' }}>
          <div>
            <Header />
          </div>
          <div>
          <Box>
      <Typography variant="h4" gutterBottom style={{background: 'linear-gradient(90deg, rgba(12,45,78,1) 0%, rgba(28,104,180,1) 100%)', color:'white', padding:"20px", margin:'0'}}>
        Calls Details View
      </Typography>
      
    </Box>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    
    </div>
  );
};

export default DetailsPage;
