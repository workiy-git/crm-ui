import React, { useState } from 'react';
import { Typography } from '@mui/material';

const SelectedTextDisplay = () => {
  const [selectedTexts, setSelectedTexts] = useState([]);

  const handleSelectText = (text) => {
    setSelectedTexts([...selectedTexts, text]);
  };

  return (
    <div style={{ whiteSpace: 'nowrap', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {selectedTexts.map((text, index) => (
        <Typography
          key={index}
          variant="body1"
          style={{
            backgroundColor: 'rgba(128, 128, 128, 0.5)',
            padding: '12px',
            margin: '4px', 
            display: 'inline-block',
            borderRadius: '5px',
          }}
        >
          {text}
        </Typography>
      ))}
    </div>
  );
};

export default SelectedTextDisplay;
