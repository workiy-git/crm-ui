// import React, {useState } from 'react';
// import { Box, Typography } from '@mui/material';
// import Header from '../organism/header';
// import SideMenu from "../organism/sidemenu"
// import Popup from '../atoms/smspopup';
// import Pushapp from '../atoms/push-app';
// import Appbar from '../molecules/details-app-bar';
// import DetailsView from '../organism/details-view';
// import Tab from '../organism/details-tab';
// import Refresh from '../atoms/refresh';
// import Footer from '../atoms/Footer';



// const DetailsPage = ({ endpoint }) => {



//   return (
//     <div>
//     <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden', backgroundColor: "gray", paddingLeft: 0 }}>
//       <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden' }}>
//         {/* <div style={{ backgroundColor: "#121A2C" }}>
//           <SideMenu />
//         </div> */}
//         <div style={{ width: '100%', marginRight: "-10px", overflow: 'hidden' }}>
//           {/* <div>
//             <Header />
//           </div> */}
//           <div>
//           <Box>
//       <Typography variant="h5" gutterBottom style={{background: 'linear-gradient(90deg, rgba(12,45,78,1) 0%, rgba(28,104,180,1) 100%)', color:'white', padding:"25px", margin:'0'}}>
//         Calls Details View
//       </Typography>
//     </Box>
//     <Box>
//     <Appbar/>
//     </Box>
//           </div>
//         <div style={{display:'flex',justifyContent:"space-around",  width: '100%', overflow: 'hidden' , marginTop:'40px'}}>
//           < DetailsView />
//           <Tab/>
//         </div>
//       </div>
//         </div>
//       </div>
//       <Footer/>
//     </div>
  
//   );
// };

// export default DetailsPage;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import Header from '../organism/header';
import SideMenu from "../organism/sidemenu";
import Grid from '../organism/grid';
import Tab from '../organism/details-tab';
import config from '../../config/config';

const DetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData, schema, pageName } = location.state;
  const [formData, setFormData] = useState({});

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
  };
  const [ishover, setIshover] = useState(false);
  const handleSave = async () => {
    const { _id, ...updateData } = formData; // Exclude _id from form data
    const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;
    try {
      await axios.put(apiUrl, updateData);
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
        {/* <div style={{ backgroundColor: "#121A2C" }}>
          <SideMenu />
        </div> */}
        <div style={{ width: '100%', overflow: 'hidden' }}>
          {/* <Header /> */}
          <div style={{display:'flex', justifyContent:'space-between', background:'#212529', color:'white', height:'150px'}}>
            <h2  style={{ margin: '20px', borderBottom:'10px solid #FFC03D', height:'fit-content', padding:'5px', textTransform: 'capitalize'}}> 
              {pageName} Details
            </h2>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems:'center', marginRight:'5%'}}>
            <button  onClick={handleCancel} style={{height:'fit-content', padding:'8px 30px', marginRight:'15px', background:'none', borderRadius:'5px', border:'1px solid white', color:'white'}} variant="contained">
              Close
            </button>
            <button  onClick={handleSave} style={{
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
         <div style={{display:'flex', height:'70%'}}>
        <div style={{height:'100%', width:'50%', margin:'20px', border:'1px solid gray', borderRadius:'10px', position:'relative', marginTop:'-35px', background:'white'}}>
          <div style={{padding:'10px 20px', borderBottom:'1px solid gray', fontWeight:'bold', fontSize:'20px',textTransform: 'capitalize'}}>{pageName} information</div>
            <div style={{height:'90%', overflow:'auto',}}> 
              <div style={{ padding: '20px' }}>
                  {schema.map((field) => (
                  <div style={{display:'flex', justifyContent:'space-between', margin:'10px'}}>
                    <label style={{alignContent:'center'}}>
                    {field.required ? `${field.label} *` : field.label}
                    </label>
                    <input 
                    required= {field.required ? `${field.label} *` : field.label}
                    style={{height:'40px', width:'50%', borderRadius:'5px'}}
                    key={field.fieldName}
                    name={field.fieldName}
                    value={formData[field.fieldName] || ''}
                    onChange={handleInputChange} 
                    type="text" />
                  </div>
                  ))}
          
              </div>
            </div> 
          </div>
          <div style={{display:'flex',justifyContent:"space-around",  width: '100%', overflow: 'hidden' , marginTop:'-35px'}}>
          <Tab/>
        </div>
        </div>
        
        </div>

      </div>
    </div>
  );
};

export default DetailsPage;
