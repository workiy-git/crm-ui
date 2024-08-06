import React from 'react';
import { Box, Typography } from '@mui/material';

const ViewComponent = ({ formData, pageSchema }) => (
  <Box sx={{ padding: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: 1 }}>
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {pageSchema.map((field, index) => (
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
            {formData[field.fieldName] || 'N/A'}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

export default ViewComponent;
