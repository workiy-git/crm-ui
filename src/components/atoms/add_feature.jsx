import React, { useState, useEffect } from 'react';
import config from '../../config/config';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';

const AddFeature = ({ onSaveSelectedText, storedSelectedTexts }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(storedSelectedTexts || []);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/menus`)
      const menus = response.data.data;

      // Extracting the add_features_values from the menu_bar
      const menuBar = menus.find(menu => menu.menu === 'menu_bar');
      const addFeaturesValues = menuBar?.add_features_values || {};

      const flattenedOptions = Object.keys(addFeaturesValues).map(key => ({
        title: key,
        icon: addFeaturesValues[key],
      }));

      setOptions(flattenedOptions);
    } catch (error) {
      console.error('Error fetching menu data:', error);
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSelectAll = () => {
    setSelectedOptions(options);
  };

  const handleReset = () => {
    setSelectedOptions([]);
  };

  const handleSave = () => {
    onSaveSelectedText(selectedOptions);
    handleCloseDialog();
  };

  const handleCheckboxChange = (option) => {
    if (selectedOptions.some(selected => selected.title === option.title)) {
      setSelectedOptions(selectedOptions.filter((selected) => selected.title !== option.title));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <div>
      <IconButton onClick={handleOpenDialog}>
        <AddCircleOutlineIcon />
      </IconButton>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Select Features</DialogTitle>
        <DialogContent>
          {options.map((option, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={selectedOptions.some(selected => selected.title === option.title)}
                  onChange={() => handleCheckboxChange(option)}
                />
              }
              label={
                <div>
                  <img src={option.icon} alt={option.title} style={{ width: '20px', height: 'auto', marginRight: '8px' }} />
                  {option.title}
                </div>
              }
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSelectAll}>Select All</Button>
          <Button onClick={handleReset}>Reset</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddFeature;
