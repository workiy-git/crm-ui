import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, InputBase } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import config from '../../config/config';
import { headers } from '../atoms/Authorization';

const GridSearch = ({ field, value, onChange }) => {
  const [dropdownOptions, setDropdownOptions] = useState([]);

  useEffect(() => {
    if (field.htmlControl === 'select') {
      const fetchOptions = async () => {
        const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/options/${field.fieldName}`;
        try {
          const response = await axios.get(apiUrl, {headers: headers});
          setDropdownOptions(response.data.options || []);
        } catch (error) {
          console.error('Error fetching dropdown options:', error);
        }
      };
      fetchOptions();
    }
  }, [field]);

  if (field.htmlControl === 'input' && field.type === 'text') {
    return (
      <InputBase
        placeholder={`Search ${field.label}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputProps={{ 'aria-label': 'search' }}
        className="searchBox"
      />
    );
  }

  if (field.htmlControl === 'select') {
    return (
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        fullWidth
      >
        <MenuItem value="">
          <em>Select</em>
        </MenuItem>
        {dropdownOptions.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    );
  }

  if (field.htmlControl === 'input' && field.type === 'date') {
    return (
      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')}
        placeholderText="Select Date"
        dateFormat="yyyy-MM-dd"
        className="searchBox"
      />
    );
  }

  return (
    <InputBase
      placeholder={`Search ${field.label}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      inputProps={{ 'aria-label': 'search' }}
      className="searchBox"
    />
  );
};

export default GridSearch;
