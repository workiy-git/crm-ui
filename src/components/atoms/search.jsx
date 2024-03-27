import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, MenuItem, TextField, Button } from '@mui/material';

const Search = () => {
  const [menuData, setMenuData] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to control search container visibility

  useEffect(() => {
    axios.get('http://127.0.0.1:9000/api/menudata')
      .then((response) => {
        console.log('Data received:', response.data);
        setMenuData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSearchClick = () => {
    setIsSearchOpen(prevState => !prevState); // Toggle the value of isSearchOpen
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

  return (
    <Container>
      <Grid container spacing={2}>
        {menuData.map((menuItem, index) => (
          <Grid item key={index}>
            {/* Assuming menuItem.menubar_images.search_icon.icon is the URL of the image */}
            <img
              src={menuItem.menubar_images.search_icon.icon}
              alt='icon'
              style={{ width: '30px', height: 'auto', cursor: 'pointer' }} // Adjust styling as needed
              onClick={handleSearchClick}
            />
          </Grid>
        ))}
      </Grid>
      {isSearchOpen && (
        <Paper style={{ padding: '20px', position:'absolute', zIndex:'1' }}>
          {/* <Typography variant="h6">Search</Typography> */}
          <Container style={{display:'flex'}}>
          <TextField
            label="Search"
            fullWidth
            variant="outlined"
            style={{ marginTop: '10px' }}
          />
          <TextField
            select
            label="Dropdown"
            fullWidth
            variant="outlined"
            style={{ marginTop: '10px' }}
          >
            <MenuItem value={1}>Option 1</MenuItem>
            <MenuItem value={2}>Option 2</MenuItem>
            <MenuItem value={3}>Option 3</MenuItem>
          </TextField>
          </Container>
          <Grid container justifyContent="flex-end" spacing={2} style={{ marginTop: '10px' }}>
            <Grid item>
              <Button variant="contained" onClick={handleCloseSearch}>Close</Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default Search;