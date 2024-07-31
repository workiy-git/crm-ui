import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import config from '../../config/config';
import axios from 'axios';
import '../../assets/styles/callsgrid.css';

function Dropdown({ onOptionSelected, pageName, filter }) {
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

  useEffect(() => {
    if (filter) {
      setSelectedOption(filter.name);
    }
  }, [filter]);

  useEffect(() => {
    const storedFilter = localStorage.getItem('widgetFilter');
    if (storedFilter) {
      const cleanedFilterString = storedFilter.replace(/\\/g, '').replace(/^"|"$/g, '');
      let parsedFilter;
      try {
        parsedFilter = JSON.parse(cleanedFilterString);
  
        if (parsedFilter) {
          // Find the option that matches the stored filter value
          const selectedOption = options.find(option =>
            Object.keys(parsedFilter).some(key =>
              option.filter[key] === parsedFilter[key]
            )
          );
  
          if (selectedOption && selectedOption.name !== selectedOption.name) {
            setSelectedOption(selectedOption.name); // Set the dropdown value only if it has changed
            if (JSON.stringify(selectedOption.filter) !== JSON.stringify(selectedOption.filter)) {
              onOptionSelected(selectedOption.filter); // Pass the filter to the parent only if it has changed
            }
          } else {
            console.warn('No matching option found for the stored filter:', parsedFilter);
          }
        }
      } catch (error) {
        console.error('Failed to parse the stored filter:', error);
      }
    }
  }, [options, onOptionSelected]);

  const handleChange = (event) => {
    const selectedName = event.target.value;
    setSelectedOption(selectedName);

    const selectedOption = options.find(option => option.name === selectedName);
    if (selectedOption) {
      onOptionSelected(selectedOption.filter); // Pass the filter to the parent
    }
  };

  return (
    <FormControl className='dropdown' sx={{ m: 1, width: '300px' }}>
      <Select
        value={selectedOption}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        sx={{ color: 'white', background: '#212529' }}
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