import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import config from '../../config/config';
import { TextField, Button, Box, Paper, List, ListItem, ListItemText, Avatar, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { headers } from '../atoms/Authorization';
import {useUserData} from '../molecules/userAPIData';

const SiteVisits = ({ mode }) => {
  const [sitevisits, setSiteVisits] = useState([]);
  const [sitevisit, setSiteVisit] = useState('');
  const { id } = useParams();
  const { userData } = useUserData();
  console.log("user", userData)

  const fetchSiteVisit = async () => {
    try {
      const response = await fetch(`${config.apiUrl.replace(/\/$/, "")}/appdata/sitevisits/${id}`, {
        method: 'GET',
        headers: headers,
      });

      if (response.ok) {
        const fetchedSitevisits = await response.json();
        setSiteVisits(
          Array.isArray(fetchedSitevisits.data)
            ? fetchedSitevisits.data.filter(sitevisit => sitevisit !== null)
            : []
        );
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch sitevisits:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (mode !== 'add') {
      fetchSiteVisit();
    }
  }, [id, mode]);

  const handlePost = async () => {
    if (sitevisit.trim()) {
      try {
        const user = sessionStorage.getItem('CognitoIdentityServiceProvider.6258t5vdisgcu7rjkuc5c94ba9.LastAuthUser');
        console.log("user", user)
        const response = await fetch(`${config.apiUrl.replace(/\/$/, "")}/appdata/sitevisits/${id}`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify({
            sitevisits: {
              sitevisits: sitevisit,
              updated_by: userData.first_name,
            },
          }),
        });

        if (response.ok) {
          const newSitevisit = await response.json();
          setSiteVisits([...sitevisits, newSitevisit]);
          setSiteVisit('');
          if (mode !== 'add') {
            fetchSiteVisit();
          }
        } else {
          const errorText = await response.text();
          console.error('Failed to post sitevisit:', response.status, errorText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.warn('Sitevisit is empty');
    }
  };

  return (
    <Box sx={{ margin: 'auto', padding: 2 }}>
      {mode === 'add' ? (
        <Typography variant="body1" color="textSecondary">
          Sitevisit for this new record will appear here after being added.
        </Typography>
      ) : (
        <>
          <Paper sx={{ padding: 2, marginBottom: 2 }}>
            <TextField
              label="Add Your Sitevisits Here"
              variant="outlined"
              fullWidth
              value={sitevisit}
              onChange={(e) => setSiteVisit(e.target.value)}
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
            {sitevisits.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No sitevisits available.
              </Typography>
            ) : (
              sitevisits.map((sitevisit, index) => (
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
                    secondary={
                      <p style={{maxHeight:'100px', overflowY:'auto', width:'90%',wordWrap:'break-word'}}>
                      {sitevisit.sitevisits}
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

export default SiteVisits;
