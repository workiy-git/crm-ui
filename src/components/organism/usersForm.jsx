import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography, FormControl, InputLabel, MenuItem, Select, OutlinedInput, Snackbar } from '@mui/material';
import axios from 'axios';
import Header from '../organism/header';
import SideMenu from '../organism/sidemenu';
import config from '../../config/config';

const UserForm = () => {
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    if (keys.length > 1) {
      setFormData((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value
        }
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData); // Added for debugging
    try {
      const response = await axios.post(`${config.apiUrl}/users`, formData);
      console.log('User Data saved:', response.data);
      setSuccessMessage('User successfully created!');
    } catch (error) {
      console.error('Error saving data:', error);
      setSuccessMessage('User not created!');
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(''); // Correctly close the snackbar by setting the message to an empty string
  };

  return (
    <div>
      <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden', backgroundColor: "gray", paddingLeft: 0 }}>
        <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden' }}>
          <div style={{ width: '10vh', backgroundColor: "#0d2d4e" }}>
            <SideMenu />
          </div>
          <div style={{ width: '100%', background: '#D9D9D9' }}>
            <div>
              <Header />
            </div>
            <Typography variant="h5" style={{ height: '4rem', color: 'white', padding: '10px', fontSize: '30px', background: 'linear-gradient(90deg, rgba(12,45,78,1) 0%, rgba(28,104,180,1) 100%)' }}>
              Add User Form
            </Typography>
            <div>
              <Paper elevation={3} style={{ height: '77vh', overflow: 'auto', boxShadow: 'none', background: 'none' }}>
                <div style={{ padding: 20, background: 'white', boxShadow: '0px 0px 8px gray' }}>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          name="first_name"
                          label="First Name"
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          name="last_name"
                          label="Last Name"
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          name="email"
                          label="Email"
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          name="phone"
                          label="Phone"
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          name="address.street"
                          label="Street"
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          name="address.city"
                          label="City"
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          name="address.state"
                          label="State"
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          name="address.zip"
                          label="Zip"
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          name="address.country"
                          label="Country"
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          name="company"
                          label="Company"
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel id="job-role-label">Job Role</InputLabel>
                          <Select
                            required
                            labelId="job-role-label"
                            name="job_role"
                            onChange={handleChange}
                            input={<OutlinedInput label="Name" />}
                          >
                            <MenuItem value="Super_Admin">Super Admin</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="User">User</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sx={{ textAlign: 'center' }}>
                        <Button type="submit" variant="contained" color="primary">
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </div>
              </Paper>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />
    </div>
  );
};

export default UserForm;
