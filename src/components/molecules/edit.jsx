import React from 'react';
import { Box, Button, Modal, Typography, TextField } from '@mui/material';

const EditModal = ({ open, onClose, row, handleSave, handleChange }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        columnCount:'2'
      }}>
        <Typography variant="h6" component="h2">
          Edit Record
        </Typography>
        {row && Object.keys(row).map((key) => (
          key !== '_id' && (
            <TextField
              key={key}
              margin="normal"
              fullWidth
              label={key.replace(/_/g, ' ')}
              name={key}
              value={row[key]}
              onChange={handleChange}
            />
          )
        ))}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditModal;
