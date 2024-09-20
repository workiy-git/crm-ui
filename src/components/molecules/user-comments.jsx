import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import config from '../../config/config';
import { TextField, Button, Box, Paper, List, ListItem, ListItemText, Avatar, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../../assets/styles/style.css';
import axios from "axios";
import ButtonLoader from '../atoms/button-loader'
import Loader from '../atoms/update-loader'
import { jwtDecode } from "jwt-decode";

const Comment = () => {
  const [comments, setComments] = useState([]);
  const { id } = useParams();
  const [comment, setComment] = useState('');
  const maxCharacters = 300;
  const [isPosting, setIsPosting] = useState(false);
  const [userData, setUserData] = useState({});
  const [jwtToken, setJwtToken] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading time for fetching comments
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, [])

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken"); // Use sessionStorage instead of sessionStorage
    if (token) {
      setJwtToken(token);
      const decodedToken = jwtDecode(token);
      const user = decodedToken.username; // Assuming the username is stored in the token
      axios
        .get(`${config.apiUrl}/users/${user}`)
        .then((response) => {
          setUserData(response.data.data); // Update with the fetched user data
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
      setUserName(user);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [id]);

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
  function getRelativeTime(updatedAt) {
    const now = new Date();
    const updatedTime = new Date(updatedAt);
    const diffInMilliseconds = now - updatedTime;
  
    // Calculate the difference in seconds, minutes, hours, and days
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
  
    // Return relative time as a string
    if (diffInSeconds < 60) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  
  const handlePost = async () => {
    if (comment.trim()) {
      try {
        setIsPosting(true);
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
      }finally {
        setIsPosting(false); // Re-enable the button
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
        className='details-page-comments'
        onChange={(e) => setComment(e.target.value)}
        multiline
        rows={3}
        inputProps={{ maxLength: maxCharacters }}
        sx={{ marginBottom: 1 }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontSize: '12px', color: comment.length >= maxCharacters ? 'red' : 'black' }}>
          {comment.length}/{maxCharacters} characters
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'end' }}>
      {isPosting ? (
      <ButtonLoader color="inherit" />
    ) : ( <Button
    variant="contained"
    className="details-page-btns"
    style={{ background: '#12e5e5' }}
    onClick={() => handlePost(comment)}
    disabled={isPosting || comment.length === 0}
  >
   
      Post
  
  </Button>
    )}
</div>

      </Paper>
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px' }}>
          <ButtonLoader />
        </div>
      ) : (
      <List  sx={{ width: '600px' }}>
          {comments.map((comment, index) => (
           <ListItem 
           key={index} 
           alignItems="flex-start" 
           style={{
             background: '#F6F8FA',
             borderRadius: '10px',
             marginBottom: '10px',
             boxSizing: 'border-box',  // Ensure padding and borders are included in the size
             overflow: 'hidden',       // Prevent content overflow
             padding: '10px',          // Add some padding for better appearance
           }}>
            <Avatar
                              alt="Profile"
                              src={userData.profile_img}
                              sx={{ margin: 'auto' }}
                            />
            
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline',background:'#000000' }}
                      component="span"
                      variant="body2"
                  className='details-comment'
                    >
                    {comment.updated_by}
                    </Typography >
                    <Typography style={{ fontWeight: '700',fontSize:'10px',fontFamily:'sans-serif' ,color:'#8F9193'}} className='details-comment'>
    &nbsp;&nbsp;{userData.first_name} {userData.last_name} &nbsp;
    <span style={{ fontSize: '9px', color: '#c2c2c2',fontWeight:'100' }}>
      {getRelativeTime(comment.updated_at)}
    </span>
  </Typography>
            
                          
                        
                  </React.Fragment>
                }
                secondary={
                  
                  <div style={{ width: '500px', display: 'flex', alignItems: 'center' }}>
                      <span style={{ 
        marginLeft: '10px', 
        fontSize: '12px', 
        color: '#000', 
        fontFamily: 'sans-serif',
        whiteSpace: 'normal', // Allows text to wrap
        wordBreak: 'break-word' // Ensures long words are broken into the next line
      }}>
      {comment.comments}
    </span>
                  </div>
                }
              />
            </ListItem>
          ))}
          
        </List>
           )}
    </Box>
  );
};

export default Comment;