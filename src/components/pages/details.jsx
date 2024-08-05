// import React, { useState, useEffect, useCallback } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import {
//   Box,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   Checkbox,
//   FormControlLabel,
//   FormControl,
//   Alert,
//   Stack,
//   InputLabel,
// } from '@mui/material';
// import axios from 'axios';
// import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
// import config from '../../config/config';

// const DetailsPage = () => {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { rowData, schema = [], pageName } = location.state || {};

//   const [formData, setFormData] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [formErrors, setFormErrors] = useState({});
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [webformsData, setWebformsData] = useState([]);
//   const [pageSchema, setPageSchema] = useState([]);

//   const initializeFormData = useCallback((data, schema) => {
//     const initialData = {};
//     schema.forEach((field) => {
//       initialData[field.fieldName] = data[field.fieldName] || '';
//     });
//     return initialData;
//   }, []);

//   useEffect(() => {
//     const fetchWebformsData = async () => {
//       try {
//         const response = await axios.get(`${config.apiUrl.replace(/\/$/, '')}/webforms`);
//         const fetchedWebformsData = response.data.data;
//         setWebformsData(fetchedWebformsData || []);

//         const currentPage = fetchedWebformsData.find((page) => page.pageName === pageName);
//         if (!currentPage) {
//           setError(`Page ${pageName} not found in webforms collection.`);
//           return;
//         }

//         const pageSchema = currentPage.fields;
//         setPageSchema(pageSchema);

//         if (rowData) {
//           const initialFormData = initializeFormData(rowData, pageSchema);
//           setFormData(initialFormData);
//         } else {
//           const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;
//           const response = await axios.get(apiUrl);
//           const fetchedData = response.data;

//           const initialFormData = initializeFormData(fetchedData, pageSchema);
//           setFormData(initialFormData);
//         }
//       } catch (error) {
//         setError('Error fetching webforms data');
//       }
//     };

//     fetchWebformsData();
//   }, [id, rowData, pageName, initializeFormData]);

//   const handleInputChange = (event) => {
//     const { name, value, type, checked } = event.target;
//     setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
//   };

//   const renderInputField = (field) => {
//     const value = formData[field.fieldName] || '';
//     const isError = formErrors[field.fieldName];
//     const label = `${field.label || field.fieldName}${field.required ? ' *' : ''}`;

//     switch (field.htmlControl) {
//       case 'input':
//         return (
//           <FormControl key={field.fieldName} style={{ width: '100%', marginBottom: '16px' }} error={!!isError}>
//             <InputLabel shrink>{label}</InputLabel>
//             <TextField
//               name={field.fieldName}
//               type={field.type || 'text'}
//               value={value}
//               placeholder={field.placeholder || 'Not Specified'}
//               onChange={handleInputChange}
//               fullWidth
//               error={!!isError}
//               helperText={isError && formErrors[field.fieldName]}
//             />
//           </FormControl>
//         );
//       case 'select':
//         return (
//           <FormControl key={field.fieldName} style={{ width: '100%', marginBottom: '16px' }} error={!!isError}>
//             <InputLabel shrink>{label}</InputLabel>
//             <Select name={field.fieldName} value={value} onChange={handleInputChange} displayEmpty>
//               <MenuItem value="">
//                 <em>{field.placeholder || 'Select an option'}</em>
//               </MenuItem>
//               {field.options.map((option, index) => (
//                 <MenuItem key={index} value={option}>
//                   {option}
//                 </MenuItem>
//               ))}
//             </Select>
//             {isError && <div style={{ color: 'red', fontSize: '12px' }}>{formErrors[field.fieldName]}</div>}
//           </FormControl>
//         );
//       case 'checkbox':
//         return (
//           <FormControlLabel
//             key={field.fieldName}
//             control={
//               <Checkbox
//                 name={field.fieldName}
//                 checked={!!value}
//                 onChange={handleInputChange}
//               />
//             }
//             label={label}
//             style={{ width: '100%', marginBottom: '16px' }}
//           />
//         );
//       default:
//         return (
//           <FormControl key={field.fieldName} style={{ width: '100%', marginBottom: '16px' }} error={!!isError}>
//             <InputLabel shrink>{label}</InputLabel>
//             <TextField
//               name={field.fieldName}
//               value={value}
//               placeholder={field.placeholder || 'Not Specified'}
//               onChange={handleInputChange}
//               fullWidth
//               error={!!isError}
//               helperText={isError && formErrors[field.fieldName]}
//             />
//           </FormControl>
//         );
//     }
//   };

