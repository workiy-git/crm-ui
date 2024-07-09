import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import config from '../../config/config';

const Edit = () => {
  const { caller_number } = useParams();
  const { state } = useLocation();
  const [formData, setFormData] = useState(state?.rowData || {});
  const [schema, setSchema] = useState(state?.schema || []);
  const [errors, setErrors] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.apiUrl.replace(/\/$/, '')}/appdata/${caller_number}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrors('Error fetching data');
      }
    };

    if (!formData || Object.keys(formData).length === 0) {
      fetchData();
    }
  }, [caller_number, formData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`${config.apiUrl.replace(/\/$/, '')}/appdata/${caller_number}`, formData);
      alert('Data updated successfully');
    } catch (error) {
      console.error('Error updating data:', error);
      setErrors('Error updating data');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: '20px' }}>
      {errors && <Typography color="error">{errors}</Typography>}
      {schema.map((field) => (
        <TextField
          key={field.fieldName}
          label={field.label}
          name={field.fieldName}
          value={formData[field.fieldName] || ''}
          onChange={handleInputChange}
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
