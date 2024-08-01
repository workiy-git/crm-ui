// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { Box, Button, TextField, Select, MenuItem, Checkbox, FormControlLabel, FormControl } from '@mui/material';
// import axios from 'axios';
// import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
// import Tab from '../organism/details-tab';
// import config from '../../config/config';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// const DetailsPage = () => {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { rowData, schema, pageName } = location.state;
//   const [formData, setFormData] = useState({});
//   const [isEditing, setIsEditing] = useState(false); // New state for edit mode

//   useEffect(() => {
//     if (rowData) {
//       setFormData(rowData);
//     } else {
//       const fetchData = async () => {
//         const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;
//         try {
//           const response = await axios.get(apiUrl);
//           setFormData(response.data);
//         } catch (error) {
//           console.error('Error fetching data:', error);
//         }
//       };
//       fetchData();
//     }
//   }, [id, rowData]);

//   const handleInputChange = (event) => {
//     const { name, value, type, checked } = event.target;
//     setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
//   };

//   const handleSave = async () => {
//     const { _id, ...updateData } = formData; // Exclude _id from form data
//     const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;
//     try {
//       await axios.put(apiUrl, updateData);
//       alert('Data updated successfully');
//       navigate(`/container/${pageName}`);
//     } catch (error) {
//       console.error('Error updating data:', error);
//       alert('Error updating data');
//     }
//   };

//   const handleCancel = () => {
//     navigate(`/container/${pageName}`);
//   };

//   const handleEdit = () => {
//     setIsEditing(true); // Enable editing
//   };
//   const handleNext = () => {
//     // navigate(`/details/${id}`);
    
//   };

//   const renderInputField = (field) => {
//     let value = formData[field.fieldName] || '';

//     if (!isEditing) {
//       return (
//         <TextField
//           name={field.fieldName}
//           style={{ height: '40px', width: '50%', borderRadius: '5px' }}
//           value={value}
//           InputProps={{ readOnly: true }}
//           placeholder="Not Specified"
//           fullWidth
//         />
//       );
//     }

//     if (field.htmlControl === 'input') {
//       if (field.type === 'text' || field.type === 'tel' || field.type === 'email') {
//         return (
//           <TextField
//             name={field.fieldName}
//             type={field.type}
//             style={{ height: '40px', width: '50%', borderRadius: '5px' }}
//             value={value}
//             placeholder="Not Specified"
//             onChange={handleInputChange}
//             fullWidth
//           />
//         );
//       }
//       if (field.type === 'number') {
//         return (
//           <TextField
//             type="number"
//             name={field.fieldName}
//             style={{ height: '40px', width: '50%', borderRadius: '5px' }}
//             value={value}
//             placeholder="Not Specified"
//             onChange={handleInputChange}
//             fullWidth
//           />
//         );
//       }
//       if (field.type === 'date') {
//         return (
//           <TextField
//             type="date"
//             name={field.fieldName}
//             style={{ height: '40px', width: '50%', borderRadius: '5px' }}
//             value={value || ''}
//             onChange={handleInputChange}
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             placeholder="Select"
//           />
//         );
//       }
//       if (field.type === 'datetime-local') {
//         return (
//           <TextField
//             type="datetime-local"
//             name={field.fieldName}
//             style={{ height: '40px', width: '50%', borderRadius: '5px' }}
//             value={value || ''}
//             onChange={handleInputChange}
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             placeholder="Select"
//           />
//         );
//       }
//       return (
//         <TextField
//           name={field.fieldName}
//           style={{ height: '40px', width: '50%', borderRadius: '5px' }}
//           value={value}
//           placeholder="Not Specified"
//           onChange={handleInputChange}
//           fullWidth
//         />
//       );
//     }

//     if (field.htmlControl === 'select') {
//       return (
//         <FormControl
//           style={{ height: '40px', width: '50%', borderRadius: '5px' }}
//         >
//           <Select
//             name={field.fieldName}
//             value={value}
//             onChange={handleInputChange}
//             displayEmpty
//             renderValue={(selected) => {
//               if (selected === '') {
//                 return <em>Select</em>;
//               }
//               return selected;
//             }}
//           >
//             <MenuItem value="">
//               <em>Select</em>
//             </MenuItem>
//             {field.options.map((option, index) => (
//               <MenuItem key={index} value={option}>
//                 {option}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       );
//     }

//     if (field.htmlControl === 'checkbox') {
//       return (
//         <FormControlLabel
//           style={{ height: '40px', width: '50%', borderRadius: '5px' }}
//           control={
//             <Checkbox
//               name={field.fieldName}
//               checked={Boolean(value)}
//               onChange={handleInputChange}
//             />
//           }
//           label={field.label}
//         />
//       );
//     }

