import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import config from '../../config/config';
import {
  Stack, Alert} from "@mui/material";
import { TextField, Button, Box, Paper, List, ListItem, ListItemText, Avatar, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { headers } from '../atoms/Authorization';
import { useUserData } from '../molecules/userAPIData';

const Comment = ({ mode }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { id } = useParams();
  const { userData } = useUserData();
  console.log("user", userData);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${config.apiUrl.replace(/\/$/, "")}/appdata/comments/${id}`, {
        method: 'GET',
        headers: headers,
      });

      if (response.ok) {
        const fetchedComments = await response.json();
        setComments(
          Array.isArray(fetchedComments.data)
            ? fetchedComments.data.filter(comment => comment !== null)
            : []
        );
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch comments:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (mode !== 'add') {
      fetchComments();
    }
  }, [id, mode]);

  const handlePost = async () => {
    if (comment.trim() ) {
      try {
        const user = sessionStorage.getItem('CognitoIdentityServiceProvider.6258t5vdisgcu7rjkuc5c94ba9.LastAuthUser');
        console.log("user", user);
        const response = await fetch(`${config.apiUrl.replace(/\/$/, "")}/appdata/comments/${id}`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify({
            comments: {
              comments: comment,
              updated_by: userData.first_name,
            },
          }),
        });

        if (response.ok) {
          const newComment = await response.json();
          setComments([...comments, newComment]);
          console.log("newComment", newComment);
          setComment('');
          if (mode !== 'add') {
            fetchComments();
          }
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
      {mode === 'add' ? (
        <Typography variant="body1" color="textSecondary">
          Comments for this new record will appear here after being added.
        </Typography>
      ) : (
        <>
         {(error || success) && (
        <Stack sx={{ width:'100%',position: 'absolute', zIndex: '10'}} spacing={2}>
          <div style={{width:'fit-content', margin:'auto'}}>
          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          </div>
        </Stack>
      )}
          <Paper sx={{ padding: 2, marginBottom: 2 }}>
            <TextField
              label="Add Your Comments Here"
              variant="outlined"
              fullWidth
              value={comment}
              onChange={(e) => {
                const newComment = e.target.value;
                setComment(newComment);
              }}
              multiline
              rows={3}
              sx={{ marginBottom: 2 }}
            />
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant="contained"
                style={{ background: '#12e5e5'}}
                onClick={handlePost}
                // disabled={comment.length > 150}
              >
                Post
              </Button>
            </div>
          </Paper>
          <List>
            {comments.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No comments available.
              </Typography>
            ) : (
              comments.map((comment, index) => (
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
                    secondary={
                      <p style={{maxHeight:'100px', overflowY:'auto', width:'90%',wordWrap:'break-word'}}>
                      {comment.comments}
                      </p>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </>
      )}
    </Box>
  );
};

export default Comment;
