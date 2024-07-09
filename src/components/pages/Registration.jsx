import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button,Box, Typography, Grid, Paper, InputLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import config from '../../config/config';
import CompanylogoUpload from '../atoms/AddCompany'
import ProfileUpload from '../atoms/AddProfile'
import BgGif from './registerGif.gif'

const ModeratorRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    companyLogo: null,
    profilePhoto: null,
  });

  const [message, setMessage] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setConfirmDialogOpen(false);
    setMessage('Redirecting to home page...');
    navigate('/'); // Navigate to home page immediately

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

  };
  const [registrationData, setregistrationData] = useState([]);
  useEffect(() => {
    axios.get(`${config.apiUrl}/logindata`)
        .then((response) => {
            console.log('Data received:', response.data);
            setregistrationData(response.data);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}, []);

  const handleEdit = () => {
    setConfirmDialogOpen(false);
    // Do nothing, allowing the user to edit the form
  };

  return (
    <Box sx={{display:'flex'}}>
      <Box sx={{width:'50%'}}>
        {/* {registrationData.map((item, index) => (
              <img src={item.registration.images.background2} alt="" style={{width:'100%'}}/>
        ))} */}
        <img src={BgGif} alt="" style={{width:'100%'}}/>
        
      </Box>
    <Container maxWidth="md" style={{ width:'50%'}}>
      <Paper elevation={3} style={{boxShadow:'none', padding:'1rem'}} >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Form fields */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                inputProps={{ minLength: 4 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                inputProps={{ minLength: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                type="tel"
                variant="outlined"
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                helperText="Required field cannot be empty"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                variant="outlined"
                required
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                inputProps={{ minLength: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Company Logo</InputLabel>
        <CompanylogoUpload
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}/>
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Profile Photo</InputLabel>
              <ProfileUpload/>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'right' }}>
              <Button type="reset" variant="contained" color="primary" style={{ marginRight: '1rem',background:'#212529' }}>
                Reset
              </Button>
              <Button type="submit" variant="contained"style={{background:'#12e5e5'}}>
                Submit
              </Button>
            </Grid>
            {message && (
              <Grid item xs={12}>
                <Typography variant="body2" color="primary">
                  {message}
                </Typography>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
      {/* Confirmation dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Submit</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Do you want to submit the registration or edit your details?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEdit} color="primary">
            Edit
          </Button>
          <Button onClick={handleConfirmSubmit} >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </Box>
  );
};

export default ModeratorRegistration;