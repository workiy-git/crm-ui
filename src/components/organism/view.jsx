import React from 'react';
import { Box, Typography } from '@mui/material';

const ViewComponent = ({ formData, pageSchema }) => {
  // Function to format field data
  const formatFieldData = (fieldName, value) => {
    if (fieldName === 'created_time' && value) {
      // Convert UTC value to Date object
      const utcDate = new Date(value);

      // Get the local time zone offset in minutes
      const timezoneOffset = utcDate.getTimezoneOffset(); 

      // Adjust the UTC time based on the local timezone offset
      const localTime = new Date(utcDate.getTime() - timezoneOffset * 60000); // Adjust in milliseconds

      // Format the local time to a human-readable format (e.g., using `toLocaleString`)
      const formattedLocalTime = localTime.toLocaleString(); // This will give you a localized date string

      return formattedLocalTime;
    }

    // Handle other fields, such as object fields (if needed)
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).join(', '); // Join object values
    }

    return value || 'N/A'; // Return 'N/A' if value is null or undefined
  };
console.log("formData", formData)
  return (
    <Box sx={{ padding: 2, backgroundColor: '#fff' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {pageSchema.map((field) => (
          <Box
            className="details_page_inputs"
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
