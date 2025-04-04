import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config';
import { headers } from '../atoms/Authorization'

const SelectedEditComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedData } = location.state || {}; // Retrieve selected data
  const [editedData, setEditedData] = useState(selectedData || []);
  const [webformsData, setWebformsData] = useState([]);

  const fetchDataWithRetry = useCallback(
    async (url, retryCount = 3) => {
      try {
        const response = await axios.get(url, { headers });
        return response.data;
      } catch (error) {
        if (retryCount > 0) {
          console.warn("Retrying request, attempts left:", retryCount);
          return fetchDataWithRetry(url, retryCount - 1);
        } else {
          throw error;
        }
      }
    },
    [] // No dependencies, so it's memoized only once
  );
  
  useEffect(() => {
    const fetchWebformsData = async () => {
      try {
        const apiUrl = `${config.apiUrl.replace(/\/$/, "")}/webforms`;
        const response = await fetchDataWithRetry(apiUrl);
        const fetchedWebformsData = response.data || [];
        const currentPage = fetchedWebformsData.find((page) => page.pageName === "leads");
        setWebformsData(currentPage.fields);
        console.log("Webform Data:", currentPage.fields);
        } catch (error) {
        console.error("Error fetching Webform data:", error);
        }
    };
    fetchWebformsData();
    }, [fetchDataWithRetry]);


  if (!selectedData) {
    return <p>No data to edit</p>;
  }
  
  // Handle changes to fields (Assigned To or Lead Medium) and update all rows
  const handleGlobalChange = (field, value) => {
    const updatedData = editedData.map((row) => ({
      ...row,
      [field]: value,
    }));
    setEditedData(updatedData);
  };

  const saveChanges = async () => {
    try {
      console.log("Updated Data:", editedData);
  
      if (editedData && editedData.length > 0) {
        for (const row of editedData) {
          const originalRow = selectedData.find((r) => r._id === row._id) || {};
          
          // Extract only changed fields
          const changedValues = Object.keys(row).reduce((acc, key) => {
            if (row[key] !== originalRow[key]) {
              acc[key] = row[key]; // Add only modified fields
            }
            return acc;
          }, {});
  
          // Ensure we send required fields along with changes
          const dataToSend = {
            pageName: row.pageName,
            pageId: row.pageId,
            ...changedValues, // Only changed values will be sent
          };
  
          if (Object.keys(changedValues).length === 0) {
            console.log(`Skipping row ${row._id} as there are no changes.`);
            continue; // Skip API call if nothing changed
          }
  
          console.log("Updating Row ID:", row._id, "with Data:", dataToSend);
  
          await axios.put(
            `${config.apiUrl}/appdata/${row._id}`,
            dataToSend, // Send only changed fields
            { headers }
          );
  
          console.log(`Row with _id ${row._id} successfully updated`);
        }
      }
  
      alert("All rows updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error.response?.data || error);
      alert("Failed to save changes. Please try again.");
    }
  };
  
  
  const leadMediumField = webformsData.find((field) => field.fieldName === "lead_medium");
  const leadMediumOptions = leadMediumField?.options || [];

  const assignedToField = webformsData.find((field) => field.fieldName === "assigned_to");
  const assignedToOptions = assignedToField?.options || [];

  const leadStatusField = webformsData.find((field) => field.fieldName === "lead_status");
  const leadStatusOptions = leadStatusField?.options || []; 

  const leadSourceField = webformsData.find((field) => field.fieldName === "lead_source");
  const leadSourceOptions = leadSourceField?.options || [];

  return (
    <div>
      <div style={{ width: "100%", }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              background: "#F5BD71",
              color: "black",
              height: "65px",
            }}
          >
            <div style={{alignContent:'center'}}>
              <div>
            <h2 className='details_page_heading' style={{ margin: "auto 40px", textTransform:'capitalize'}}>Edit Selected Rows</h2>
            <div style={{margin:'10px 20px 10px 40px', borderBottom:'2px solid black' }}></div>
            </div>
            </div>
            </div>
            </div>
      {/* <h2>Edit Selected Rows</h2> */}
      <div style={{ padding: '50px' }}>
        <label>
          Assigned To:
        </label>
        <select
          style={{width:'50%'}}
            value={editedData[0]?.assigned_to || ''} // Use the first row's value
            onChange={(e) => handleGlobalChange('assigned_to', e.target.value)}
          >
            <option value="">Assigned To</option>
            {assignedToOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        <br />
        <label>
          Lead Medium:
        </label>
        <select
          style={{width:'50%'}}
            value={editedData[0]?.lead_medium || ''} // Use the first row's value
            onChange={(e) => handleGlobalChange('lead_medium', e.target.value)}
          >
            <option value="">Select Lead Medium</option>
            {leadMediumOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <label>
          Lead Status:
        </label>
        <select
          style={{width:'50%'}}
            value={editedData[0]?.lead_status || ''} // Use the first row's value
            onChange={(e) => handleGlobalChange('lead_status', e.target.value)}
          >
            <option value="">Select Lead Status</option>
            {leadStatusOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <label>
          Lead Source:
        </label>
        <select
          style={{width:'50%'}}
            value={editedData[0]?.lead_source || ''} // Use the first row's value
            onChange={(e) => handleGlobalChange('lead_source', e.target.value)}
          >
            <option value="">Select Lead Source</option>
            {leadSourceOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
     <button
    style={{
        display: 'flex',
        margin: '20px 5px 0', // Combines margin properties
        alignItems: 'center',
        color: 'black',
        background: 'rgba(255, 255, 255, 0.4)',
        height: '35px',
        borderRadius: '10px',
    }}
    onClick={saveChanges}
>
    Save Changes
</button>

      </div>
    </div>
  );
};

export default SelectedEditComponent;
