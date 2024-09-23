import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
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
// const validationMessage =field.validationMessage
  const validateField = (fieldName, value) => {
    const fieldSchema = pageSchema.find(field => field.fieldName === fieldName);
    let error = "";
    console.log("formData",fieldName)
    if (!fieldSchema) return "";

    if (fieldSchema.required && !value) {
      error = `${fieldName} is required.`;
    }

    if (fieldSchema.pattern && value) {
      const regex = new RegExp(fieldSchema.pattern);
      const validationMessage = (fieldSchema.validationMessage);
      console.log("asdf",fieldSchema)
      if (!regex.test(value)) {
        error = `${validationMessage}`;
      }
    }

    return error;
  };

  const handleInputChange = (e, fieldName) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const error = validateField(fieldName, value);
  
    if (fieldName.includes('.')) {
      // Handle nested fields
      const [parentField, childField] = fieldName.split('.');
      setFormData(prevState => ({
        ...prevState,
        [parentField]: {
          ...prevState[parentField],
          [childField]: value,
        },
      }));
    } else {
      // Handle normal fields
      setFormData(prevState => ({
        ...prevState,
        [fieldName]: value,
      }));
    }
  
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: error
    }));
  };
  


const validateForm = () => {
  let hasErrors = false;
  const errors = {};

  pageSchema.forEach((field) => {
    const fieldValue = formData[field.fieldName];
    
    if (field.required && (!fieldValue || fieldValue === 'N/A')) {
      errors[field.fieldName] = `${field.requiredMessage}`;
      hasErrors = true;
    }
    if (field.pattern && fieldValue) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(fieldValue)) {
        errors[field.fieldName] = field.validationMessage;
        hasErrors = true;
      }
    }
  });

    setFormErrors(errors);
    setValidationError(hasErrors ? 'Please fill all mandatory fields' : '');
    return !hasErrors;
  };

  useImperativeHandle(ref, () => ({
    validateForm,
  }));


  const renderInputField = (field) => {
    const isFileInput = field.type === 'file';
    const value = !isFileInput && (formData[field.fieldName] === 'N/A' ? '' : formData[field.fieldName] || '');
    const isError = formErrors[field.fieldName];
    const label = `${field.label || field.fieldName}${field.required ? ' *' : ''}`;
    const isRequired = field.required === true;
  
    const commonProps = {
      name: field.fieldName,
      placeholder: field.placeholder || 'Not Specified',
      fullWidth: true,
      onChange: (e) => handleInputChange(e, field.fieldName),
      error: !!isError,
      helperText: isError && formErrors[field.fieldName],
      ...(isRequired && { required: true }),
    };
  
    const inputProps = {
      ...(isFileInput ? {} : { value }),
      ...(field.pattern && { pattern: field.pattern }),
    };
    
    if (!isFileInput) {
      commonProps.value = value;
    }
  
    const formControlStyles = {
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
    };
  
    const labelStyles = {
      width: '40%',
      textAlign: 'left',
      fontWeight: 'bold',
      color: '#333',
      fontSize: '12px',
    };
  
    switch (field.htmlControl) {
      case 'input':
        return (
          <FormControl className='details_page_inputs' key={field.fieldName} style={formControlStyles} error={!!isError}>
            <label style={labelStyles}>{label}</label>
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
      
      case 'textarea':
        // Check if the textarea has nested fields (like address)
        if (field.fields && Array.isArray(field.fields)) {
          return (
            <Box key={field.fieldName} style={{ width: '100%' }}>
              <label style={labelStyles}>{label}</label>
              <div style={{ display: 'flex',  flexWrap: 'wrap' }}>
              {field.fields.map((subField) => (
                <FormControl key={subField.fieldName} className='details_page_inputs' style={formControlStyles} error={!!formErrors[subField.fieldName]}>
                  <label  style={labelStyles}>{subField.label}</label>
                  <TextField
                    className='edit-field-input'
                    name={`${field.fieldName}.${subField.fieldName}`}  // Nested name
                    placeholder={subField.placeholder || 'Not Specified'}
                    fullWidth
                    value={formData[field.fieldName]?.[subField.fieldName] || ''}
                    onChange={(e) => handleInputChange(e, `${field.fieldName}.${subField.fieldName}`)}
                    sx={{
                      width: '50%',
                      textAlign: 'left',
                      color: '#666',
                      fontSize: '12px',
                    }}
                    type={subField.type || 'text'}
                    error={!!formErrors[`${field.fieldName}.${subField.fieldName}`]}
                    helperText={formErrors[`${field.fieldName}.${subField.fieldName}`]}
                  />
                </FormControl>
              ))}
              </div>
            </Box>
          );
        }
        // Regular textarea field (non-nested)
        return (
          <FormControl className='details_page_inputs' key={field.fieldName} style={formControlStyles} error={!!isError}>
            <label style={labelStyles}>{label}</label>
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
          <FormControl className='details_page_inputs' key={field.fieldName} style={formControlStyles} error={!!isError}>
            <label style={labelStyles}>{label}</label>
            <Select
              className='edit-field-input'
              {...commonProps}
              value={formData[field.fieldName] || ''} 
              style={{
                width: '50%',
                textAlign: 'left',
                color: '#666',
                fontSize: '12px',
              }}
              displayEmpty
            >
              <MenuItem className='edit-field-input-select' disabled value="">
                Select an option
              </MenuItem>
              {Array.isArray(field.options) && field.options.map((option, index) => (
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
            className='details_page_inputs'
            
            key={field.fieldName}
            control={
              <div style={{display:'flex', width:'100%', alignItems:'center'}}>
              <label style={labelStyles}>{label}</label>
              <Checkbox
               style={{
                color: '#666',
              }}
                className='edit-field-input'
                name={field.fieldName}
                checked={formData[field.fieldName] || false}
                onChange={(e) => handleInputChange(e, field.fieldName)}
              />
              </div>
            }
            
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
          <FormControl className='details_page_inputs' key={field.fieldName} style={formControlStyles} error={!!isError}>
            <label style={labelStyles}>{label}</label>
            <TextField
              className='edit-field-input'
              {...commonProps}
              style={{
                width: '50%',
                textAlign: 'left',
                color: '#666',
                fontSize: '12px',
              }}
            />
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

export default EditComponent;