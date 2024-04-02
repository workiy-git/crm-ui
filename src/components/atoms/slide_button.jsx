import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid } from '@mui/material';
import config from '../../config/config';

const SlideButton = ({ onScrollLeft, onScrollRight }) => {
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    axios.get(`${config.apiUrl}/menudata`)
      .then((response) => {
        console.log('Data received:', response.data);
        setMenuData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Container>
      <Grid container spacing={2}>
        {/* Rendering menu items */}
        {menuData.map((item, index) => (
          <Grid item key={index}>
            <Grid container spacing={2}>
              <Grid item>
                <button onClick={onScrollLeft} style={{ marginRight: '-10px', border: 'none', background: 'none' }}>
                  <img src={item.menu.menu_bar.menu_images.left_arrow_icon.icon} alt="Left Arrow" style={{ width: '40px', height: '40px' }} />
                </button>
                <button onClick={onScrollRight} style={{ border: 'none', background: 'none' }}>
                  <img src={item.menu.menu_bar.menu_images.right_arrow_icon.icon} alt="Right Arrow" style={{ width: '40px', height: '40px' }} />
                </button>
              </Grid>
              {/* Render other menu data here */}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SlideButton;