//     if (field.htmlControl === 'textarea') {
//       return (
//         <TextField
//           name={field.fieldName}
//           style={{ height: '40px', width: '50%', borderRadius: '5px' }}
//           value={value}
//           placeholder="Not Specified"
//           onChange={handleInputChange}
//           fullWidth
//           multiline
//           rows={1}
//         />
//       );
//     }

//     return (
//       <TextField
//         name={field.fieldName}
//         style={{ height: '40px', width: '50%', borderRadius: '5px' }}
//         value={value}
//         placeholder="Not Specified"
//         onChange={handleInputChange}
//         fullWidth
//       />
//     );
//   };
//   return (
//     <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden' }}>
//       <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden' }}>
//         <div style={{ width: '100%', overflow: 'hidden' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', background: '#212529', color: 'white', height: '110px' }}>
//             <h2 style={{ margin: '20px', borderBottom: '10px solid #FFC03D', height: 'fit-content', padding: '5px', textTransform: 'capitalize' }}>
//               {pageName} Details View
//             </h2>
//             <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '5%' }}>
//                 <Button style={{ height: 'fit-content', padding: '8px 30px', marginRight: '30px', background: 'none', borderRadius: '5px', border: '1px solid white', color: 'white' }} variant="contained">
//                  <AddCircleOutlineIcon /> &nbsp; ADD
//                 </Button>
//               {!isEditing && (
//                 <Button onClick={handleEdit} style={{ height: 'fit-content', padding: '8px 30px', marginRight: '15px', background: 'none', borderRadius: '5px', border: '1px solid white', color: 'white' }} variant="contained">
//                   Edit
//                 </Button>
//               )}
//               {isEditing && (
//                 <Button onClick={handleSave} style={{ height: 'fit-content',  marginRight: '15px', background: '#FFC03D', color: 'black', padding: '8px 30px', borderRadius: '5px' }}>
//                   Save
//                 </Button>
//               )}
//               <Button onClick={handleCancel} style={{ height: 'fit-content', padding: '8px 30px',marginLeft: '15px', background: 'none', borderRadius: '5px', border: '1px solid white', color: 'white' }} variant="contained">
//                 Close
//               </Button>
//               <Button onClick={handleNext} style={{ height: 'fit-content', padding: '8px 30px',marginLeft: '15px', background: 'none', borderRadius: '5px', border: '1px solid white', color: 'white' }} variant="contained">
//                 Next
//               </Button>
              
//             </Box>
//           </div>
//           <div style={{display:'flex'}}>
//             <div style={{margin:'20px 30px', fontSize:'20px'}}>
//               User Name :<span style={{fontWeight:'bold', marginLeft:'20px'}}>{formData.caller_name || 'N/A'}</span>
//             </div>
//             <div style={{margin:'20px 30px', fontSize:'20px'}}>
//               Caller Number :<span style={{fontWeight:'bold', marginLeft:'20px'}}>{formData.caller_number || 'N/A'}</span>
//             </div>
//             <div style={{margin:'20px 30px', fontSize:'20px'}}>
//               Call Status :<span style={{fontWeight:'bold', marginLeft:'20px'}}>{formData.call_status || 'N/A'}</span>
//             </div>
//           </div>
//           <div style={{ display: 'flex', height: '70%' }}>
//             <div style={{ height: '80%', width: '70%', border: '1px solid gray', borderRadius: '10px', position: 'relative', background: 'white' }}>
//               <div style={{ padding: '10px 20px', borderBottom: '1px solid gray', fontWeight: 'bold', fontSize: '20px', textTransform: 'capitalize' }}>{pageName} information</div>
//               <div>
//                 <Box style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding:'5px' }}>
//                   {/* {!isEditing && (
//                     <Button onClick={handleEdit} style={{ height: 'fit-content', padding: '3px 20px 3px 15px', background: 'none', borderRadius: '5px', border: '1px solid gray', color: 'black' }} variant="contained">
//                       <ModeEditOutlinedIcon style={{marginRight:'5px', fontSize:'20px'}}/>Edit
//                     </Button>
//                   )}
//                   {isEditing && (
//                     <Button onClick={handleSave} style={{ height: 'fit-content', marginLeft: '15px', background: '#FFC03D', color: 'black', padding: '3px 20px 3px 15px', borderRadius: '5px' }}>
//                       Save
//                     </Button>
//                   )} */}
//                   <div style={{margin:'auto 20px'}}>
//                     CT : <span style={{fontWeight:'bold'}}>{formData.created_time || 'N/A'}</span>
//                   </div>
//                 </Box>
//               </div>
//               <div style={{ height: '75%', overflow: 'auto' }}>
//                 <div style={{ padding: '20px'}}>
//                   {schema.map((field) => (
//                     <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px', width: '90%' }} key={field.fieldName}>
//                       <label style={{ alignContent: 'center' }}>
//                         {field.required ? `${field.label} *` : field.label}
//                       </label>
//                       {renderInputField(field)}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <div style={{ display: 'flex', justifyContent: "space-around", width: '50%', overflow: 'hidden' }}>
//               <Tab />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DetailsPage;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, TextField, Select, MenuItem, Checkbox, FormControlLabel, FormControl, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputLabel, Alert, Stack } from '@mui/material';
import axios from 'axios';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import Tab from '../organism/details-tab';
import config from '../../config/config';

const DetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData, schema, pageName } = location.state;

  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [newFormData, setNewFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const validateFormData = (data = formData) => {
    let isValid = true;
    let errors = {};

    schema.forEach((field) => {
      if (field.required && !data[field.fieldName]) {
        isValid = false;
        errors[field.fieldName] = `${field.label} is required.`;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateFormData()) {
      return;
    }

    const { _id, ...updateData } = formData;
    const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;
    try {
      await axios.put(apiUrl, updateData);
      setSuccess('Data updated successfully');
      setError(''); // Clear error message if successful
      navigate(`/container/${pageName}`);
    } catch (error) {
      console.error('Error updating data:', error);
      setError('Error updating data');
      setSuccess(''); // Clear success message if there's an error
    }
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleNewInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewFormData({ ...newFormData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleDialogSave = async () => {
    if (!validateFormData(newFormData)) {
      return;
    }

    const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata`;
    try {
      await axios.post(apiUrl, newFormData);
      setSuccess('Data added successfully');
      setError(''); // Clear error message if successful
      handleDialogClose();
      // Optionally, refresh data or navigate as needed
    } catch (error) {
      console.error('Error adding data:', error);
      setError('Error adding data');
      setSuccess(''); // Clear success message if there's an error
    }
  };

  const handleCancel = () => {
    navigate(`/container/${pageName}`);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const renderInputField = (field) => {
    const value = formData[field.fieldName] || '';
    const isError = formErrors[field.fieldName];
    const errorStyle = {
      cursor: 'not-allowed',
    };

    if (!isEditing) {
      return (
        <TextField
          name={field.fieldName}
          style={{ width: '50%', borderRadius: '5px', ...(isError ? errorStyle : {}) }}
          value={value}
          InputProps={{ readOnly: true }}
          placeholder="Not Specified"
          fullWidth
          error={!!isError}
          helperText={isError && formErrors[field.fieldName]}
        />
      );
    }

    switch (field.htmlControl) {
      case 'input':
        return (
          <TextField
            name={field.fieldName}
            type={field.type}
            style={{ width: '50%', borderRadius: '5px', ...(isError ? errorStyle : {}) }}
            value={value}
            placeholder="Not Specified"
            onChange={handleInputChange}
            fullWidth
            error={!!isError}
            helperText={isError && formErrors[field.fieldName]}
          />
        );
      case 'select':
        return (
          <FormControl
            style={{ width: '50%', borderRadius: '5px', ...(isError ? errorStyle : {}) }}
            error={!!isError}
          >
            <Select
              name={field.fieldName}
              value={value}
              onChange={handleInputChange}
              displayEmpty
              renderValue={(selected) => (selected === '' ? <em>Select</em> : selected)}
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
      case 'checkbox':
        return (
          <FormControlLabel
            style={{ width: '50%', borderRadius: '5px', ...(isError ? errorStyle : {}) }}
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
      case 'textarea':
        return (
          <TextField
            name={field.fieldName}
            style={{ width: '50%', borderRadius: '5px', ...(isError ? errorStyle : {}) }}
            value={value}
            placeholder="Not Specified"
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            error={!!isError}
            helperText={isError && formErrors[field.fieldName]}
          />
        );
      default:
        return (
          <TextField
            name={field.fieldName}
            style={{ width: '50%', borderRadius: '5px', ...(isError ? errorStyle : {}) }}
            value={value}
            placeholder="Not Specified"
            onChange={handleInputChange}
            fullWidth
            error={!!isError}
            helperText={isError && formErrors[field.fieldName]}
          />
        );
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Show Stack only if there is an error or success message */}
      {(error || success) && (
        <Stack sx={{ width:'100%',position: 'absolute', zIndex: '10'}} spacing={2}>
          <div style={{width:'fit-content', margin:'auto'}}>
          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          </div>
        </Stack>
      )}
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#212529', color: 'white', height: '110px' }}>
            <h2 style={{ margin: '20px', borderBottom: '10px solid #FFC03D', height: 'fit-content', padding: '5px', textTransform: 'capitalize' }}>
              {pageName} Details View
            </h2>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '5%' }}>
              <Button onClick={handleDialogOpen} style={{ height: 'fit-content', padding: '8px 30px', marginRight: '30px', background: 'none', borderRadius: '5px', border: '1px solid white', color: 'white' }} variant="contained">
                <AddCircleOutlineIcon /> &nbsp; ADD
              </Button>
              {!isEditing && (
                <Button onClick={handleEdit} style={{ height: 'fit-content', padding: '8px 30px', marginRight: '15px', background: 'none', borderRadius: '5px', border: '1px solid white', color: 'white' }} variant="contained">
                  Edit
                </Button>
              )}
              {isEditing && (
                <Button onClick={handleSave} style={{ height: 'fit-content', marginRight: '15px', background: '#FFC03D', color: 'black', padding: '8px 30px', borderRadius: '5px' }}>
                  Save
                </Button>
              )}
              <Button onClick={handleCancel} style={{ height: 'fit-content', padding: '8px 30px', marginLeft: '15px', background: 'none', borderRadius: '5px', border: '1px solid white', color: 'white' }} variant="contained">
                Close
              </Button>
            </Box>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ margin: '20px 30px', fontSize: '20px' }}>
              User Name :<span style={{ fontWeight: 'bold', marginLeft: '20px' }}>{formData.caller_name || 'N/A'}</span>
            </div>
            <div style={{ margin: '20px 30px', fontSize: '20px' }}>
              Caller Number :<span style={{ fontWeight: 'bold', marginLeft: '20px' }}>{formData.caller_number || 'N/A'}</span>
            </div>
            <div style={{ margin: '20px 30px', fontSize: '20px' }}>
              Call Status :<span style={{ fontWeight: 'bold', marginLeft: '20px' }}>{formData.call_status || 'N/A'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', height: '70%' }}>
            <div style={{ height: '80%', width: '70%', border: '1px solid gray', borderRadius: '10px', position: 'relative', background: 'white' }}>
              <div style={{ padding: '10px 20px', borderBottom: '1px solid gray', fontWeight: 'bold', fontSize: '20px', textTransform: 'capitalize' }}>{pageName} information</div>
              <div>
                <Box style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '5px' }}>
                  <div style={{ margin: 'auto 20px' }}>
                    CT : <span style={{ fontWeight: 'bold' }}>{formData.created_time || 'N/A'}</span>
                  </div>
                </Box>
              </div>
              <div style={{ height: '75%', overflow: 'auto' }}>
                <div style={{ padding: '20px' }}>
                  {schema.map((field) => (
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px', width: '90%' }} key={field.fieldName}>
                      <label style={{ alignContent: 'center' }}>
                        {field.required ? `${field.label} *` : field.label}
                      </label>
                      {renderInputField(field)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '50%', overflow: 'hidden' }}>
              <Tab />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          Add New {pageName}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleDialogClose}
            aria-label="close"
            style={{ position: 'absolute', right: 8, top: 8, color: 'gray' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {schema.map((field) => (
            <div key={field.fieldName} style={{ marginBottom: '20px' }}>
              <InputLabel>{field.label}</InputLabel>
              {field.htmlControl === 'input' && (
                <TextField
                  name={field.fieldName}
                  type={field.type}
                  value={newFormData[field.fieldName] || ''}
                  onChange={handleNewInputChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              )}
              {field.htmlControl === 'select' && (
                <FormControl fullWidth variant="outlined" margin="normal">
                  <Select
                    name={field.fieldName}
                    value={newFormData[field.fieldName] || ''}
                    onChange={handleNewInputChange}
                    displayEmpty
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
              )}
              {field.htmlControl === 'checkbox' && (
                <FormControlLabel
                  control={
                    <Checkbox
                      name={field.fieldName}
                      checked={Boolean(newFormData[field.fieldName])}
                      onChange={handleNewInputChange}
                    />
                  }
                  label={field.label}
                />
              )}
              {field.htmlControl === 'textarea' && (
                <TextField
                  name={field.fieldName}
                  value={newFormData[field.fieldName] || ''}
                  onChange={handleNewInputChange}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  margin="normal"
                />
              )}
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DetailsPage;

