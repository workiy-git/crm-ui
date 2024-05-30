// src/ImageUpload.js
import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';

const CompanyLogoUpload = () => {
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Create a preview URL for the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleCancelImage = () => {
    setImage(null);
    setImagePreviewUrl(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission
    console.log('Submitting image:', image);
  };

  return (  <Box style={{display:'flex'}}>
      <form onSubmit={handleSubmit} >
        {/* <input
          accept="image/*"
          type="file"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="raised-button-file"
        /> */}
             <TextField
                fullWidth
                accept="image/*"
                id="raised-button-file"
                type="file"
                variant="outlined"
                name="companyLogo"
                onChange={handleImageChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            
     
      </form>
      {imagePreviewUrl && (
      <Box style={{padding:'0 0 0 50px'}}>
          
          <img src={imagePreviewUrl} alt="Preview" style={{ width: '100px', height: 'auto' }} />
          <Button variant="contained" onClick={handleCancelImage} style={{background:'#ffffff ', fontSize:'8px', minWidth:'auto', width:'13px',borderRadius:'100%',padding:'0',color:'#808080'}}>
            X
          </Button>
        </Box>
      )}
    </Box>
   );
};

export default CompanyLogoUpload;