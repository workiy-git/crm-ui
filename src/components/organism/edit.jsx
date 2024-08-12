import React, { useState, useEffect } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, Checkbox, FormControlLabel } from '@mui/material';

const EditComponent = ({ id, pageSchema, formData, setFormData, onValidationError }) => {
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
      if (field.required && !formData[field.fieldName]) {
        errors[field.fieldName] = `${field.label || field.fieldName} is mandatory`;
        hasErrors = true;
      }
    });

    setFormErrors(errors);
    if (hasErrors) {
      onValidationError(errors);
    } else {
      onValidationError(null);
    }
    return !hasErrors;
  };

  const renderInputField = (field) => {
    const value = formData[field.fieldName] || '';
    const isError = formErrors[field.fieldName];
    const label = `${field.label || field.fieldName}${field.required ? ' *' : ''}`;

    const commonProps = {
      name: field.fieldName,
      value: value,
      placeholder: field.placeholder || 'Not Specified',
      fullWidth: true,
      onChange: handleInputChange,
      required: field.required,
      error: !!isError,
      helperText: isError && formErrors[field.fieldName],
    };

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
            <TextField {...commonProps} sx={{
              width: '50%',
              textAlign: 'left',
              color: '#666',
              fontSize: '12px',
            }} type={field.type || 'text'} />
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
            <Select {...commonProps} style={{
              width: '50%',
              textAlign: 'left',
              color: '#666',
              fontSize: '12px',
            }} displayEmpty>
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
            <TextField {...commonProps} style={{
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
      {pageSchema.map((field) => renderInputField(field))}
    </Box>
  );
};

export default EditComponent;
