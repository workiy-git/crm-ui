import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import { Typography } from '@mui/material';
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
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import '../../assets/styles/style.css';
// import { Notification } from '../atoms/notification'
import { useNotifications } from '../atoms/notification'; // Import the hook

const DetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { rowDataId, pageName, pageId, mode } = location.state || {};
  const { fetchNotifications } = useNotifications();
  
  useEffect(() => {
    axios
      .get(`${config.apiUrl}/appdata/${rowDataId}`)
      .then((response) => {
        setrowData(response.data.data);
        console.log("detailsdata", response.data.data)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  
  const [rowData, setrowData] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [webformsData, setWebformsData] = useState([]);
  const [pageSchema, setPageSchema] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Initialize as false
  const [isAdding, setIsAdding] = useState(false); 
  const [refreshTab, setRefreshTab] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const editComponentRef = useRef(null);
  const [currentPage, setCurrentPage] = useState([]);



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
        setCurrentPage(currentPage)
        if (!currentPage) {
          setError(`Page ${pageName} not found in webforms collection.`);
          return;
        }

        const pageSchema = currentPage.fields;
        setPageSchema(pageSchema);

        if (rowData) {
          const initialFormData = initializeFormData(rowData, pageSchema);
          setFormData(initialFormData);
          setInitialFormData(initialFormData);
        } else if (id) {
          const apiUrl = `${config.apiUrl.replace(/\/$/, "")}/appdata/${id}`;
          const response = await axios.get(apiUrl);
          const fetchedData = response.data;

          const initialFormData = initializeFormData(fetchedData, pageSchema);
          setFormData(initialFormData);
          setInitialFormData(initialFormData);
        }
      } catch (error) {
        setError("Error fetching webforms data");
      }
    };

    fetchWebformsData();
  }, [id, rowData, pageName, initializeFormData]);


  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setHasUnsavedChanges(hasChanges);
  }, [formData, initialFormData]);

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
  fetchNotifications();
  setSuccess(message);
  setError("");
  setIsEditing(false);
  setIsAdding(false);
  setRefreshTab((prev) => !prev);

  // Update initialFormData to the current formData after save
  setInitialFormData(formData);

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
    fetchNotifications();
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
      fetchNotifications();
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
    fetchNotifications();
    if (!formData) return;
    console.log("form",formData)
    // Perform validation
    if (editComponentRef.current && !editComponentRef.current.validateForm()) {
      handleSaveError("Please fix the validation errors before saving.");
      return;
    }
    // Check if formData has changed from initialFormData
    if (JSON.stringify(formData) === JSON.stringify(initialFormData)) {
      handleSaveError("No changes detected. Nothing to save.");
      return;
    }
// Check if all fields are empty in Add mode
if (isAdding && Object.values(formData).every(value => value === "")) {
  handleSaveError("No data provided. Please fill in the form before submitting.");
  return;
}

  try {
    const dataToSend = { pageName, pageId, ...formData };
    pageSchema.forEach((field) => {
      if (!dataToSend.hasOwnProperty(field.fieldName)) {
        dataToSend[field.fieldName] = "";  // Set default empty value
      }
    });
    console.log("dataToSend",dataToSend)

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
  // Handle Cancel with Unsaved Changes Confirmation
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setIsCancelDialogOpen(true);
    } else {
      navigate(-1);
    }
  };  
  
  const handleAdd = () => {
    if (hasUnsavedChanges) {
      setIsCancelDialogOpen(true);
    } else {
      handleadd("add")
      // navigate(-1);
    }
  };



  const handleConfirmCancel = () => {
    setIsCancelDialogOpen(false);
    navigate(-1);
  };

  const handleCloseCancelDialog = () => {
    setIsCancelDialogOpen(false);
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
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ display: "flex" }}>
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
            <h2 className='details_page_heading' style={{ margin: "auto 40px", textTransform:'capitalize'}}>{pageName} {mode} Page</h2>
            <div style={{margin:'10px 20px 10px 40px', borderBottom:'2px solid black' }}></div>
            </div>
            </div>

            <Box
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "5%",
              }}
            >
              {pageName !== 'users' && (
              <Whatsapp formData={formData}/>
              )}

              {pageName !== 'users' && (
              <Email formData={formData}/>
              )}

              {/* {pageName !== 'users' && (
              <Sms formData={formData}/>
              )} */}
              
              {/* <Button
                variant="contained"
                style={{margin:'5px'}}
                onClick={() => navigate(`/container/${pageName}`)}
              >
                <KeyboardReturnIcon /> Back
              </Button> */}
              <Button onClick={() => navigate(`/container/${pageName}`)} style={{ display: 'flex', alignItems: 'center', color:'black', background: 'rgba(255, 255, 255, 0.4)' }}>
                <KeyboardReturnIcon style={{ color: 'black', marginRight:'10px' }} /><Typography >Back</Typography>   
            </Button>
            </Box>
            
          </div>
          <div className="details_page_main" style={{ display: "flex", height:'78vh' }}>
            <div className='details_page_sub_main'
              style={{
                width: "75%",
                margin: "10px",
                height: "95%",
                border: "1px solid gray",
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
                  height: "7%",
                  background:' #2C2C2C',
                  color:' white'
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
                {(!isAdding)  && pageName !== 'users' && (
                <Button
                  className="details-page-btns"
                  variant="contained"
                  color="primary"
                  // onClick={handleAddNew}
                  // onClick={() => handleadd("add")}
                onClick={handleAdd}
                  style={{margin:'5px'}}
                >
                  Add
                </Button>
                )}
             
          
              {!isAdding && !isEditing && (
                <Button
                className="details-page-btns"
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
                className="details-page-btns"
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                style={{margin:'5px'}}

                >
                  Save
                </Button>
              )}
              {(!isAdding)  && pageName !== 'users' &&(
              <Button
              className="details-page-btns"
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
              className="details-page-btns"
                variant="contained"
                color="error"
                // onClick={() => navigate(-1)}
                onClick={handleCancel}
                style={{margin:'5px'}}
              >
                Cancel
              </Button>
              )}
            </Box>
              </div>
             
              <div style={{ overflow: "auto", padding: isEditing || isAdding ? "10px" : "0", height:'80%' }}>
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
                      ref={editComponentRef}
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
                      ref={editComponentRef}
                      current={currentPage}
                      id={id}
                      pageSchema={pageSchema}
                      formData={formData}
                      setFormData={setFormData}
                      onSaveSuccess={handleSaveSuccess}
                      onSaveError={handleSaveError}
                      pageName={pageName}
                      pageID={pageId}
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
            <div className='details_page_sub_main' style={{ margin: "10px",
                height: "95%",
                border: "1px solid gray",
                position: "relative", width: '50%'}}>
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
       <ConfirmationDialog
        open={isCancelDialogOpen}
        title="Unsaved Changes"
        content="You have unsaved changes. Are you sure you want to cancel?"
        onCancel={handleCloseCancelDialog}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
};

export default DetailsPage;
