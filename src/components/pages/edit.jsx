import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import config from '../../config/config';

const EditPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData, schema, pageName } = location.state;
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (rowData) {
      setFormData(rowData);
    } else {
      // Fetch data if not passed from the previous page
      const fetchData = async () => {
        const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;
        try {
          const response = await axios.get(apiUrl);
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [id, rowData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const { _id, ...updateData } = formData; // Exclude _id from form data
    const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;
    try {
      await axios.put(apiUrl, updateData);
      alert('Data updated successfully');
      navigate(`/${pageName}`);
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Error updating data');
    }
  };

  const handleCancel = () => {
    navigate(`/${pageName}`);
  };

  return (
    <Box sx={{ maxWidth: '600px', margin: '50px auto', padding: '20px', backgroundColor: 'white' }}>
      <Typography variant="h6" gutterBottom>
        Edit {pageName}
      </Typography>
      {schema.map((field) => (
        <TextField
          key={field.fieldName}
          label={field.required ? `${field.label} *` : field.label} 
          name={field.fieldName}
          value={formData[field.fieldName] || ''}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EditPage;
