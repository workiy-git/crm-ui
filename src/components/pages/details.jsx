import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import axios from 'axios';
import config from '../../config/config';
import DetailsTab from '../organism/details-tab';
import UpdatesTimeline from '../molecules/user-update';

const DetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData, schema, pageName } = location.state;
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;
      try {
        const response = await axios.get(apiUrl);
        setFormData(response.data);
        setOriginalData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (rowData) {
      setFormData(rowData);
      setOriginalData(rowData);
    } else {
      fetchData();
    }
  }, [id, rowData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const { _id, ...updateData } = formData;
    const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;

    // Fetch the current data from the database to get the existing updates
    let existingUpdates = [];
    try {
      const response = await axios.get(apiUrl);
      existingUpdates = response.data.updates || [];
    } catch (error) {
      console.error('Error fetching existing updates:', error);
    }

    // Prepare the new updates
    const newUpdates = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== originalData[key]) {
        acc.push({
          field: key,
          oldValue: originalData[key],
          newValue: formData[key],
          updatedBy: 'User Name', // Replace with the actual user name or ID
          updatedAt: new Date().toISOString(),
          status: 'Updated'
        });
      }
      return acc;
    }, []);

    // Combine existing updates with new updates
    const combinedUpdates = [...existingUpdates, ...newUpdates];

    // Add the combined updates to the updateData
    updateData.updates = combinedUpdates;

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

  return (
    <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden' }}>
      <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden' }}>
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#212529', color: 'white', height: '150px' }}>
            <h2 style={{ margin: '20px', borderBottom: '10px solid #FFC03D', height: 'fit-content', padding: '5px' }}>
              {pageName} Details
            </h2>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '5%' }}>
              <button onClick={handleCancel} style={{ height: 'fit-content', padding: '8px 30px', marginRight: '15px', background: 'none', borderRadius: '5px', border: '1px solid white', color: 'white' }} variant="contained">
                Close
              </button>
              <button onClick={handleSave} style={{
                height: 'fit-content',
                marginLeft: '15px',
                background: '#FFC03D',
                color: 'black',
                padding: '8px 30px',
                borderRadius: '5px',
              }}>
                Save
              </button>
            </Box>
          </div>
          <div style={{ display: 'flex', height: '70%', width: '100%' }}>
            <div style={{ height: '100%', width: '50%', margin: '20px', border: '1px solid gray', borderRadius: '10px', position: 'relative', marginTop: '-35px', background: 'white' }}>
              <div style={{ padding: '10px 20px', borderBottom: '1px solid gray', fontWeight: 'bold', fontSize: '20px', textTransform: 'capitalize' }}>{pageName} information</div>
              <div style={{ height: '90%', overflow: 'auto' }}>
                <div style={{ padding: '20px' }}>
                  {schema.map((field) => (
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }} key={field.fieldName}>
                      <label style={{ alignContent: 'center' }}>
                        {field.required ? `${field.label} *` : field.label}
                      </label>
                      <input
                        required={field.required}
                        style={{ height: '40px', width: '50%', borderRadius: '5px' }}
                        name={field.fieldName}
                        value={formData[field.fieldName] || ''}
                        onChange={handleInputChange}
                        type="text"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: "space-around", width: '100%', overflow: 'hidden', marginTop: '-35px' }}>
              <DetailsTab />
              <UpdatesTimeline />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
