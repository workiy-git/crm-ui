import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import { Paper, Box } from '@mui/material';
import config from '../../config/config';

const UserUpdatesTimeline = () => {
  const [groupedUpdates, setGroupedUpdates] = useState({});

  useEffect(() => {
    axios.get(`${config.apiUrl}/userinfoupdates`)
      .then((response) => {
        console.log('Data received:', response.data.data);

        // Group and sort updates by timestamp
        const updates = response.data.data;
        const grouped = updates.reduce((acc, update) => {
          const date = new Date(update.updatedAt).toLocaleString();
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(update);
          return acc;
        }, {});

        // Sort dates in descending order
        const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
        const sortedGrouped = sortedDates.reduce((acc, date) => {
          acc[date] = grouped[date];
          return acc;
        }, {});

        setGroupedUpdates(sortedGrouped);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
      <Timeline>
        {Object.keys(groupedUpdates).map(date => (
          <TimelineItem key={date}>
            <TimelineOppositeContent sx={{ color: 'white', paddingRight: 2 }}>
              {date} {/* Display the date only once for grouped updates */}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              {groupedUpdates[date].map(update => (
                <Paper key={update._id} elevation={3} sx={{ padding: '10px', margin: '10px 0', backgroundColor: '#fff' }}>
                  <div><strong>Changed By:</strong> {update.changedBy}</div>
                  <div><strong>Field:</strong> {update.field}</div>
                  <div><strong>Old Value:</strong> {update.oldValue}</div>
                  <div><strong>New Value:</strong> {update.newValue}</div>
                </Paper>
              ))}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default UserUpdatesTimeline;
