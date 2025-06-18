import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import config from '../../config/config';
import { headers } from '../atoms/Authorization';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AddComponent = forwardRef(({ formData, setFormData, pageSchema, onSaveSuccess, onSaveError, pageName, pageId }, ref) => {
  const [validationError, setValidationError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [moduleValue, setModuleValue] = useState('');
  const [fields, setFields] = useState([]);

  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [jwtToken, setJwtToken] = useState("");
  const [userName, setUserName] = useState("");
  const profileRef = useRef(null); // Create a reference for the popup

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      setJwtToken(token);
      const decodedToken = jwtDecode(token);
      const user = decodedToken.username;

      axios
        .post(
          `${config.apiUrl}/appdata/retrieve`,
          [
            {
              $match: {
                pageName: "users",
                username: user,
              },
            },
          ],
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
              Access: "true",
            },
          }
        )
        .then((response) => {
          setUserData(response.data.data[0]);
          setUserName(user);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      // Redirect or handle the absence of the token as needed
      navigate("/login"); // Redirect to login if no token found
    }
  }, [navigate]);


  // Initialize formData with default values based on schema
  useEffect(() => {
    if (
      (!formData || Object.keys(formData).length === 0) &&
      userData?.role && userName // Wait until userData and userName are available
    ) {
      const initializedFormData = {};
      pageSchema.forEach(field => {
        if (field.fieldName === 'assigned_to' &&
            (userData.role === 'Presales Team' || userData.role === 'Sales Team')) {
          initializedFormData[field.fieldName] = userName;
          
        }else if (field.fieldName === 'created_by' &&
            (userData.role === 'Presales Team' || userData.role === 'Sales Team')) {
          initializedFormData[field.fieldName] = userName;
          
        } else if (field.type === 'checkbox') {
          initializedFormData[field.fieldName] = false;
        } else if (field.type === 'select') {
          initializedFormData[field.fieldName] = '';
        } else if (field.type === 'datetime-local') {
          const currentDate = new Date();
          initializedFormData[field.fieldName] = currentDate.toISOString().slice(0, 16);
        } else {
          initializedFormData[field.fieldName] = '';
        }
      });
      setFormData(initializedFormData);
    }
  }, [formData, setFormData, pageSchema, userData, userName]);
  
  

  useEffect(() => {
    if (moduleValue) {
      fetchWebforms();
    }
  }, [moduleValue]);

  const fetchWebforms = async () => {
    try {
      const response = await axios.get(`${config.apiUrl.replace(/\/$/, '')}/webforms`, {headers});
      const webforms = response.data;

      // Find the webform with the matching pageName
      const selectedWebform = webforms.find(webform => webform.pageName === moduleValue);

      if (selectedWebform) {
        // Extract fields under the selected pageName
        setFields(selectedWebform.fields || []);
      } else {
        setFields([]);
      }
    } catch (error) {
      console.error('Error fetching webforms:', error);
    }
  };

  const validateField = (fieldName, value) => {
    const fieldSchema = pageSchema.find(field => field.fieldName === fieldName);
    let error = "";

    if (!fieldSchema) return "";

    if (fieldSchema.required && !value ) {
      error = `${fieldSchema.label || fieldName} is required.`;
    }

    if (fieldSchema.pattern && value) {
      const regex = new RegExp(fieldSchema.pattern);
      if (!regex.test(value)) {
        error = `${fieldSchema.validationMessage || 'Invalid value'}`;
      }
    }

    return error;
  };

  const validateForm = () => {
    let hasErrors = false;
    const errors = {};

    pageSchema.forEach((field) => {
      const fieldValue = formData[field.fieldName];
      const error = validateField(field.fieldName, fieldValue);
      if (error) {
        errors[field.fieldName] = error;
        hasErrors = true;
      }
    });

    setFormErrors(errors);
    setValidationError(hasErrors ? 'Please fill all mandatory fields correctly' : '');
    return !hasErrors;
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    // Update form data and validate
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: fieldValue };
      // Validate this field only
      const error = validateField(name, fieldValue);
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
      return newData;
    });
  };

  useImperativeHandle(ref, () => ({
    validateForm,
  }));

  const handleSave = async () => {
    if (!validateForm()) {
      onSaveError('Please fill all mandatory fields correctly');
      return;
    }

    try {
      const dataToSend = { pageName, pageId, ...formData };
      await axios.post(`${config.apiUrl}/appdata/create`, dataToSend , {headers: headers});
      onSaveSuccess('Data added successfully!');
    } catch (error) {
      onSaveError('Error adding data.');
      console.error('Error adding data:', error);
    }
  };

  const renderInputField = (field) => {
    const isFileInput = field.type === 'file';
    let value = !isFileInput && (formData[field.fieldName] === 'N/A' ? '' : formData[field.fieldName] || '');
  
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

    
    if (field.type === 'datetime-local') {
      // Convert UTC time to local time for display
      const utcValue = formData[field.fieldName];
      console.log("utc", utcValue)
      const localValue = utcValue ? new Date(utcValue + 'Z').getTime() + (5.5 * 60 * 60 * 1000) : ''; 
      const formattedLocalValue = localValue ? new Date(localValue).toISOString().slice(0, 16) : '';
      console.log("formattedLocalValue", formattedLocalValue)

      console.log("local", localValue)
      
  
      return (
        <FormControl
          className='details_page_inputs'
          key={field.fieldName}
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '50%' }}
          error={!!isError}
        >
          <label style={{ width: '40%', textAlign: 'left' }}>{label}</label>
          <TextField
            className='valuefield edit-field-input'
            {...commonProps}
            value={formattedLocalValue}
            type="datetime-local"
            disabled={field.display === 'disable'}
          />
        </FormControl>
      );
    }
  
    if (!isFileInput) {
      commonProps.value = value;
    }
  
    switch (field.htmlControl) {
      case 'input':
        return (
          <FormControl className='details_page_inputs' key={field.fieldName} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '50%' }} error={!!isError}>
            <label style={{ width: '40%', textAlign: 'left' }}>{label}</label>
            <TextField className='valuefield edit-field-input' {...commonProps} type={field.type || 'text'} />
          </FormControl>
        );
      case 'select':
        return (
          <FormControl className='details_page_inputs' key={field.fieldName} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '50%' }} error={!!isError}>
            <label style={{ width: '40%', textAlign: 'left' }}>{label}</label>
            <div style={{ width: '50%'}}>
            <Select disabled={field.display === 'disable' || field.display === 'none'} style={{width:'100% !important'}} className='edit-field-input' {...commonProps} displayEmpty>
              <MenuItem value="">
                <em>{field.placeholder || 'Select an option'}</em>
              </MenuItem>
              {field.options && field.options.map((option, index) => (
                <MenuItem className='edit-field-input-select' key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {isError && <div style={{ color: 'red', fontSize: '12px' }}>{formErrors[field.fieldName]}</div>}
            </div>
          </FormControl>
        );
      case 'checkbox':
        return (
          <FormControlLabel
            className='details_page_inputs'
            key={field.fieldName}
            control={
              <Checkbox className='edit-field-input' name={field.fieldName} checked={formData[field.fieldName] || false} onChange={handleInputChange} />
            }
            label={label}
            style={{ width: '50%', margin: '0' }}
          />
        );
      default:
        return (
          <FormControl className='details_page_inputs' key={field.fieldName} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '50%' }} error={!!isError}>
            <label style={{ width: '40%', textAlign: 'left' }}>{label}</label>
            <TextField className='valuefield edit-field-input' {...commonProps} />
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
