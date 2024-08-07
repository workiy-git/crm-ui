import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Alert, Stack } from '@mui/material';
import axios from 'axios';
import config from '../../config/config';
import Tab from '../organism/details-tab';
import EditComponent from '../organism/edit';
import ViewComponent from '../organism/view';
import DeleteComponent from '../organism/delete';

const DetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData, pageName } = location.state || {};

  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [webformsData, setWebformsData] = useState([]);
  const [pageSchema, setPageSchema] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshTab, setRefreshTab] = useState(false);

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

  const handleSaveSuccess = () => {
    setSuccess('Data updated successfully');
    setIsEditing(false);
    setRefreshTab(prev => !prev);
    setTimeout(() => {
      setSuccess('');
    }, 2000);
  };

  const handleDeleteSuccess = () => {
    setSuccess('Data deleted successfully');
    setTimeout(() => {
      navigate('/grid');
    }, 2000);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#212529', color: 'white', height: '65px' }}>
            <h2 style={{ margin: 'auto 20px' }}>{pageName} Details Page</h2>
            <Box style={{ display: 'flex', alignItems: 'center', marginRight: '5%' }}>
              {!isEditing && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
              <DeleteComponent id={id} onDeleteSuccess={handleDeleteSuccess} />
            </Box>
          </div>
          <div style={{ display: 'flex', overflow: 'hidden', height: '90%' }}>
            <div style={{ margin: '10px', width: '75%', border: '1px solid gray', borderRadius: '10px', position: 'relative', background: 'white' }}>
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
                  {isEditing ? (
                    <EditComponent 
                      id={id}
                      formData={formData}
                      setFormData={setFormData}
                      pageSchema={pageSchema}
                      onSaveSuccess={handleSaveSuccess}
                    />
                  ) : (
                    <ViewComponent formData={formData} pageSchema={pageSchema} />
                  )}
                </Box>
              </div>
            </div>
            <div style={{ margin: '10px', display: 'flex', justifyContent: 'space-around', width: '50%', overflow: 'hidden' }}>
              <Tab key={refreshTab} pageName={pageName}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
