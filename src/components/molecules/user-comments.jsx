import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import config from '../../config/config';
import { TextField, Button, Box, Paper, List, ListItem, ListItemText, Avatar, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const { id } = useParams();

  const fetchComments = async () => {
    try {
      const response = await fetch(`${config.apiUrl.replace(/\/$/, "")}/appdata/comments/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const fetchedComments = await response.json();
        console.log('Fetched comments:', fetchedComments);
        setComments(Array.isArray(fetchedComments.data) ? fetchedComments.data.filter(comment => comment !== null) : []);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch comments:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const handlePost = async () => {
    if (comment.trim()) {
      try {
        const user = sessionStorage.getItem('CognitoIdentityServiceProvider.6258t5vdisgcu7rjkuc5c94ba9.LastAuthUser');
        console.log('ID', id);
        const response = await fetch(`${config.apiUrl.replace(/\/$/, "")}/appdata/comments/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comments: {
              comments: comment,
              updated_by: user,
              // updated_by_id: '1234567890abcdef12345678',
            },
          }),
        });

        if (response.ok) {
          const newComment = await response.json();
          setComments([...comments, newComment]);
          setComment('');
          fetchComments();
        } else {
          const errorText = await response.text();
          console.error('Failed to post comment:', response.status, errorText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.warn('Comment is empty');
    }
  };

  return (
    <Box sx={{ margin: 'auto', padding: 2 }}>
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
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <Button variant="contained" style={{ background: '#12e5e5' }} onClick={handlePost}>
            Post
          </Button>
        </div>
      </Paper>
      <List>
        {comments.map((comment, index) => (
          <ListItem key={index} alignItems="flex-start">
            <Avatar>
              <AccountCircleIcon />
            </Avatar>
            <ListItemText
              primary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {comment.updated_by}
                  </Typography>
                  {" — " + new Date(comment.updated_at).toLocaleString()}
                </React.Fragment>
              }
              secondary={comment.comments}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Comment;