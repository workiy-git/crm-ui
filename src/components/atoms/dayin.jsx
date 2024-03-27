import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Dialog, DialogContent, Button, Typography } from '@mui/material';

const Dayin = () => {
  const [menuData, setMenuData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:9000/api/menudata')
      .then((response) => {
        console.log('Data received:', response.data);
        setMenuData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
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
          {menuData.map((menuItem, index) => (
            <Grid item key={index}>
              <h5 style={{ backgroundColor: 'green', padding: '3px', borderRadius: "5px", width: "70px", textAlign: "center", }}>{menuItem.menu_text}</h5>
            </Grid>
          ))}
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