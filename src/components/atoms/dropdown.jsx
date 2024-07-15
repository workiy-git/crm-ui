import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import config from '../../config/config';
import axios from 'axios';

function Dropdown({ controlName, onOptionSelected }) {
  const theme = useTheme();
  const [selectedOption, setSelectedOption] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchControls = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/controls`);
        const controlsData = response.data.data;
        console.log('Fetched controls:', controlsData);

        const control = controlsData.find(control => control.control_name === controlName);
        if (control && control.value) {
          setOptions(control.value);
          console.log('Options set:', control.value);
        }
      } catch (error) {
        console.error('Failed to fetch controls data:', error);
      }
    };

    fetchControls();
  }, [controlName]);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    const selectedOption = options.find(option => option.name === event.target.value);
    if (selectedOption && onOptionSelected) {
      onOptionSelected(selectedOption.filter); // Pass the filter of the selected option
      console.log('Selected filter:', selectedOption.filter);
    }
  };

  return (
    <FormControl fullWidth>
      <Select
        value={selectedOption}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
      >
        {options.map((option) => (
          <MenuItem key={option.name} value={option.name}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default Dropdown;
