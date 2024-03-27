import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Typography } from '@mui/material'; // Importing Material-UI components

const Navigation = () => {
  const [navigationData, setNavigationData] = useState([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:9000/api/navigationdata')
      .then((response) => {
        console.log('Data received:', response.data);
        setNavigationData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleIconClick = (index) => {
    setSelectedOptionIndex(index);
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div style={{ width: 'fit-content', textAlign: 'center', margin:'auto' }}>
      {navigationData.map((navigationItem, index) => (
        <div key={index} style={{ display: 'block', textAlign: 'center', gap: '50px', marginTop:'70px'}}>
          <Avatar
            key={index}
            src={index === selectedOptionIndex ? navigationItem.selectedIconUrl : navigationItem.iconUrl}
            alt='icon'
            onClick={() => handleIconClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            sx={{
              width: 30,
              height: 30,
              cursor: 'pointer',
              borderRadius: '0',
              margin:'10px',
              filter: (hoveredIndex === index || selectedOptionIndex === index) ? 'brightness(80%)' : 'none'
            }}
          />
          {(selectedOptionIndex === index) && (
            <Typography variant="body2" sx={{color:'#00AEF8'}}>
              {navigationItem.title}
            </Typography>
          )}
          {(hoveredIndex === index && selectedOptionIndex !== index) && (
            <Typography variant="body2" sx={{color:'#000000'}}>
              {navigationItem.title}
            </Typography>
          )}
        </div>
      ))}
    </div>
  );
};

export default Navigation;