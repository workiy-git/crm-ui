import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid } from '@mui/material';

const SlideButton = () => {
  const [menuData, setMenuData] = useState([]);

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

  const handleLeftButtonClick = () => {
    // Add functionality for left button click here
    console.log('Left button clicked');
  };

  const handleRightButtonClick = () => {
    // Add functionality for right button click here
    console.log('Right button clicked');
  };

  return (
    <Container>
      <Grid container spacing={2}>
        {menuData.map((menuItem, index) => (
          <Grid item key={index}>
            <button onClick={handleLeftButtonClick} style={{ marginRight: '-10px', border: 'none', background: 'none' }}>
              <img
                src={menuItem.menubar_images.left_arrow_icon.icon}
                alt='left-arrow-icon'
                style={{ width: '30px', height: 'auto', cursor: 'pointer' }}
              />
            </button>
            <button onClick={handleRightButtonClick} style={{ border: 'none', background: 'none' }}>
              <img
                src={menuItem.menubar_images.right_arrow_icon.icon}
                alt='right-arrow-icon'
                style={{ width: '30px', height: 'auto', cursor: 'pointer' }}
              />
            </button>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SlideButton;
