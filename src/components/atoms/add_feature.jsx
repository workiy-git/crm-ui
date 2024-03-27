import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, Box } from '@mui/material';

const AddFeature = ({ onSaveSelectedText }) => {
  const [menuData, setMenuData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedTexts, setSelectedTexts] = useState([]);

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

  const handleButtonClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setOpen(true);
    setSelectedTexts([]); // Clear selected texts when dialog opens
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const selectedItems = Object.values(selectedMenuItem.features_menu).filter(value =>
      selectedTexts.includes(value)
    );
    onSaveSelectedText(selectedItems);
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
    const allValues = Object.values(selectedMenuItem.features_menu);
    setSelectedTexts(allValues);
  };

  const handleReset = () => {
    setSelectedTexts([]);
  };

  return (
    <Container>
      <Grid container spacing={2} justifyContent="center">
        {menuData.map((menuItem, index) => (
          <Grid item key={index}>
            <Button onClick={() => handleButtonClick(menuItem)}>
              <img
                src={menuItem.menubar_images.add_icon.icon}
                alt='icon'
                style={{ width: '30px', height: 'auto' }} 
              />
            </Button>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ textAlign: 'center' }}>Add Menus</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={1}>
            {selectedMenuItem && Object.values(selectedMenuItem.features_menu).map((value, index) => (
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
    </Container>
  );
};

export default AddFeature;
