import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, TextField, Container, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
// import styled from '@emotion/styled';

const Widget = () => {
  const [widgets, setWidgets] = useState([]);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  // Function to fetch widget data from backend
  const fetchWidgets = async () => {
    try {
      const response = await axios.get('/api/widgetdata');
      setWidgets(response.data);
    } catch (error) {
      console.error('Error fetching widget data:', error);
    }
  };

  // Fetch widget data when component mounts
  useEffect(() => {
    fetchWidgets();
  }, []);

  const handleAddWidget = () => {
    setOpen(true);
  };

  const handleSaveWidget = async () => {
    if (!title.trim()) {
      setError('Title is mandatory');
      return;
    }

    if (!image) {
      setError('Image is mandatory');
      return;
    }

    try {
      if (editIndex === -1) {
        // Add new widget
        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);
        await axios.post('/api/widgetdata', formData);
      } else {
        // Update existing widget
        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);
        await axios.put(`/api/widgetdata/${widgets[editIndex]._id}`, formData);
      }

      // After adding or updating the widget, fetch updated data
      fetchWidgets();

      setTitle('');
      setImage(null);
      setError('');
      setOpen(false);
      setEditIndex(-1);
    } catch (error) {
      console.error('Error saving widget:', error);
    }
  };

  const handleEdit = (index) => {
    setTitle(widgets[index].title);
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`/api/widgetdata/${widgets[index]._id}`);
      // After deleting the widget, fetch updated data
      fetchWidgets();
    } catch (error) {
      console.error('Error deleting widget:', error);
    }
  };

  // Calculate the height of the container dynamically
  const containerHeight = () => {
    const numRows = Math.ceil(widgets.length / 4);
    return numRows <= 2 ? 'auto' : '400px';
  };

  return (
    <Container style={{ height: containerHeight(), overflowY: widgets.length > 8 ? 'scroll' : 'visible', scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1' , margin:'0' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginRight: widgets.length > 8 ? '-20px' : 0 }}>
        {widgets.map((widget, index) => (
          <div key={widget._id} style={{ width: '25%', padding: '5px', boxSizing: 'border-box', position: 'relative' }}>
            <Card
              variant="outlined"
              style={{ width: '100%',  borderRadius: '15px' }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(-1)}
            >
              {hoveredIndex === index && (
                <div style={{ top: '5px', right: '5px' }}>
                  <IconButton onClick={() => handleEdit(index)} aria-label="edit">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(index)} aria-label="delete">
                    <Delete />
                  </IconButton>
                </div>
              )}
              <CardContent style={{ width: 'auto', height: 'fitcontent' }}>
                <Typography variant="h5" component="div">
                  {widget.title}
                </Typography>
                <img src={`/api/widgetdata/${widget._id}/image`} alt="Uploaded" style={{ width: '100%', marginTop: '10px', float: 'left' }} />
              </CardContent>
            </Card>
          </div>
        ))}

        <div style={{ width: '25%', padding: '5px', boxSizing: 'border-box' }}>
          <Card variant="outlined" style={{ width: 'auto', height: '100px', borderRadius: '20px', position: 'relative', marginTop: '70px', border: '10px', background: '#ffffff' }}>
            <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: '50px', boxShadow: '10px' }}>
              <Button variant="contained" color="primary" onClick={handleAddWidget} style={{ marginTop: '10px', borderRadius: '100px', paddingTop: '10px', padding: '5px', fontSize: '30px', color: '#212529', background: '#ffffff', opacity: '50%' }}>+</Button>
              <Typography variant="h5" component="div" style={{ marginLeft: '20px', fontWeight: 'bold', paddingtop: '10px', color: '#212529', opacity: '50%', paddingleft: '250px' }}>
                Create New Widgets
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} >
        <DialogTitle style={{ background: '#ffffff', fontWeight: 'bold' }}>{editIndex === -1 ? 'Add Widget' : 'Edit Widget'}</DialogTitle>
        <DialogContent style={{ background: '#12E5E5', padding: '40px' }} >
          <TextField
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            style={{ marginBottom: '10px', background: '#ffffff', border: 'none', borderRadius: '10px' }}
            error={!!error && !title.trim()}
            helperText={!!error && !title.trim() ? error : ''}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ marginBottom: '10px', background: '#ffffff', borderRadius: '10px', padding: '10px' }}
          />
          {!!error && !image && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} style={{ color: 'white', background: '#F73F3F', borderRadius: '5px' }}>Cancel</Button>
          <Button onClick={handleSaveWidget} style={{ color: 'white', background: '#00AEF8', borderRadius: '5px' }}>{editIndex === -1 ? 'Add' : 'Save Changes'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Widget;