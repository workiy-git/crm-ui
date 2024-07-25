import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import axios from 'axios';
import config from '../../config/config';
import Tab from '../organism/details-tab';

const DetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData, schema, pageName } = location.state;
  const [formData, setFormData] = useState({});
  const [pageId, setPageId] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch the pageId and userId based on the pageName
    const fetchPageData = async () => {
      try {
        const response = await axios.get(`${config.apiUrl.replace(/\/$/, '')}/webforms`, {
          params: { pageName }
        });
        const page = response.data.find(p => p.pageName === pageName);
        if (page) {
          setPageId(page.PageId); // Use PageId from webforms collection
        }
      } catch (error) {
        console.error('Error fetching page ID:', error);
      }
    };

    // Fetch the user details and page data
    const fetchData = async () => {
      try {
        const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;
        const response = await axios.get(apiUrl);
        setFormData(response.data);

        // Extract pageId and userId from the response
        setPageId(response.data.PageId); // PageId from appdata
        setUserId(response.data._id); // UserId from appdata
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPageData();

    if (rowData) {
      setFormData(rowData);
      setPageId(rowData.PageId); // PageId from rowData
      setUserId(rowData._id); // UserId from rowData
    } else {
      fetchData();
    }
  }, [id, rowData, pageName]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const { _id, ...updateData } = formData;
    const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;

    try {
      await axios.put(apiUrl, updateData);

      // Create update history entries for each changed field
      const updateHistoryEntries = Object.keys(updateData).map((field) => {
        if (updateData[field] !== rowData[field]) {
          return {
            pageName,
            field,
            pageId,
            userId, // Include userId in update history
            changedBy: 'presales_user',
            oldValue: rowData[field],
            newValue: updateData[field],
            updatedAt: new Date().toISOString(),
          };
        }
        return null;
      }).filter(entry => entry !== null); // Remove null entries

      if (updateHistoryEntries.length > 0) {
        const updateHistoryApiUrl = `${config.apiUrl.replace(/\/$/, '')}/userinfoupdates`;
        await axios.post(updateHistoryApiUrl, updateHistoryEntries);
      }

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
            <h2 style={{ margin: '20px', borderBottom: '10px solid #FFC03D', height: 'fit-content', padding: '5px', textTransform: 'capitalize' }}>
              {pageName} Details
            </h2>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '5%' }}>
              <button onClick={handleCancel} style={{ height: 'fit-content', padding: '8px 30px', marginRight: '15px', background: 'none', borderRadius: '5px', border: '1px solid white', color: 'white' }} variant="contained">
                Close
              </button>
              <button onClick={handleSave} style={{ height: 'fit-content', marginLeft: '15px', background: '#FFC03D', color: 'black', padding: '8px 30px', borderRadius: '5px' }}>
                Save
              </button>
            </Box>
          </div>
          <div style={{ display: 'flex', height: '70%' }}>
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
              <Tab />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
