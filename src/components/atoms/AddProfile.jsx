import React, { useState, useRef } from 'react';
import { Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AvatarEditor from 'react-avatar-editor';

const ProfileUpload = () => {
  const [image, setImage] = useState(null);
  const [setImagePreviewUrl] = useState(null);
  // const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorScale, setEditorScale] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const editorRef = useRef(null); // Use useRef to reference the AvatarEditor component

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Create a preview URL for the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
      setEditorOpen(true); // Open the editor popup when an image is selected
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleCancelImage = () => {
    setImage(null);
    setImagePreviewUrl(null);
    setCroppedImage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission
    console.log('Submitting image:', croppedImage || image);
  };

  const handleEditorSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        setCroppedImage(blob);
        setEditorOpen(false);
      });
    }
  };

  return (
    <Box style={{ display: 'flex' }}>
      <form onSubmit={handleSubmit}>
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
      {croppedImage && (
        <Box style={{ padding: '0 0 0 75px' }}>
          <img src={URL.createObjectURL(croppedImage)} alt="Preview" style={{ width: '50px', height: '50px', borderRadius: '50px' }} />
          <Button variant="contained" onClick={handleCancelImage} style={{ background: '#ffffff', fontSize: '8px', minWidth: 'auto', width: '13px', borderRadius: '100%', padding: '0', color: '#808080' }}>
            X
          </Button>
        </Box>
      )}
      <Dialog open={editorOpen} onClose={() => setEditorOpen(false)}>
        <DialogTitle>Crop Image</DialogTitle>
        <DialogContent>
          {image && (
            <AvatarEditor
              ref={editorRef}
              image={image}
              width={250}
              height={250}
              border={50}
              scale={editorScale}
              rotate={0}
            />
          )}
          <input
            type="range"
            value={editorScale}
            min="1"
            max="3"
            step="0.01"
            onChange={(e) => setEditorScale(parseFloat(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditorOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditorSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileUpload;