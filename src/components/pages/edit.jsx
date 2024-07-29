import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, TextField, Select, MenuItem, Checkbox, FormControlLabel, FormControl } from '@mui/material';
import axios from 'axios';
import config from '../../config/config';

const EditPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData, schema, pageName } = location.state;
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (rowData) {
      setFormData(rowData);
    } else {
      const fetchData = async () => {
        const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;
        try {
          const response = await axios.get(apiUrl);
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [id, rowData]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = async () => {
    const { _id, ...updateData } = formData; // Exclude _id from form data
    const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;
    try {
      await axios.put(apiUrl, updateData);
      alert('Data updated successfully');
      navigate(`/container/${pageName}`);
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Error updating data');
    }
  };

  const handleCancel = () => {
    navigate(`/container/${pageName}`);
  };

  const renderInputField = (field) => {
    let value = formData[field.fieldName] || '';

    if (field.htmlControl === 'input') {
      if (field.type === 'text' || field.type === 'tel' || field.type === 'email') {
        return (
          <TextField
            name={field.fieldName}
            type={field.type}
            value={value}
            placeholder="Not Specified"
            onChange={handleInputChange}
            fullWidth
          />
        );
      }
      if (field.type === 'number') {
        return (
          <TextField
            type="number"
            name={field.fieldName}
            value={value}
            placeholder="Not Specified"
            onChange={handleInputChange}
            fullWidth
          />
        );
      }
      if (field.type === 'date') {
        return (
          <TextField
            type="date"
            name={field.fieldName}
            value={value || ''}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            placeholder="Select"
          />
        );
      }
      if (field.type === 'datetime-local') {
        return (
          <TextField
            type="datetime-local"
            name={field.fieldName}
            value={value || ''}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            placeholder="Select"
          />
        );
      }
      return (
        <TextField
          name={field.fieldName}
          value={value}
          placeholder="Not Specified"
          onChange={handleInputChange}
          fullWidth
        />
      );
    }

    if (field.htmlControl === 'select') {
      return (
        <FormControl fullWidth>
          <Select
            name={field.fieldName}
            value={value}
            onChange={handleInputChange}
            displayEmpty
            renderValue={(selected) => {
              if (selected === '') {
                return <em>Select</em>;
              }
              return selected;
            }}
          >
            <MenuItem value="">
              <em>Select</em>
            </MenuItem>
            {field.options.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    if (field.htmlControl === 'checkbox') {
      return (
        <FormControlLabel
          control={
            <Checkbox
              name={field.fieldName}
              checked={Boolean(value)}
              onChange={handleInputChange}
            />
          }
          label={field.label}
        />
      );
    }

    if (field.htmlControl === 'textarea') {
      return (
        <TextField
          name={field.fieldName}
          value={value}
          placeholder="Not Specified"
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
        />
      );
    }

    return (
      <TextField
        name={field.fieldName}
        value={value}
        placeholder="Not Specified"
        onChange={handleInputChange}
        fullWidth
      />
    );
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden' }}>
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#212529', color: 'white', height: '150px' }}>
            <h2 style={{ margin: '20px', borderBottom: '10px solid #FFC03D', height: 'fit-content', padding: '5px' }}>
              Edit {pageName}
            </h2>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '5%' }}>
              <Button onClick={handleCancel} style={{ height: 'fit-content', padding: '8px 30px', marginRight: '15px', background: 'none', borderRadius: '5px', border: '1px solid white', color: 'white' }} variant="contained">
                Close
              </Button>
              <Button onClick={handleSave} style={{
                height: 'fit-content',
                marginLeft: '15px',
                background: '#FFC03D',
                color: 'black',
                padding: '8px 30px',
                borderRadius: '5px',
              }}>
                Save
              </Button>
            </Box>
          </div>

          <div style={{ height: '70%', margin: '20px', border: '1px solid gray', borderRadius: '10px', position: 'relative', marginTop: '-35px', background: 'white' }}>
            <div style={{ padding: '10px 20px', borderBottom: '1px solid gray', fontWeight: 'bold', fontSize: '20px', textTransform: 'capitalize' }}>{pageName} information</div>
            <div style={{ height: '90%', overflow: 'auto' }}>
              <div style={{ padding: '20px', columnCount: 2 }}>
                {schema.map((field) => (
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }} key={field.fieldName}>
                    <label style={{ alignContent: 'center' }}>
                      {field.required ? `${field.label} *` : field.label}
                    </label>
                    {renderInputField(field)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
