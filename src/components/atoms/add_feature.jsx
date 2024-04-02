import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, Box, CircularProgress } from '@mui/material';
import config from '../../config/config';
import SelectedTextDisplay from './SelectedTextDisplay'; // Import the SelectedTextDisplay component

const AddFeature = ({ onSaveSelectedText }) => {
  const [menuData, setMenuData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${config.apiUrl}/menudata`)
      .then((response) => {
        console.log('Data received:', response.data);
        setMenuData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleButtonClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setOpen(true);
    setSelectedTexts([]);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (!selectedMenuItem || !selectedMenuItem.features_menu) {
      console.error('Selected menu item or its features are null or undefined');
      return;
    }

    const selectedItems = Object.values(selectedMenuItem.features_menu || {}).filter(value =>
      selectedTexts.includes(value)
    );
    onSaveSelectedText(selectedItems); // Pass selected items to parent component
    handleClose();
  };

  const handleCheckboxChange = (value) => {
    const isSelected = selectedTexts.includes(value);
    if (isSelected) {
      setSelectedTexts(selectedTexts.filter(item => item !== value));
    } else {
      setSelectedTexts([...selectedTexts, value]);
    }
  };

  const handleSelectAll = () => {
    const allValues = Object.values(selectedMenuItem.features_menu || {});
    setSelectedTexts(allValues);
  };

  const handleReset = () => {
    setSelectedTexts([]);
  };

  return (
    <Container>
      {loading && <CircularProgress />}
      {!loading && (
        <Grid container spacing={1} justifyContent="center">
          {menuData.map((menuItem, index) => (
            <Grid item key={index}>
              <Button onClick={() => handleButtonClick(menuItem)}>
                <img
                  src={menuItem.menu.menu_bar.menu_images.add_icon.icon}
                  alt='icon'
                  style={{ width: '30px', height: 'auto' }} 
                />
              </Button>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ textAlign: 'center' }}>Add Menus</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={1}>
            {selectedMenuItem && selectedMenuItem.menu.menu_bar.add_features_values && Object.values(selectedMenuItem.menu.menu_bar.add_features_values).map((value, index) => (
              <Grid item xs={6} key={index}>
                <Box sx={{ bgcolor: 'skyblue', borderRadius: 1, mb: 1, p: 1, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <p>{value}</p>
                  </Box>
                  <FormControlLabel
                    control={<Checkbox checked={selectedTexts.includes(value)} onChange={() => handleCheckboxChange(value)} />}
                    label=""
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleSelectAll}>Select All</Button>
          <Button onClick={handleReset}>Reset</Button>
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <SelectedTextDisplay selectedTexts={selectedTexts} /> {/* Pass selectedTexts as a prop to SelectedTextDisplay */}
    </Container>
  );
};

export default AddFeature;
