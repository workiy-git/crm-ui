import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, Box, CircularProgress } from '@mui/material';
import config from '../../config/config';

const AddFeature = ({ onSaveSelectedText, storedSelectedTexts }) => {
  const [menuData, setMenuData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedTexts, setSelectedTexts] = useState(storedSelectedTexts || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/menudata`);
        setMenuData(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  useEffect(() => {
    setSelectedTexts(storedSelectedTexts);
  }, [storedSelectedTexts]);

  const handleButtonClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const uniqueSelectedTexts = selectedTexts.filter((text, index, self) =>
      index === self.findIndex((t) => t.title === text.title)
    );

    onSaveSelectedText(uniqueSelectedTexts);
    handleClose();
  };

  const handleCheckboxChange = (title, checked) => {
    let updatedSelectedTexts = [...selectedTexts];

    if (checked) {
      updatedSelectedTexts.push({ title, icon: selectedMenuItem.menu.menu_bar.add_features_values[title] });
    } else {
      updatedSelectedTexts = updatedSelectedTexts.filter(item => item.title !== title);
    }

    setSelectedTexts(updatedSelectedTexts);
  };

  const handleSelectAll = () => {
    const allValues = Object.keys(selectedMenuItem.menu.menu_bar.add_features_values || {});
    setSelectedTexts(allValues.map(title => ({ title, icon: selectedMenuItem.menu.menu_bar.add_features_values[title] })));
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
            {selectedMenuItem && selectedMenuItem.menu.menu_bar.add_features_values && Object.entries(selectedMenuItem.menu.menu_bar.add_features_values).map(([title, value], index) => (
              <Grid item xs={6} key={index}>
                <Box
                  sx={{
                    bgcolor: 'red',
                    borderRadius: 2,
                    mb: 1,
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: 3,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 6
                    }
                  }}
                >
                  <img src={value} alt={title} style={{ width: '30px', height: 'auto', marginRight: '8px' }} />
                  <span>{title}</span>
                  <FormControlLabel
                    control={<Checkbox checked={selectedTexts.some(item => item.title === title)} onChange={(e) => handleCheckboxChange(title, e.target.checked)} />}
                    label=""
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleSelectAll} sx={{ bgcolor: '#0057b7', color: 'white', '&:hover': { bgcolor: '#003f8a', color: 'white' } }}>Select All</Button>
          <Button onClick={handleReset} sx={{ bgcolor: '#666666', color: 'white', '&:hover': { bgcolor: '#4d4d4d', color: 'white' } }}>Reset</Button>
          <Button onClick={handleSave} sx={{ bgcolor: '#2e7d32', color: 'white', '&:hover': { bgcolor: '#1b5e20', color: 'white' } }}>Save</Button>
          <Button onClick={handleClose} sx={{ bgcolor: '#d32f2f', color: 'white', '&:hover': { bgcolor: '#b71c1c', color: 'white' } }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddFeature;