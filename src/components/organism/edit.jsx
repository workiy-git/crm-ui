import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Select, MenuItem, FormControl, Checkbox, FormControlLabel, InputLabel } from '@mui/material';
import axios from 'axios';
import config from '../../config/config';

const EditComponent = ({ id, pageSchema, formData, setFormData, onSaveSuccess }) => {
  const [isAddingNew, setIsAddingNew] = useState(!id); // If there's no ID, it's adding mode
  const [validationError, setValidationError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({ ...prevData, [name]: fieldValue }));
  };

  const validateForm = () => {
    let hasErrors = false;
    const errors = {};

    pageSchema.forEach((field) => {
      if (field.required && !formData[field.fieldName]) {
        errors[field.fieldName] = `${field.label || field.fieldName} is mandatory`;
        hasErrors = true;
      }
    });

    setFormErrors(errors);
    setValidationError(hasErrors ? 'Please fill all mandatory fields' : '');
    return !hasErrors;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (isAddingNew) {
        await axios.post(`${config.apiUrl}/appdata/create`, formData);
      } else {
        await axios.put(`${config.apiUrl}/appdata/${id}`, formData);
      }
      onSaveSuccess();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const renderInputField = (field) => {
    const value = formData[field.fieldName] || 'N/A';
    const isError = formErrors[field.fieldName];
    const label = `${field.label || field.fieldName}${field.required ? ' *' : ''}`;

    const commonProps = {
      name: field.fieldName,
      value: value,
      placeholder: field.placeholder || 'Not Specified',
      fullWidth: true,
      onChange: handleInputChange,
      error: !!isError,
      helperText: isError && formErrors[field.fieldName],
    };

    switch (field.htmlControl) {
      case 'input':
        return (
          <FormControl key={field.fieldName} style={{ width: '100%', marginBottom: '16px', display: 'flex', flexDirection: 'row' }} error={!!isError}>
            <label style={{ width: '40%' }}>{label}</label>
            <TextField {...commonProps} style={{ width: '40%' }} type={field.type || 'text'} />
          </FormControl>
        );
      case 'select':
        return (
          <FormControl key={field.fieldName} style={{ width: '100%', marginBottom: '16px', display: 'flex', flexDirection: 'row' }} error={!!isError}>
            <label style={{ width: '40%' }}>{label}</label>
            <Select {...commonProps} style={{ width: '40%' }} displayEmpty>
              <MenuItem value="">
                <em>{field.placeholder || 'Select an option'}</em>
              </MenuItem>
              {field.options.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {isError && <div style={{ color: 'red', fontSize: '12px' }}>{formErrors[field.fieldName]}</div>}
          </FormControl>
        );
      case 'checkbox':
        return (
          <FormControlLabel
            key={field.fieldName}
            control={
              <Checkbox
                name={field.fieldName}
                checked={formData[field.fieldName] || false}
                onChange={handleInputChange}
              />
            }
            label={label}
            style={{ width: '100%', marginBottom: '16px' }}
          />
        );
      default:
        return (
          <FormControl key={field.fieldName} style={{ width: '100%', marginBottom: '16px', display: 'flex', flexDirection: 'row' }} error={!!isError}>
            <label style={{ width: '40%' }}>{label}</label>
            <TextField {...commonProps} style={{ width: '40%' }} />
          </FormControl>
        );
    }
  };

  return (
    <Box>
      {pageSchema.map((field) => renderInputField(field))}
      {validationError && <div style={{ color: 'red' }}>{validationError}</div>}
      <Button variant="contained" color="primary" onClick={handleSave}>
        {isAddingNew ? 'Add' : 'Save'}
      </Button>
    </Box>
  );
};

export default EditComponent;
