import React, { useState } from 'react'; // Add useState to the import statement
import { Button, Alert, Stack } from '@mui/material';
import axios from 'axios';
import config from '../../config/config';

const DeleteComponent = ({ id, onDeleteSuccess }) => {
  const [error, setError] = useState(''); // Now useState is defined

  const handleDelete = async () => {
    try {
      const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;
      await axios.delete(apiUrl);
      onDeleteSuccess();
    } catch (error) {
      setError('Error deleting data');
    }
  };

  return (
    <>
      {error && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Stack>
      )}
      <Button variant="contained" color="error" onClick={handleDelete}>
        Delete
      </Button>
    </>
  );
};

export default DeleteComponent;
