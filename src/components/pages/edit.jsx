import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, TextField } from '@mui/material';
import config from '../../config/config'; // Ensure the path is correct

const Edit = ({ endpoint }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!endpoint || !id) {
        console.error('Endpoint or ID is missing.');
        return;
      }
      try {
        const response = await axios.get(`${config.apiUrl}${endpoint}/${id}`);
        setFormData(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, [endpoint, id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${config.apiUrl}${endpoint}/${id}`, formData);
      navigate('/grid'); // Redirect to the grid page
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <form>
        {Object.entries(formData).map(([key, value]) => (
          <TextField
            key={key}
            name={key}
            label={key.replace(/_/g, ' ')}
            value={value}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        ))}
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </form>
    </Box>
  );
};

export default Edit;
