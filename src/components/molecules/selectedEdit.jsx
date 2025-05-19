import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config';
import { headers } from '../atoms/Authorization';
import { Stack, Alert } from "@mui/material";

const SelectedEditComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedData } = location.state || {};
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

  const [editedData, setEditedData] = useState(selectedData || []);
  const [webformsData, setWebformsData] = useState([]);

  const [globalSelects, setGlobalSelects] = useState({
    assigned_to: '',
    lead_medium: '',
    lead_status: '',
    lead_source: '',
    re_enquired: '',
  });

  const [updateProgress, setUpdateProgress] = useState({
    updated: 0,
    total: 0,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedData) {
      setEditedData(selectedData);
      setGlobalSelects({
        assigned_to: '',
        lead_medium: '',
        lead_status: '',
        lead_source: '',
        re_enquired: '',
      });
      setUpdateProgress({ updated: 0, total: selectedData.length }); // ✅ Set total immediately
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
      setIsSaving(true);
      let updatedCount = 0;
      const totalCount = editedData.length;
      setUpdateProgress({ updated: 0, total: totalCount });

      if (editedData && totalCount > 0) {
        for (const row of editedData) {
          const originalRow = selectedData.find((r) => r._id === row._id) || {};
          const changedValues = Object.keys(row).reduce((acc, key) => {
            if (row[key] !== originalRow[key]) {
              acc[key] = row[key];
            }
            return acc;
          }, {});

          if (Object.keys(changedValues).length === 0) {
            console.log(`Skipping row ${row._id} as there are no changes.`);
            updatedCount += 1;
            setUpdateProgress({ updated: updatedCount, total: totalCount });
            continue;
          }

          const dataToSend = {
            pageName: row.pageName,
            pageId: row.pageId,
            ...changedValues,
          };

          await axios.put(`${config.apiUrl}/appdata/${row._id}`, dataToSend, {
            headers,
          });

          updatedCount += 1;
          setUpdateProgress({ updated: updatedCount, total: totalCount });
          console.log(`Row with _id ${row._id} successfully updated`);
        }
      }

      setSuccess("All changes saved successfully!");
      setTimeout(() => {
        setSuccess('');
        navigate(-1);
      }, 1000);
    } catch (error) {
      console.error("Error updating data:", error.response?.data || error);
      setError("Failed to save changes. Please try again.");
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsSaving(false);
      
    }
  };

  const getOptions = (fieldName) => {
    return webformsData.find((field) => field.fieldName === fieldName)?.options
      ?.filter(opt => opt.trim() !== "")
      || [];
  };

  return (
    <div>
       {(error || success) && (
              <Stack sx={{ width:'100%',position: 'absolute', zIndex: '10'}} spacing={2}>
                <div style={{width:'fit-content', margin:'auto'}}>
                {success && <Alert severity="success">{success}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
                </div>
              </Stack>
            )}
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

        <label>Re Enquired:</label>
        <select
          style={{ width: '50%' }}
          value={globalSelects.re_enquired}
          onChange={(e) => handleSelectChange('re_enquired', e.target.value)}
        >
          <option value="" disabled>Select Lead Source</option>
          {getOptions('re_enquired').map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>

        {/* Live Update Progress */}
        {updateProgress.total > 0 && (
          <p style={{ marginTop: '20px' }}>
            Updated {updateProgress.updated} of {updateProgress.total}
          </p>
        )}

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
            padding: '0 20px',
            cursor: isSaving ? 'not-allowed' : 'pointer'
          }}
          onClick={saveChanges}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default SelectedEditComponent;