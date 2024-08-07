import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const DeleteAlert = ({ message }) => {
  return (
    <Alert severity="warning">
      <AlertTitle>Warning</AlertTitle>
      {message}
    </Alert>
  );
};

export default DeleteAlert;
