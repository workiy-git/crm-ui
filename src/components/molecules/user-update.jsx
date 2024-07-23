import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot
} from '@mui/lab';
import { Typography, Paper, Box } from '@mui/material';
import config from '../../config/config';
import { useParams, useNavigate } from 'react-router-dom';

const Comment = () => {
  const [updates, setUpdates] = useState([]);
  const { id } = useParams(); // Assuming you get id from route params
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpdates = async () => {
      const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`;
      try {
        const response = await axios.get(apiUrl);
        setUpdates(response.data.updates || []);
      } catch (error) {
        console.error('Error fetching updates:', error);
      }
    };

    fetchUpdates();
  }, [id]);

  const handleCancel = () => {
    navigate(`/container/${id}`);
  };

  return (
    <Box sx={{ margin: 'auto', padding: 2 }}>
      <Paper sx={{ padding: 2 }}>
        <Timeline position="alternate">
          {updates.length ? (
            updates.map((update, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
                  {new Date(update.updatedAt).toLocaleString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot color="primary">
                    <Typography>🗨️</Typography>
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Typography variant="h6" component="span">
                    {update.field}
                  </Typography>
                  <Typography>
                    Changed from "{update.oldValue}" to "{update.newValue}" by {update.updatedBy}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))
          ) : (
            <Typography>No updates available</Typography>
          )}
        </Timeline>
      </Paper>
    </Box>
  );
};

export default Comment;
