import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import config from '../../config/config';

const Edit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData, schema, pageName } = location.state;
  const [formData, setFormData] = useState(rowData);
  const [errors, setErrors] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${formData._id}`;
    console.log('API URL:', apiUrl);
    console.log('Form Data:', formData);

    try {
      const response = await axios.put(apiUrl, { appdata: formData });
      console.log('Response:', response);

      if (response.status === 200) {
        navigate('/', { state: { pageName } });
      } else {
        setErrors('Error updating data: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating data:', error);
      setErrors('Error updating data');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: '20px', maxWidth: '500px', margin: '50px auto', backgroundColor: 'white' }}>
      {errors && <Typography color="error">{errors}</Typography>}
      {schema.map((field) => (
        <TextField
          key={field.fieldName}
          name={field.fieldName}
          label={field.label}
          value={formData[field.fieldName] || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      ))}
      <Button type="submit" variant="contained" color="primary">
        Save
      </Button>
    </Box>
  );
};

export default Edit;
