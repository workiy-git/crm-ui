import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Dialog, DialogContent, Button, Typography } from '@mui/material';
import config from '../../config/config'; // Import the configuration file
import '../../assets/styles/header.css';

const Dayin = () => {
  const [menuData, setMenuData] = useState(null); // Initialize as null to handle loading state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    axios.get(`${config.apiUrl}/menus/menu_bar`) // Use apiUrl from the configuration file
      .then((response) => {
        // console.log('dayData received:', response.data.data.menu_text);
        setMenuData(response.data.data.menu_text);
      })
      .catch((error) => {
        // console.error('Error fetching data:', error);
      });
  }, []);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleYesClick = () => {
    // Handle Yes click action here
    // For now, just close the dialog
    setIsDialogOpen(false);
  };

  const handleNoClick = () => {
    // Handle No click action here
    // For now, just close the dialog
    setIsDialogOpen(false);
  };

  return (
    <Container>
      <div style={{ cursor: 'pointer' }} onClick={handleOpenDialog}>
        <Grid container spacing={2}>
          <Grid item>
            {menuData?.title && ( // Use optional chaining to safely access menuData.title
            <div className='dayin-main'>
              <div>
              <img src={menuData.icon} alt={menuData.title} style={{ height: 20, margin:0 }} />
              <h5
                style={{
                  color:'black',
                  borderRadius: "15px",
                  width: "50px",
                  fontSize: '12px',
                  margin:'0',
                  textAlign: "center",
                }}
              >
                {menuData.title}
              </h5>
              </div>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        <DialogContent style={{ textAlign: 'center' }}>
          <Typography variant="body1" style={{ fontWeight: 'normal', fontSize: '1.2rem' }}>
            Are you sure you want to Day in for today?
          </Typography>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleYesClick} style={{ backgroundColor: 'black' }}>Yes</Button>
            <Button variant="contained" color="secondary" onClick={handleNoClick} style={{ backgroundColor: 'red', marginLeft: '10px' }}>No</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Dayin;
