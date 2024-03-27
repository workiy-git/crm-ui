import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid } from '@mui/material';

const Refresh = () => {
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    fetchMenuData(); // Fetch menu data initially
  }, []);

  const fetchMenuData = () => {
    axios.get('http://127.0.0.1:9000/api/menudata')
      .then((response) => {
        console.log('Data received:', response.data);
        setMenuData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleRefresh = () => {
    fetchMenuData(); // Fetch menu data again when refresh icon is clicked
  };

  return (
    <Container>
      <Grid container spacing={2}>
        {menuData.map((menuItem, index) => (
          <Grid item key={index}>
            {/* Assuming menuItem.menubar_images.add_icon.icon is the URL of the image */}
            <img
              src={menuItem.menubar_images.refresh_icon.icon}
              alt='icon'
              style={{ width: '30px', height: 'auto', cursor: 'pointer' }} // Adjust styling as needed
              onClick={handleRefresh} // Call handleRefresh function on click
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Refresh;
