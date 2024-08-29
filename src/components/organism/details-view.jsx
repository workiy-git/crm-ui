import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import config from '../../config/config';
import { Box, Button, TextField, Typography } from '@mui/material';
import DetailsPages from "../pages/details";


const DetailsPage = ({ endpoint }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formState, setFormState] = useState(location.state?.rowData || {});
  const [errors, setErrors] = useState("");

  useEffect(() => {
    if (!location.state?.rowData) {
      // Fetch data if it's not passed via state
      const fetchData = async () => {
        try {
          const response = await axios.get(`${config.apiUrl}${endpoint}/${id}`);
          setFormState(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchData();
    }
  }, [id, location.state, endpoint]);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${config.apiUrl}${endpoint}/${id}`, formState);
      navigate('/'); // Navigate back to the grid page after saving
    } catch (error) {
      console.error('Error saving user data:', error);
      setErrors("Error saving user data");
    }
  };

  return (
    <div style={{ width: '45%' , background: '#0d2d4e', borderRadius: '10px', color: '#FFFFFF' }}>
        
    
      <div style={{ display: 'flex', height: '-webkit-fill-available' }}>
      
          <div>
          <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit User
      </Typography>
      <form style={{background:'white', padding:'15px', borderRadius:'10px'}} onSubmit={handleSave}>
        {Object.entries(formState).map(([key, value]) => (
          key !== "_id" && (
            <TextField
              key={key}
              name={key}
              label={key.replace(/_/g, ' ')}
              value={value}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          )
        ))}
        {errors && <Typography color="error">{errors}</Typography>}
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </form>
    </Box>
          </div>
        </div>
      </div>
   

 
    

  );
};

export default DetailsPage;