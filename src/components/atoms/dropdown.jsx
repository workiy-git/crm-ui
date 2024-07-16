import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import config from '../../config/config';
import axios from 'axios';

function Dropdown({ onOptionSelected, pageName }) {
  const theme = useTheme();
  const [selectedOption, setSelectedOption] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchControls = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/controls`);
        const controlsData = response.data.data;

        const control = controlsData.find(
          control => control.pageName === pageName
        );

        if (control && control.value) {
          setOptions(control.value);
        } else {
          setOptions([]);
        }
      } catch (error) {
        console.error('Failed to fetch controls data:', error);
      }
    };

    fetchControls();
  }, [pageName]);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    const selectedOption = options.find(option => option.name === event.target.value);
    if (selectedOption) {
      onOptionSelected(selectedOption.filter);
    }
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <Select
        value={selectedOption}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options.map(option => (
          <MenuItem key={option.name} value={option.name}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default Dropdown;