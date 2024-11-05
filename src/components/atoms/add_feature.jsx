import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel } from '@mui/material';
import DataSaverOnTwoToneIcon from '@mui/icons-material/DataSaverOnTwoTone';
import axios from 'axios';
import config from '../../config/config';
import '../../assets/styles/AddFeature.css'; // Import the CSS file
import { headers } from '../atoms/Authorization'

const AddFeature = ({ onSaveSelectedText, storedSelectedTexts }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const savedOptions = JSON.parse(sessionStorage.getItem('selectedTexts')) || storedSelectedTexts;
    setSelectedOptions(savedOptions);
  }, [storedSelectedTexts]);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/menus`, { headers });
      const menus = response.data.data;

      const menuBar = menus.find(menu => menu.menu === 'menu_bar');
      const addFeaturesValues = menuBar?.add_features_values || {};

      // Flatten the options while extracting the nested values
      const flattenedOptions = Object.keys(addFeaturesValues).map(key => {
        const featureData = addFeaturesValues[key];
        const featureTitle = Object.keys(featureData)[0]; // Extract the title (e.g., 'Calls')
        const featureIcon = featureData[featureTitle]; // Extract the icon URL (e.g., 'https://link-to-icon')

        return {
          title: featureTitle,
          icon: featureIcon, // Correctly assign the icon
          widgets: featureData.widgets || [] // Extract widgets if available
        };
      });

      console.log("Flattened options:", flattenedOptions); // Debugging log
      setOptions(flattenedOptions);

      if (storedSelectedTexts.length === 0 && !sessionStorage.getItem('selectedTexts')) {
        const defaultSelectedOptions = flattenedOptions.slice(0, 4);
        setSelectedOptions(defaultSelectedOptions);
        onSaveSelectedText(defaultSelectedOptions);
        sessionStorage.setItem('selectedTexts', JSON.stringify(defaultSelectedOptions));
      }
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
    sessionStorage.setItem('selectedTexts', JSON.stringify(selectedOptions));
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
      <div onClick={handleOpenDialog}>
        <DataSaverOnTwoToneIcon sx={{color:'white'}} />
      </div>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Select Features</DialogTitle>
        <DialogContent className="add-feature-dialog-content">
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
                <div className="add-feature-label">
                  <img src={option.icon} alt={option.title} className="add-feature-icon" />
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
