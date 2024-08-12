import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import axios from 'axios';
import config from '../../config/config';
import EditComponent from '../organism/edit';
import ViewComponent from '../organism/view';
import ConfirmationDialog from '../molecules/confirmation-dialog'; 
import AlertWrapper from '../organism/alert'; 
import Tab from '../organism/details-tab';

const DetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData, pageName, pageId, mode } = location.state || {};

  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [webformsData, setWebformsData] = useState([]);
  const [pageSchema, setPageSchema] = useState([]);
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [isAdding, setIsAdding] = useState(!id && mode !== 'edit'); 
  const [refreshTab, setRefreshTab] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); 

  const initializeFormData = useCallback((data, schema) => {
    const initialData = {};
    schema.forEach((field) => {
      initialData[field.fieldName] = data[field.fieldName] || "";
    });
    return initialData;
  }, []);

  useEffect(() => {
    const fetchWebformsData = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl.replace(/\/$/, "")}/webforms`
        );
        const fetchedWebformsData = response.data.data;
        setWebformsData(fetchedWebformsData || []);

        const currentPage = fetchedWebformsData.find(
          (page) => page.pageName === pageName
        );
        if (!currentPage) {
          setError(`Page ${pageName} not found in webforms collection.`);
          return;
        }

        const pageSchema = currentPage.fields;
        setPageSchema(pageSchema);

        if (rowData) {
          const initialFormData = initializeFormData(rowData, pageSchema);
          setFormData(initialFormData);
        } else if (id) {
          const apiUrl = `${config.apiUrl.replace(/\/$/, "")}/appdata/${id}`;
          const response = await axios.get(apiUrl);
          const fetchedData = response.data;

          const initialFormData = initializeFormData(fetchedData, pageSchema);
          setFormData(initialFormData);
        }
      } catch (error) {
        setError("Error fetching webforms data");
      }
    };

    fetchWebformsData();
  }, [id, rowData, pageName, initializeFormData]);

  const handleSaveSuccess = (message) => {
    setSuccess(message);
    setError("");
    setIsEditing(false);
    setIsAdding(false);
    setRefreshTab(prev => !prev);
    setTimeout(() => {
      setSuccess("");
    }, 2000);
  };

  const handleSaveError = (message) => {
    setError(message);
    setSuccess("");
    setTimeout(() => {
      setError("");
    }, 2000);
  };

  const handleDeleteSuccess = () => {
    setSuccess("Data deleted successfully");
    setTimeout(() => {
      navigate(`/container/${pageName}`); 
    }, 2000);
  };

  const handleDeleteError = (message) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 2000);
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setFormData({});
    setIsEditing(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const apiUrl = `${config.apiUrl.replace(/\/$/, "")}/appdata/${id}`;
      await axios.delete(apiUrl);
      handleDeleteSuccess();
    } catch (error) {
      handleDeleteError("Error deleting data");
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSave = async () => {
    if (!formData) return;

    if (!validateForm()) return; 

    try {
      const dataToSend = { pageName, pageId, ...formData };
      if (isAdding) {
        await axios.post(`${config.apiUrl}/appdata/create`, dataToSend);
      } else {
        await axios.put(`${config.apiUrl}/appdata/${id}`, dataToSend);
      }
      handleSaveSuccess("Data saved successfully!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      handleSaveError("Error saving data.");
      console.log("Error saving data:", error);
    }
  };

  const handleValidationError = (errors) => {
    if (errors) {
      setError('Please fix the errors before saving.');
    } else {
      setError('');
    }
  };

  const validateForm = () => {
    return pageSchema.every(field => {
      return !field.required || (formData[field.fieldName] && formData[field.fieldName].trim() !== '');
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
        <div style={{ width: "100%", overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              background: "#212529",
              color: "white",
              height: "65px",
            }}
          >
            <h2 style={{ margin: "auto 20px" }}>{pageName} Details Page</h2>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "5%",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                style={{margin:'5px'}}
                onClick={() => navigate(`/container/${pageName}`)}
              >
                Back
              </Button>
            </Box>
          </div>
          <div style={{ display: "flex", overflow: "hidden", height: "90%" }}>
            <div
              style={{
                margin: "10px",
                width: "75%",
                border: "1px solid gray",
                borderRadius: "10px",
                position: "relative",
                background: "white",
              }}
            >
              <div
                style={{
                  padding: "10px 20px",
                  borderBottom: "1px solid gray",
                  fontWeight: "bold",
                  fontSize: "20px",
                  textTransform: "capitalize",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>{pageName} information</div>
                <Box
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "5%",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddNew}
                style={{margin:'5px'}}
              >
                Add
              </Button>
              {!isAdding && !isEditing && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                style={{margin:'5px'}}
                >
                  Edit
                </Button>
              )}
              {(isEditing || isAdding) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                style={{margin:'5px'}}
                >
                  Save
                </Button>
              )}
              <Button
                variant="contained"
                color="error"
                onClick={handleOpenDialog}
              >
                Delete
              </Button>
            </Box>
              </div>
              <div>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    padding: "5px",
                  }}
                >
                  <div style={{ margin: "auto 20px" }}>
                    CT :{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {formData?.created_time || "N/A"}
                    </span>
                  </div>
                </Box>
              </div>
              <div style={{ height: "75%", overflow: "auto" }}>
                <Box sx={{ m: 2 }}>
                  {error && (
                    <Stack sx={{ width: "100%" }} spacing={2}>
                      <AlertWrapper type="error" message={error} />
                    </Stack>
                  )}
                  {success && (
                    <Stack sx={{ width: "100%" }} spacing={2}>
                      <AlertWrapper type="success" message={success} />
                    </Stack>
                  )}
                  {isEditing ? (
                    <EditComponent
                      id={isAdding ? null : id}
                      formData={formData}
                      setFormData={setFormData}
                      pageSchema={pageSchema}
                      onValidationError={handleValidationError}
                      pageName={pageName}
                      pageId={pageId}
                    />
                  ) : (
                    <ViewComponent
                      formData={formData}
                      pageSchema={pageSchema}
                    />
                  )}
                </Box>
              </div>
            </div>
            <div style={{ margin: '10px', display: 'flex', justifyContent: 'space-around', width: '50%', overflow: 'hidden' }}>
              <Tab mode={isAdding ? 'add' : 'view'} key={refreshTab} />
            </div>
          </div>
        </div>
      </div>
      <ConfirmationDialog
        open={isDialogOpen}
        title="Confirm Deletion"
        content="Are you sure you want to delete this item?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDialog}
      />
    </div>
  );
};

export default DetailsPage;
