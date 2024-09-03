import React, { useState, useEffect, useImperativeHandle, forwardRef  } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import config from '../../config/config';

const AddComponent = forwardRef(({ formData, setFormData, pageSchema, onSaveSuccess, onSaveError, pageName, pageId }, ref) => {
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({ ...prevData, [name]: fieldValue }));
  };
  const [validationError, setValidationError] = useState('');
  const [formErrors, setFormErrors] = useState({});

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
  
  useImperativeHandle(ref, () => ({
    validateForm,
  }));

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
    // const value = formData[field.fieldName] || '';
    // const isError = false; // Modify as necessary for error handling
    // const label = `${field.label || field.fieldName}${field.required ? ' *' : ''}`;

    // const commonProps = {
    //   name: field.fieldName,
    //   value: value,
    //   placeholder: field.placeholder || 'Not Specified',
    //   fullWidth: true,
    //   onChange: handleInputChange,
    //   error: !!isError,
    //   helperText: isError && `${field.label || field.fieldName} is mandatory`,
    // };
    const isFileInput = field.type === 'file';
    const value = !isFileInput && (formData[field.fieldName] === 'N/A' ? '' : formData[field.fieldName] || '');
    const isError = formErrors[field.fieldName];
    const label = `${field.label || field.fieldName}${field.required ? ' *' : ''}`;
    const isRequired = field.required === 'true';

    const commonProps = {
      name: field.fieldName,
      placeholder: field.placeholder || 'Not Specified',
      fullWidth: true,
      onChange: handleInputChange,
      error: !!isError,
      helperText: isError && formErrors[field.fieldName],
      ...(isRequired && { required: true }) // Add the required property if isRequired is true
    };

    if (!isFileInput) {
      commonProps.value = value;
    }

    switch (field.htmlControl) {
      case 'input':
        return (
          <FormControl key={field.fieldName} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '50%' }} error={!!isError}>
            <label style={{ width: '40%', textAlign: 'left' }}>{label}</label>
            <TextField className='valuefield' {...commonProps} type={field.type || 'text'} />
          </FormControl>
        );
      case 'select':
        return (
          <FormControl key={field.fieldName} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '50%' }} error={!!isError}>
            <label style={{ width: '40%', textAlign: 'left' }}>{label}</label>
            <Select className='valuefield' {...commonProps} displayEmpty>
              <MenuItem value="">
                <em>{field.placeholder || 'Select an option'}</em>
              </MenuItem>
              {field.options.map((option, index) => (
                <MenuItem className='edit-field-input-select' key={index} value={option}>
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
              <Checkbox name={field.fieldName} checked={formData[field.fieldName] || false} onChange={handleInputChange} />
            }
            label={label}
            style={{ width: '50%' }}
          />
        );
      default:
        return (
          <FormControl key={field.fieldName} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '50%' }} error={!!isError}>
            <label style={{ width: '40%', textAlign: 'left' }}>{label}</label>
            <TextField className='valuefield' {...commonProps} />
          </FormControl>
        );
    }
  };

  return (
    <Box style={{ display: 'flex', flexWrap: 'wrap' }}>
      {pageSchema.map((field) => renderInputField(field))}
    </Box>
  );
});

export default AddComponent;
