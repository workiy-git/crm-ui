import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import config from '../../config/config';
import { TextField, Button, Box, Paper, List, ListItem, ListItemText, Avatar, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const SiteVisits = () => {
  const [sitevisits, setsitevisits] = useState([]);
  const [sitevisit, setsitevisit] = useState('');
  const { id } = useParams();

  const fetchsitevisits = async () => {
    try {
      const response = await fetch(`${config.apiUrl.replace(/\/$/, "")}/appdata/sitevisits/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const fetchedsitevisits = await response.json();
        console.log('Fetched sitevisits:', fetchedsitevisits);
        setsitevisits(Array.isArray(fetchedsitevisits.data) ? fetchedsitevisits.data.filter(sitevisit => sitevisit !== null) : []);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch sitevisits:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchsitevisits();
  }, [id]);

  const handlePost = async () => {
    if (sitevisit.trim()) {
      try {
        const user = sessionStorage.getItem('CognitoIdentityServiceProvider.6258t5vdisgcu7rjkuc5c94ba9.LastAuthUser');
        console.log('ID', id);
        const response = await fetch(`${config.apiUrl.replace(/\/$/, "")}/appdata/sitevisits/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sitevisits: {
              sitevisits: sitevisit,
              updated_by: user,
              // updated_by_id: '1234567890abcdef12345678',
            },
          }),
        });

        if (response.ok) {
          const newsitevisit = await response.json();
          setsitevisits([...sitevisits, newsitevisit]);
          setsitevisit('');
          fetchsitevisits();
        } else {
          const errorText = await response.text();
          console.error('Failed to post sitevisit:', response.status, errorText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.warn('sitevisit is empty');
    }
  };

  return (
    <Box sx={{ margin: 'auto', padding: 2 }}>
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <TextField
          label="Add Your sitevisits Here"
          variant="outlined"
          fullWidth
          value={sitevisit}
          onChange={(e) => setsitevisit(e.target.value)}
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
        {sitevisits.map((sitevisit, index) => (
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
                    {sitevisit.updated_by}
                  </Typography>
                  {" — " + new Date(sitevisit.updated_at).toLocaleString()}
                </React.Fragment>
              }
              secondary={sitevisit.sitevisits}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SiteVisits;