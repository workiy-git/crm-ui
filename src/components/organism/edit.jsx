import React, { useState, useEffect } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, Checkbox, FormControlLabel, InputLabel } from '@mui/material';
import axios from 'axios';
import config from '../../config/config';

const EditComponent = ({ id, pageSchema, formData, setFormData, onSaveSuccess, onSaveError, pageName, pageID }) => {
  const [validationError, setValidationError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!formData) {
      setFormData({});
    }
  }, [formData, setFormData]);

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

    setFormErrors(errors);
    if (hasErrors) {
      setValidationError('Please fill all mandatory fields');
    } else {
      setValidationError('');
    }
    return !hasErrors;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      onSaveError('Please fill all mandatory fields');
      for (const key in formErrors) {
        const element = document.querySelector(`[name="${key}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
        }
      }
      return;
    }

    try {
      const dataToSend = { pageName, pageID, ...formData };
      if (!id) {
        await axios.post(`${config.apiUrl}/appdata/create`, dataToSend);
      } else {
        await axios.put(`${config.apiUrl}/appdata/${id}`, dataToSend);
      }
      onSaveSuccess('Data saved successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      onSaveError('Error saving data.');
      console.error('Error saving data:', error);
    }
  };

  const renderInputField = (field) => {
    const value = formData[field.fieldName] === 'N/A' ? '' : formData[field.fieldName] || '';
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
    </Box>
  );
};

export default EditComponent;
