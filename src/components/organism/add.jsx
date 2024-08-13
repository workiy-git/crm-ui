import React from 'react';
import { Box, TextField, Select, MenuItem, FormControl, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import config from '../../config/config';

const AddComponent = ({ formData, setFormData, pageSchema, onSaveSuccess, onSaveError, pageName, pageId }) => {
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({ ...prevData, [name]: fieldValue }));
  };

  const validateForm = () => {
    let hasErrors = false;
    const errors = {};

    pageSchema.forEach((field) => {
      if (field.required && (!formData[field.fieldName] || formData[field.fieldName] === 'N/A')) {
        errors[field.fieldName] = `${field.label || field.fieldName} is mandatory`;
        hasErrors = true;
      }
    });

    return !hasErrors;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      onSaveError('Please fill all mandatory fields');
      return;
    }

    try {
      const dataToSend = { pageName, pageId, ...formData };
      await axios.post(`${config.apiUrl}/appdata/create`, dataToSend);
      onSaveSuccess('Data added successfully!');
    } catch (error) {
      onSaveError('Error adding data.');
      console.error('Error adding data:', error);
    }
  };

  const renderInputField = (field) => {
    const value = formData[field.fieldName] || '';
    const isError = false; // Modify as necessary for error handling
    const label = `${field.label || field.fieldName}${field.required ? ' *' : ''}`;

    const commonProps = {
      name: field.fieldName,
      value: value,
      placeholder: field.placeholder || 'Not Specified',
      fullWidth: true,
      onChange: handleInputChange,
      error: !!isError,
      helperText: isError && `${field.label || field.fieldName} is mandatory`,
    };

    switch (field.htmlControl) {
      case 'input':
        return (
          <FormControl key={field.fieldName} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '50%' }}>
            <label style={{ width: '40%', textAlign: 'left' }}>{label}</label>
            <TextField {...commonProps} type={field.type || 'text'} />
          </FormControl>
        );
      case 'select':
        return (
          <FormControl key={field.fieldName} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '50%' }}>
            <label style={{ width: '40%', textAlign: 'left' }}>{label}</label>
            <Select {...commonProps} displayEmpty>
              <MenuItem value="">
                <em>{field.placeholder || 'Select an option'}</em>
              </MenuItem>
              {field.options.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'checkbox':
        return (
          <FormControlLabel
            key={field.fieldName}
            control={
              <Checkbox name={field.fieldName} checked={formData[field.fieldName] || false} onChange={handleInputChange} />
            }
            label={label}
            style={{ width: '50%' }}
          />
        );
      default:
        return (
          <FormControl key={field.fieldName} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '50%' }}>
            <label style={{ width: '40%', textAlign: 'left' }}>{label}</label>
            <TextField {...commonProps} />
          </FormControl>
        );
    }
  };

  return (
    <Box style={{ display: 'flex', flexWrap: 'wrap' }}>
      {pageSchema.map((field) => renderInputField(field))}
    </Box>
  );
};

export default AddComponent;
