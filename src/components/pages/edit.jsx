import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import config from '../../config/config';
import { Box, Button, TextField, Typography } from '@mui/material';
import Header from "../organism/header";
import SideMenu from "../organism/sidemenu";
import Footer from "../atoms/Footer";

const EditPage = ({ endpoint }) => {
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
    <div>
    <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden', backgroundColor: "gray", paddingLeft: 0 }}>
      <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden' }}>
        <div style={{ width: '10vh', backgroundColor: "#0d2d4e" }}>
          <SideMenu />
        </div>
        <div style={{ width: '100%', marginRight: "-10px", overflow: 'hidden' }}>
          <div>
            <Header />
          </div>
          <div>
          <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit User
      </Typography>
      <form onSubmit={handleSave}>
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
      <Footer />
    </div>
    
    </div>
  );
};

export default EditPage;
