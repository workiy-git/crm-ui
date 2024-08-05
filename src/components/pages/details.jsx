import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormControl,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import config from '../../config/config';
import Tab from '../organism/details-tab';

const DetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData, schema = [], pageName, mode } = location.state || {};

  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [webformsData, setWebformsData] = useState([]);
  const [pageSchema, setPageSchema] = useState([]);
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [validationError, setValidationError] = useState('');

  const initializeFormData = useCallback((data, schema) => {
    const initialData = {};
    schema.forEach((field) => {
      initialData[field.fieldName] = data[field.fieldName] || '';
    });
    return initialData;
  }, []);

  useEffect(() => {
    const fetchWebformsData = async () => {
      try {
        const response = await axios.get(`${config.apiUrl.replace(/\/$/, '')}/webforms`);
        const fetchedWebformsData = response.data.data;
        setWebformsData(fetchedWebformsData || []);

        const currentPage = fetchedWebformsData.find((page) => page.pageName === pageName);
        if (!currentPage) {
          setError(`Page ${pageName} not found in webforms collection.`);
          return;
        }

        const pageSchema = currentPage.fields;
        setPageSchema(pageSchema);

        if (rowData) {
          const initialFormData = initializeFormData(rowData, pageSchema);
          setFormData(initialFormData);
        } else {
          const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;
          const response = await axios.get(apiUrl);
          const fetchedData = response.data;

          const initialFormData = initializeFormData(fetchedData, pageSchema);
          setFormData(initialFormData);
        }
      } catch (error) {
        setError('Error fetching webforms data');
      }
    };

    fetchWebformsData();
  }, [id, rowData, pageName, initializeFormData]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
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
      error: !!isError,
      helperText: isError && formErrors[field.fieldName],
      InputProps: {
        readOnly: !isEditing,
      },
    };

    switch (field.htmlControl) {
      case 'input':
        return (
          <FormControl key={field.fieldName} style={{ width: '100%', marginBottom: '16px', display: 'flex', flexDirection: 'row' }} error={!!isError}>
            <label style={{ width: '40%' }} shrink="true">{label}</label>
            <TextField {...commonProps} style={{ width: '40%' }} type={field.type || 'text'} />
          </FormControl>
        );
      case 'select':
        return (
          <FormControl key={field.fieldName} style={{ width: '100%', marginBottom: '16px', display: 'flex', flexDirection: 'row' }} error={!!isError}>
            <label style={{ width: '40%' }} shrink="true">{label}</label>
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
                checked={!!value}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            }
            label={label}
            style={{ width: '100%', marginBottom: '16px' }}
          />
        );
      default:
        return (
          <FormControl key={field.fieldName} style={{ width: '100%', marginBottom: '16px', display: 'flex', flexDirection: 'row' }} error={!!isError}>
            <label style={{ width: '40%' }} shrink="true">{label}</label>
            <TextField {...commonProps} style={{ width: '40%' }} />
          </FormControl>
        );
    }
  };

  const validateForm = () => {
    const errors = {};
    let hasErrors = false;

    pageSchema.forEach((field) => {
      if (field.required && !formData[field.fieldName]) {
        errors[field.fieldName] = `${field.fieldName} is mandatory`;
        hasErrors = true;
      }
    });

    setFormErrors(errors);
    return !hasErrors;
  };

  const handleEdit = async () => {
    if (!validateForm()) {
      setValidationError('Please fill all mandatory fields');
      return;
    }

    const { _id, ...updateData } = formData; // Exclude _id from form data
    const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;
    try {
      await axios.put(apiUrl, updateData);
      setSuccess('Data updated successfully');
      setTimeout(() => {
        navigate('/grid'); // Redirect to the grid page
      }, 2000); // Show success message for 2 seconds before redirecting
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Error updating data');
    }
  };

  const handleEditClick = () => {
    if (isEditing) {
      handleEdit();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#212529', color: 'white', height: '65px' }}>
            <h2 style={{ margin: 'auto 20px', borderBottom: '10px solid #FFC03D', height: 'fit-content', padding: '5px', textTransform: 'capitalize' }}>
              {pageName} Details View
            </h2>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '5%' }}>
              <Button style={{ height: 'fit-content', padding: '2px 15px', marginRight: '30px', background: 'none', borderRadius: '5px', border: '1px solid white', color: 'white' }} variant="contained">
                <AddCircleOutlineIcon /> &nbsp; ADD
              </Button>
              <Button style={{ height: 'fit-content', padding: '2px 15px', marginRight: '15px', background: 'none', borderRadius: '5px', border: '1px solid white', color: 'white' }} variant="contained" onClick={handleEditClick}>
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </Box>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '90%' }}>
            <div style={{ margin: '10px', width: '70%', border: '1px solid gray', borderRadius: '10px', position: 'relative', background: 'white' }}>
              <div style={{ padding: '10px 20px', borderBottom: '1px solid gray', fontWeight: 'bold', fontSize: '20px', textTransform: 'capitalize' }}>{pageName} information</div>
              <div>
                <Box style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '5px' }}>
                  <div style={{ margin: 'auto 20px' }}>
                    CT : <span style={{ fontWeight: 'bold' }}>{formData.created_time || 'N/A'}</span>
                  </div>
                </Box>
              </div>
              <div style={{ height: '75%', overflow: 'auto' }}>
                <Box sx={{ m: 2 }}>
                  {error && (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                      <Alert severity="error" onClose={() => setError('')}>
                        {error}
                      </Alert>
                    </Stack>
                  )}
                  {success && (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                      <Alert severity="success" onClose={() => setSuccess('')}>
                        {success}
                      </Alert>
                    </Stack>
                  )}
                  {validationError && (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                      <Alert severity="warning" onClose={() => setValidationError('')}>
                        {validationError}
                      </Alert>
                    </Stack>
                  )}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    {pageSchema.map((field) => renderInputField(field))}
                  </Box>
                  {mode === 'details' && (
                    <Button variant="contained" color="primary" startIcon={<ModeEditOutlinedIcon />} onClick={handleEditClick} sx={{ mt: 2 }}>
                      Edit
                    </Button>
                  )}
                </Box>
              </div>
            </div>
            <div style={{ margin: '10px', display: 'flex', justifyContent: 'space-around', width: '50%', overflow: 'hidden' }}>
              <Tab />
            </div>
          </div>
        </div>
      </div>

      <Dialog>
        <DialogTitle>
          Add New {pageName}
          <IconButton edge="end" color="inherit" aria-label="close" style={{ position: 'absolute', right: 8, top: 8, color: 'gray' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogActions>
          <Button color="primary">Cancel</Button>
          <Button color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DetailsPage;
