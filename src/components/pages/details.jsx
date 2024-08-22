import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import axios from 'axios';
import config from '../../config/config';
import EditComponent from '../organism/edit';
import ViewComponent from '../organism/view';
import AddComponent from '../organism/add'; 
import ConfirmationDialog from '../molecules/confirmation-dialog'; 
import AlertWrapper from '../organism/alert'; 
import Tab from '../organism/details-tab';
import Whatsapp from '../molecules/whatsapp';
import Email from '../molecules/email';
import Sms from '../molecules/sms';
import '../../assets/styles/style.css';

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
  const [isEditing, setIsEditing] = useState(false); // Initialize as false
  const [isAdding, setIsAdding] = useState(false); 
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

    // Update isEditing and isAdding states based on location changes
    useEffect(() => {
      if (mode === 'edit') {
        setIsEditing(true);
        setIsAdding(false);
      } else if (mode === 'add') {
        setIsAdding(true);
        setFormData({});
        setIsEditing(false);
      } else {
        setIsEditing(false);
        setIsAdding(false);
      }
    }, [location]);

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
      navigate(`/container/${pageName}`); // Ensure this is the correct path to navigate after deletion
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
    setFormData({});  // Clear all form data
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
  
    try {
      const dataToSend = { pageName, pageId, ...formData };
      pageSchema.forEach((field) => {
        if (!dataToSend.hasOwnProperty(field.fieldName)) {
          dataToSend[field.fieldName] = "";  // Set default empty value
        }
      });
  
      if (isAdding) {
        await axios.post(`${config.apiUrl}/appdata/create`, dataToSend);
        handleSaveSuccess("Data Added successfully!");
      
        // Use setTimeout with a callback function to navigate after 2000ms
        setTimeout(() => {
          navigate(`/container/${pageName}`);
        }, 2000); // 2000ms delay
      } else {
        await axios.put(`${config.apiUrl}/appdata/${id}`, dataToSend);
        handleSaveSuccess("Data saved successfully!");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
  
      
    } catch (error) {
      handleSaveError("Error saving data.");
      console.error("Error saving data:", error);
    }
  };  
  const handleNavigate = (mode) => {
    if (rowData) {
        navigate(`/${pageName}/${mode}/${rowData._id}`, {
            state: { rowData, pageName, mode },
        });
      

    }
  };
  const handleadd = (mode) => {
        navigate(`/${pageName}/${mode}`, {
            state: { pageName, mode },
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
              <Button>
              <Whatsapp formData={formData}/>
              </Button>
              <Button>
              <Email formData={formData}/>
              </Button>
              <Button>
              <Sms formData={formData}/>
              </Button>
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
                <div>
                  <div>{pageName} information</div>
                  <div>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontSize:'15px', fontWeight:'100'}}>
                      CT :{" "}
                      <span style={{ fontWeight:'300' }}>
                        {formData?.created_time || "N/A"}
                      </span>
                    </div>
                  </Box>
                  </div>
                </div>
                
                <Box
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "5%",
              }}
            >
              {(!isAdding)  && (
              <Button
                variant="contained"
                color="primary"
                // onClick={handleAddNew}
                onClick={() => handleadd("add")}
                style={{margin:'5px'}}
              >
                Add
              </Button>
              )}
              {!isAdding && !isEditing && (
                <Button
                  variant="contained"
                  color="primary"
                  // onClick={() => setIsEditing(true)}
                  onClick={() => handleNavigate("edit")}
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
              {(!isAdding)  && (
              <Button
                variant="contained"
                color="error"
                onClick={handleOpenDialog}
                style={{margin:'5px'}}
              >
                Delete
              </Button>
              )}
              {(isAdding || isEditing)  && (
              <Button
                variant="contained"
                color="error"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              )}
            </Box>
              </div>
             
              <div style={{ height: "75%", overflow: "auto", padding: isEditing || isAdding ? "10px" : "0" }}>
                <Box sx={{ m: 0 }}>
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
                  {isAdding ? (
                    <AddComponent
                      formData={formData}
                      setFormData={setFormData}
                      pageSchema={pageSchema}
                      onSaveSuccess={handleSaveSuccess}
                      onSaveError={handleSaveError}
                      pageName={pageName}
                      pageId={pageId}
                    />
                  ) : isEditing ? (
                    <EditComponent
                      id={id}
                      formData={formData}
                      setFormData={setFormData}
                      pageSchema={pageSchema}
                      onSaveSuccess={handleSaveSuccess}
                      onSaveError={handleSaveError}
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
              <Tab mode={isAdding ? 'add' : isEditing ? 'edit' : 'view'} key={refreshTab} />
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
