import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import axios from 'axios';
import Header from '../organism/header';
import SideMenu from "../organism/sidemenu";
import config from '../../config/config';

const EditPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData, schema, pageName } = location.state;
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (rowData) {
      setFormData(rowData);
    } else {
      // Fetch data if not passed from the previous page
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
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleSave = async () => {
    const newErrors = {};
    schema.forEach((field) => {
      if (field.required && !formData[field.fieldName]) {
        newErrors[field.fieldName] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const { _id, ...updateData } = formData; // Exclude _id from form data
    const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;
    try {
      await axios.put(apiUrl, updateData);
      navigate(`/container/${pageName}`);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleCancel = () => {
    navigate(`/container/${pageName}`);
  };

  return (
    <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden' }}>
      <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden' }}>
        <div style={{ backgroundColor: "#121A2C" }}>
          <SideMenu />
        </div>
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <Header />
          <div style={{display:'flex', justifyContent:'space-between', background:'#212529', color:'white', height:'150px'}}>
            <h2 style={{ margin: '20px', borderBottom:'10px solid #FFC03D', height:'fit-content', padding:'5px'}}> 
              Edit {pageName}
            </h2>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems:'center', marginRight:'5%'}}>
              <button onClick={handleCancel} style={{height:'fit-content', padding:'8px 30px', marginRight:'15px', background:'none', borderRadius:'5px', border:'1px solid white', color:'white'}} variant="contained">
                Close
              </button>
              <button onClick={handleSave} style={{
                height: 'fit-content',
                marginLeft: '15px',
                background: '#FFC03D',
                color: 'black',
                padding:'8px 30px',
                borderRadius:'5px',
              }}>
                Save
              </button>
            </Box>
          </div>
          <div style={{height:'70%', margin:'20px', border:'1px solid gray', borderRadius:'10px', position:'relative', marginTop:'-35px', background:'white'}}>
            <div style={{padding:'10px 20px', borderBottom:'1px solid gray', fontWeight:'bold', fontSize:'20px',textTransform: 'capitalize'}}>{pageName} information</div>
            <div style={{height:'90%', overflow:'auto'}}> 
              <div style={{ padding: '20px', columnCount: 2 }}>
                {schema.map((field) => (
                  <div key={field.fieldName} style={{display:'flex', justifyContent:'space-between', margin:'10px'}}>
                    <label style={{alignContent:'center'}}>
                      {field.required ? `${field.label} *` : field.label}
                    </label>
                    <input
                      style={{
                        height: '40px',
                        width: '50%',
                        borderRadius: '5px',
                        border: errors[field.fieldName] ? '2px solid red' : '1px solid gray'
                      }}
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
        </div>
      </div>
    </div>
  );
};

export default EditPage;
