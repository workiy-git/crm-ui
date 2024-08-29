import React from 'react';
import { Box, Typography } from '@mui/material';

const ViewComponent = ({ formData, pageSchema }) => {
  // Debugging log for formData
  console.log('View Component Form Data:', formData);

  // Function to format field data
  const formatFieldData = (fieldName, value) => {
    if (typeof value === 'object' && value !== null) {
      // Handle object fields like "address" by joining their properties
      return Object.values(value).join(', ');
    }
    return value || 'N/A';
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: '#fff', }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {pageSchema.map((field) => (
          <Box
            key={field.fieldName}
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '50%',
              borderBottom: '1px solid #e0e0e0',
              paddingBottom: 1,
              paddingTop: 1,
              paddingLeft: 2,
              paddingRight: 2,
              boxSizing: 'border-box',
            }}
          >
            <Typography
              sx={{
                width: '40%',
                textAlign: 'left',
                fontWeight: 'bold',
                color: '#333',
                fontSize: '12px',
              }}
            >
              {field.label || field.fieldName}
            </Typography>
            <Typography
              sx={{
                width: '60%',
                textAlign: 'left',
                color: '#666',
                fontSize: '12px',
              }}
            >
              {formatFieldData(field.fieldName, formData[field.fieldName])}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ViewComponent;
