import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config';
import { headers } from '../atoms/Authorization';

const SelectedEditComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedData } = location.state || {};

  const [editedData, setEditedData] = useState(selectedData || []);
  const [webformsData, setWebformsData] = useState([]);

  const [globalSelects, setGlobalSelects] = useState({
    assigned_to: '',
    lead_medium: '',
    lead_status: '',
    lead_source: '',
  });

  useEffect(() => {
    if (selectedData) {
      setEditedData(selectedData);
      setGlobalSelects({
        assigned_to: '',
        lead_medium: '',
        lead_status: '',
        lead_source: '',
      });
    }
  }, [selectedData]);

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
    []
  );

  useEffect(() => {
    const fetchWebformsData = async () => {
      try {
        const apiUrl = `${config.apiUrl.replace(/\/$/, "")}/webforms`;
        const response = await fetchDataWithRetry(apiUrl);
        const fetchedWebformsData = response.data || [];
        const currentPage = fetchedWebformsData.find((page) => page.pageName === "leads");
        setWebformsData(currentPage.fields);
      } catch (error) {
        console.error("Error fetching Webform data:", error);
      }
    };
    fetchWebformsData();
  }, [fetchDataWithRetry]);

  if (!selectedData) {
    return <p>No data to edit</p>;
  }

  const handleGlobalChange = (field, value) => {
    const updatedData = editedData.map((row) => {
      if (row[field] === value) return row;
      return { ...row, [field]: value };
    });
    setEditedData(updatedData);
  };

  const handleSelectChange = (field, value) => {
    setGlobalSelects((prev) => ({ ...prev, [field]: value }));
    handleGlobalChange(field, value);
  };

  const saveChanges = async () => {
    try {
      if (editedData && editedData.length > 0) {
        for (const row of editedData) {
          const originalRow = selectedData.find((r) => r._id === row._id) || {};
          const changedValues = Object.keys(row).reduce((acc, key) => {
            if (row[key] !== originalRow[key]) {
              acc[key] = row[key];
            }
            return acc;
          }, {});
          const dataToSend = {
            pageName: row.pageName,
            pageId: row.pageId,
            ...changedValues,
          };
          if (Object.keys(changedValues).length === 0) {
            console.log(`Skipping row ${row._id} as there are no changes.`);
            continue;
          }
          await axios.put(
            `${config.apiUrl}/appdata/${row._id}`,
            dataToSend,
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

  const getOptions = (fieldName) => {
    return webformsData.find((field) => field.fieldName === fieldName)?.options
      ?.filter(opt => opt.trim() !== "")
      || [];
  };

  return (
    <div>
      <div style={{ width: "100%" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          background: "#F5BD71",
          color: "black",
          height: "65px",
        }}>
          <div style={{ alignContent: 'center' }}>
            <h2 className='details_page_heading' style={{ margin: "auto 40px", textTransform: 'capitalize' }}>
              Edit Selected Rows
            </h2>
            <div style={{ margin: '10px 20px 10px 40px', borderBottom: '2px solid black' }}></div>
          </div>
        </div>
      </div>

      <div style={{ padding: '50px' }}>
        {/* Assigned To */}
        <label>Assigned To:</label>
        <select
          style={{ width: '50%' }}
          value={globalSelects.assigned_to}
          onChange={(e) => handleSelectChange('assigned_to', e.target.value)}
        >
          <option value="" disabled>Select Assigned To</option>
          {getOptions('assigned_to').map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>

        {/* Lead Medium */}
        <label>Lead Medium:</label>
        <select
          style={{ width: '50%' }}
          value={globalSelects.lead_medium}
          onChange={(e) => handleSelectChange('lead_medium', e.target.value)}
        >
          <option value="" disabled>Select Lead Medium</option>
          {getOptions('lead_medium').map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>

        {/* Lead Status */}
        <label>Lead Status:</label>
        <select
          style={{ width: '50%' }}
          value={globalSelects.lead_status}
          onChange={(e) => handleSelectChange('lead_status', e.target.value)}
        >
          <option value="" disabled>Select Lead Status</option>
          {getOptions('lead_status').map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>

        {/* Lead Source */}
        <label>Lead Source:</label>
        <select
          style={{ width: '50%' }}
          value={globalSelects.lead_source}
          onChange={(e) => handleSelectChange('lead_source', e.target.value)}
        >
          <option value="" disabled>Select Lead Source</option>
          {getOptions('lead_source').map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>

        {/* Save Button */}
        <button
          style={{
            display: 'flex',
            margin: '20px 5px 0',
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