//   return (
//     <Box sx={{ m: 2 }}>
//       {error && (
//         <Stack sx={{ width: '100%' }} spacing={2}>
//           <Alert severity="error" onClose={() => setError('')}>
//             {error}
//           </Alert>
//         </Stack>
//       )}
//       {success && (
//         <Stack sx={{ width: '100%' }} spacing={2}>
//           <Alert severity="success" onClose={() => setSuccess('')}>
//             {success}
//           </Alert>
//         </Stack>
//       )}
//       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
//         {pageSchema.map((field) => renderInputField(field))}
//       </Box>
//       <Button
//         variant="contained"
//         color="primary"
//         startIcon={<ModeEditOutlinedIcon />}
//         onClick={() => setIsEditing(!isEditing)}
//         sx={{ mt: 2 }}
//       >
//         {isEditing ? 'Stop Editing' : 'Edit'}
//       </Button>
//     </Box>
//   );
// };

// export default DetailsPage;


import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormControl,
  Alert,
  Stack,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import Tab from '../organism/details-tab';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import config from '../../config/config';

const DetailsPage = () => {
    const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData, schema = [], pageName } = location.state || {};

  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [webformsData, setWebformsData] = useState([]);
  const [pageSchema, setPageSchema] = useState([]);

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

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const renderInputField = (field) => {
    const value = formData[field.fieldName] || '';
    const isError = formErrors[field.fieldName];
    const label = `${field.label || field.fieldName}${field.required ? ' *' : ''}`;

    switch (field.htmlControl) {
      case 'input':
        return (
          <FormControl key={field.fieldName} style={{ width: '100%', marginBottom: '16px', display:'flex', flexDirection:'row' }} error={!!isError}>
            <lable style={{width:'40%'}} shrink>{label}</lable>
            <input
            style={{width:'40%'}}
              name={field.fieldName}
              type={field.type || 'text'}
              value={value}
              placeholder={field.placeholder || 'Not Specified'}
              onChange={handleInputChange}
              fullWidth
              error={!!isError}
              helperText={isError && formErrors[field.fieldName]}
            />
          </FormControl>
        );
      case 'select':
        return (
          <FormControl key={field.fieldName} style={{ width: '100%', marginBottom: '16px', display:'flex', flexDirection:'row' }} error={!!isError}>
            <lable style={{width:'40%'}} shrink>{label}</lable>
            <Select style={{width:'40%'}} name={field.fieldName} value={value} onChange={handleInputChange} displayEmpty>
              <MenuItem value="">
                <em>{field.placeholder || 'Select an option'}</em>
              </MenuItem>
              {field.options.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {isError && <div style={{ color: 'red', fontSize: '12px' }}>{formErrors[field.fieldName]}</div>}
          </FormControl>
        );
      case 'checkbox':
        return (
          <FormControlLabel
            key={field.fieldName}
            control={
              <Checkbox
                name={field.fieldName}
                checked={!!value}
                onChange={handleInputChange}
              />
            }
            label={label}
            style={{ width: '100%', marginBottom: '16px' }}
          />
        );
      default:
        return (
          <FormControl key={field.fieldName} style={{ width: '100%', marginBottom: '16px', display:'flex', flexDirection:'row' }} error={!!isError}>
            <lable style={{width:'40%'}} shrink>{label}</lable>
            <TextField
            style={{width:'40%'}}
              name={field.fieldName}
              value={value}
              placeholder={field.placeholder || 'Not Specified'}
              onChange={handleInputChange}
              fullWidth
              error={!!isError}
              helperText={isError && formErrors[field.fieldName]}
            />
          </FormControl>
        );
    }
  };


  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Show Stack only if there is an error or success message */}
      {/* {(error || success) && (
        <Stack sx={{ width:'100%',position: 'absolute', zIndex: '10'}} spacing={2}>
          <div style={{width:'fit-content', margin:'auto'}}>
          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          </div>
        </Stack>
      )} */}
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#212529', color: 'white', height: '65px' }}>
            <h2 style={{ margin: 'auto 20px', borderBottom: '10px solid #FFC03D', height: 'fit-content', padding: '5px', textTransform: 'capitalize' }}>
              {pageName} Details View
            </h2>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '5%' }}>
              <Button  style={{ height: 'fit-content', padding: '2px 15px', marginRight: '30px', background: 'none', borderRadius: '5px', border: '1px solid white', color: 'white' }} variant="contained">
                <AddCircleOutlineIcon /> &nbsp; ADD
              </Button>
                <Button style={{ height: 'fit-content', padding: '2px 15px', marginRight: '15px', background: 'none', borderRadius: '5px', border: '1px solid white', color: 'white' }} variant="contained">
                  Edit
                </Button>
                <Button style={{ height: 'fit-content', marginRight: '15px', background: '#FFC03D', color: 'black', padding: '2px 15px', borderRadius: '5px' }}>
                  Save
                </Button>
              <Button style={{ height: 'fit-content', padding: '2px 15px', marginLeft: '15px', background: 'none', borderRadius: '5px', border: '1px solid white', color: 'white' }} variant="contained">
                Back
              </Button>
              <Button style={{ height: 'fit-content', padding: '2px 15px', marginLeft: '15px', background: 'none', borderRadius: '5px', border: '1px solid white', color: 'white' }} variant="contained">
                Delete
              </Button>
            </Box>
          </div>
          {/* <div style={{ display: 'flex' }}>
            <div style={{ margin: '20px 30px', fontSize: '20px' }}>
              User Name :<span style={{ fontWeight: 'bold', marginLeft: '20px' }}>{formData.caller_name || 'N/A'}</span>
            </div>
            <div style={{ margin: '20px 30px', fontSize: '20px' }}>
              Caller Number :<span style={{ fontWeight: 'bold', marginLeft: '20px' }}>{formData.caller_number || 'N/A'}</span>
            </div>
            <div style={{ margin: '20px 30px', fontSize: '20px' }}>
              Call Status :<span style={{ fontWeight: 'bold', marginLeft: '20px' }}>{formData.call_status || 'N/A'}</span>
            </div>
          </div> */}
          <div style={{ display: 'flex', height: '80vh' }}>
            <div style={{ margin:'10px', width: '70%', border: '1px solid gray', borderRadius: '10px', position: 'relative', background: 'white' }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              {pageSchema.map((field) => renderInputField(field))}
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ModeEditOutlinedIcon />}
              onClick={() => setIsEditing(!isEditing)}
              sx={{ mt: 2 }}
            >
              {isEditing ? 'Stop Editing' : 'Edit'}
            </Button>
          </Box>
              </div>
            </div>
            <div style={{ margin:'10px', display: 'flex', justifyContent: 'space-around', width: '50%', overflow: 'hidden' }}>
              <Tab />
            </div>
          </div>
        </div>
      </div>

      <Dialog>
        <DialogTitle>
          Add New {pageName}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="close"
            style={{ position: 'absolute', right: 8, top: 8, color: 'gray' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogActions>
          <Button color="primary">
            Cancel
          </Button>
          <Button color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DetailsPage;