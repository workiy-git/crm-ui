import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const SuccessAlert = ({ message }) => {
  return (
    <Alert severity="success">
      <AlertTitle>Success</AlertTitle>
      {message}
    </Alert>
  );
};

export default SuccessAlert;
