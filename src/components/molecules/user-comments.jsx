import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  const handlePost = () => {
    if (comment.trim()) {
      setComments([...comments, comment]);
      setComment('');
    }
  };

  return (
    <Box sx={{  margin: 'auto', padding: 2 }}>
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
      
        <TextField
          label="Add Your Comments Here"
          variant="outlined"
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          multiline
          rows={3}
          sx={{ marginBottom: 2 }}
        />
        <div style={{display:'flex',justifyContent:'end'}}>

      
       <Button variant="contained" style={{background:'#12e5e5'}} onClick={handlePost}>
          Post
        </Button>
        </div>
      </Paper>
      <Paper sx={{ padding: 2 }}>
        <Typography >No Comments</Typography>
        <List>
          {comments.map((comment, index) => (
            <ListItem key={index} divider>
              <ListItemText primary={comment} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Comment;