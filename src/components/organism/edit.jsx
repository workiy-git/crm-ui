import React, { useState, useEffect, useImperativeHandle, forwardRef  } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import config from '../../config/config';
import '../../assets/styles/style.css';

const EditComponent = forwardRef(({ current, id, pageSchema, formData, setFormData, onSaveSuccess, onSaveError, pageName, pageID }, ref) => {
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
  console.log("currentPage", current)
  const validateForm = () => {
    let hasErrors = false;
    const errors = {};

    pageSchema.forEach((field) => {
      const fieldValue = formData[field.fieldName];
      
      if (field.required && (!formData[field.fieldName] || formData[field.fieldName] === 'N/A')) {
        errors[field.fieldName] = `${field.requiredMessage}`;
        hasErrors = true;
      }
       // Pattern validation
    if (field.pattern && fieldValue) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(fieldValue)) {
        errors[field.fieldName] = field.validationMessage;
        hasErrors = true;
      }
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
      if (id) {
        await axios.put(`${config.apiUrl}/appdata/${id}`, dataToSend);
        onSaveSuccess('Data updated successfully!');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      onSaveError('Error saving data.');
      console.error('Error saving data:', error);
    }
  };

  useImperativeHandle(ref, () => ({
    validateForm,
  }));

  const renderInputField = (field) => {
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

    const inputProps = {
      ...(isFileInput ? {} : { value }),
      ...(field.pattern && { pattern: field.pattern }), // Apply pattern if provided
    };

    if (!isFileInput) {
      commonProps.value = value;
    }
    

    switch (field.htmlControl) {
      case 'input':
        return (
          <FormControl key={field.fieldName} style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '50%',
            borderBottom: '1px solid #e0e0e0',
            paddingBottom: 1,
            paddingTop: 1,
            paddingLeft: 2,
            paddingRight: 2,
            boxSizing: 'border-box',
          }} error={!!isError}>
            <label style={{
              width: '40%',
              textAlign: 'left',
              fontWeight: 'bold',
              color: '#333',
              fontSize: '12px',
            }}>{label}</label>
            <TextField
              className='edit-field-input'
              {...commonProps}
              sx={{
                width: '50%',
                textAlign: 'left',
                color: '#666',
                fontSize: '12px',
              }}
              type={field.type || 'text'}
              inputProps={inputProps}
            />
          </FormControl>
        );
      case 'select':
        return (
          <FormControl key={field.fieldName} style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '50%',
            borderBottom: '1px solid #e0e0e0',
            paddingBottom: 1,
            paddingTop: 1,
            paddingLeft: 2,
            paddingRight: 2,
            boxSizing: 'border-box',
          }} error={!!isError}>
            <label style={{
              width: '40%',
              textAlign: 'left',
              fontWeight: 'bold',
              color: '#333',
              fontSize: '12px',
            }}>{label}</label>
            <Select className='edit-field-input' {...commonProps} style={{
              width: '50%',
              textAlign: 'left',
              color: '#666',
              fontSize: '12px',
            }} displayEmpty>
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
              <Checkbox
                className='edit-field-input'
                name={field.fieldName}
                checked={formData[field.fieldName] || false}
                onChange={handleInputChange}
              />
            }
            label={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '50%',
              borderBottom: '1px solid #e0e0e0',
              paddingBottom: 1,
              paddingTop: 1,
              paddingLeft: 2,
              paddingRight: 2,
              boxSizing: 'border-box',
              margin: 0,
            }}
          />
        );
      default:
        return (
          <FormControl key={field.fieldName} style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '50%',
            borderBottom: '1px solid #e0e0e0',
            paddingBottom: 1,
            paddingTop: 1,
            paddingLeft: 2,
            paddingRight: 2,
            boxSizing: 'border-box',
          }} error={!!isError}>
            <label style={{
              width: '40%',
              textAlign: 'left',
              fontWeight: 'bold',
              color: '#333',
              fontSize: '12px',
            }}>{label}</label>
            <TextField className='edit-field-input' {...commonProps} style={{
              width: '50%',
              textAlign: 'left',
              color: '#666',
              fontSize: '12px',
            }} />
          </FormControl>
        );
    }
  };

  return (
    <Box style={{display:'flex', flexWrap: 'wrap' }}>
      {/* {validationError && <div style={{ color: 'red', position:'absolute' }}>{validationError}</div>} */}
      {pageSchema.map((field) => renderInputField(field))}
    </Box>
  );
});

export default EditComponent;
