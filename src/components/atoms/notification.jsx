// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Grid, Badge } from '@mui/material';
// import config from '../../config/config'; // Import the configuration file

// const Notification = () => {
//   const [menuData, setMenuData] = useState(null);
//   const [notificationCount, setNotificationCount] = useState(0);
//   const [count, setCount] = useState(0);

//   // Moved fetchNotifications inside the component
//   const fetchNotifications = () => {
//     console.log("Notification");
//     axios.get(`${config.apiUrl}/appdata`)
//       .then((response) => {
//         const a = response.data.data;
//         setCount(a.length); // Update the badge count
//         if (response.data && response.data.count) {
//           setNotificationCount(response.data.count);
//         }
//         console.log("Notification", a.length);
//       })
//       .catch((error) => {
//         console.error('Error fetching notification data:', error);
//       });
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   useEffect(() => {
//     // Fetch notification icon
//     axios.get(`${config.apiUrl}/menus/menu_bar`)
//       .then((response) => {
//         setMenuData(response.data.data.menu_images);
//       })
//       .catch((error) => {
//         console.error('Error fetching menu data:', error);
//       });
//   }, []);

//   const handleNotificationClick = () => {
//     setNotificationCount(0);

//     // Mark notifications as read in the backend
//     axios.post(`${config.apiUrl}/appdata`)
//       .then((response) => {
//         console.log('Notifications marked as read:', response.data);
//       })
//       .catch((error) => {
//         console.error('Error marking notifications as read:', error);
//       });
//   };

//   return (
//     <div>
//       <Grid container spacing={2}>
//         <Grid item>
//           {menuData && menuData.notifications_icon && (
//             <Badge badgeContent={count} color="error" max={99999}>
//               <img
//                 src={menuData.notifications_icon.icon}
//                 alt='icon'
//                 style={{ width: '30px', height: 'auto', cursor: 'pointer',
//                   filter: "brightness(0) invert(1)" }}
//                 onClick={handleNotificationClick}
//               />
//             </Badge>
//           )}
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default Notification;


// import React, { useEffect } from 'react';
// import { Grid, Badge } from '@mui/material';
// import { useNotifications } from './notificationCount'; // Import the custom hook

// const Notification = () => {
//   const { menuData, count, fetchNotifications, markNotificationsAsRead } = useNotifications();

//   useEffect(() => {
//     fetchNotifications(); // Fetch notifications when the component mounts
//   }, [fetchNotifications]);

//   const handleNotificationClick = () => {
//     markNotificationsAsRead(); // Mark as read
//   };

//   return (
//     <div>
//       <Grid container spacing={2}>
//         <Grid item>
//           {menuData && menuData.notifications_icon && (
//             <Badge badgeContent={count} color="error" max={99999}>
//               <img
//                 src={menuData.notifications_icon.icon}
//                 alt='icon'
//                 style={{ width: '30px', height: 'auto', cursor: 'pointer',
//                   filter: "brightness(0) invert(1)" }}
//                 onClick={handleNotificationClick}
//               />
//             </Badge>
//           )}
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default Notification;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config/config'; // Import the configuration file
import { Grid, Badge, Dialog, DialogTitle, Tabs, Tab, Box, IconButton, Typography } from '@mui/material';
import { headers } from './Authorization';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export const useNotifications = () => {
  const [menuData, setMenuData] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [newLeads, setNewLeads] = useState([]);
  const [todayFollowups, setTodayFollowups] = useState([]);

  // Function to fetch notifications and follow-ups
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/appdata`, { headers });
      
      // Check if the response contains multiple arrays and concatenate them
      let allDataArray = response.data.data;

      // If data is an array of arrays, flatten them into a single array
      if (Array.isArray(allDataArray) && Array.isArray(allDataArray[0])) {
        allDataArray = [].concat(...allDataArray); // Merge the arrays
      }

      // Filter new leads for `pageName == "leads"` and `lead_status == "JUNK"`
      const filteredNewLeads = allDataArray.filter(item => item.pageName === 'leads' && item.lead_status === 'New lead');
      
      // Filter today's follow-up leads
      const filteredFollowups = allDataArray.filter(item => item.pageName === 'leads' && item.created_time === getTodayDate());
      console.log("filteredFollowups",filteredFollowups)
      setNewLeads(filteredNewLeads); // Set filtered new leads
      setTodayFollowups(filteredFollowups);    // Set follow-up data
      setNotificationCount(filteredNewLeads.length); // Update the badge count
    } catch (error) {
      console.error('Error fetching notification data:', error);
    }
  };

  // Utility function to get today's date in 'YYYY-MM-DD' format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Get the date part only
  };

  // Function to fetch menu data
  const fetchMenuData = () => {
    axios.get(`${config.apiUrl}/menus/menu_bar`, { headers })
      .then((response) => {
        setMenuData(response.data.data.menu_images);
      })
      .catch((error) => {
        console.error('Error fetching menu data:', error);
      });
  };

// Function to mark a new lead as read
const markLeadAsRead = (index) => {
  const updatedNewLeads = [...newLeads];
  
  // Remove the lead from the list
  updatedNewLeads.splice(index, 1);
  
  // Update the state to reflect the new leads array and notification count
  setNewLeads(updatedNewLeads);
  
  // Reduce the notification count immediately
  setNotificationCount(prevCount => Math.max(0, prevCount - 1)); // Ensure the count doesn't go below 0
};


  // Fetch menu data on mount
  useEffect(() => {
    fetchMenuData();
  }, []);

  return {
    menuData,
    notificationCount,
    newLeads,
    todayFollowups,
    fetchNotifications,
    markLeadAsRead,
  };
};

// TabPanel component for rendering content in the tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Notification Component
const Notification = () => {
  const { menuData, notificationCount, newLeads, todayFollowups, fetchNotifications, markLeadAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Fetch notifications when the component mounts
  useEffect(() => {
    fetchNotifications(); // Fetch notifications when the component mounts
  }, [fetchNotifications]);

  const handleNotificationClick = () => {
    setOpen(true); // Open the popup dialog
  };

  const handleClose = () => {
    setOpen(false); // Close the popup dialog
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue); // Switch between tabs
  };
  

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item>
          {menuData && menuData.notifications_icon && (
            <Badge badgeContent={notificationCount} color="error" max={99999}>
              <img
                src={menuData.notifications_icon.icon}
                alt='icon'
                style={{
                  width: '30px',
                  height: 'auto',
                  cursor: 'pointer',
                  filter: "brightness(0) invert(1)"
                }}
                onClick={handleNotificationClick} // Open popup on click
              />
            </Badge>
          )}
        </Grid>
      </Grid>

      {/* Popup Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Notifications</DialogTitle>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Newly Come Leads" />
          <Tab label="Today Follow-Up" />
        </Tabs>

        {/* Tab Panel for New Leads */}
        <TabPanel value={tabValue} index={0}>
          {newLeads.length === 0 ? (
            <p>No new leads.</p>
          ) : (
            newLeads.map((lead, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom="1px solid #ccc"
                padding="8px 0"
              >
                <Box>
                  <Typography variant="body1"><strong>Name:</strong> {lead.name}</Typography>
                  <Typography variant="bogy2"><strong>Mobile:</strong> {lead.mobile_phone}</Typography>
                  <Typography variant="body2"><strong>Assigned To:</strong> {lead.assigned_to}</Typography>
                  <Typography variant="body2"><strong>Status:</strong> {lead.lead_status}</Typography>
                  <Typography variant="body2"><strong>Lead Number:</strong> {lead.lead_number}</Typography>
                  {/* <Typography variant="body2"><strong>Created By:</strong> {lead.created_by} on {new Date(lead.created_time).toLocaleString()}</Typography>
                  <Typography variant="body2"><strong>Lead Source:</strong> {lead.lead_source}</Typography> */}
                </Box>
                {/* <IconButton onClick={() => markLeadAsRead(index)}>
                  <CheckCircleOutlineIcon />
                </IconButton> */}
              </Box>
            ))
          )}
        </TabPanel>

        {/* Tab Panel for Today's Follow-Up */}
        <TabPanel value={tabValue} index={1}>
          {todayFollowups.length === 0 ? (
            <p>No follow-ups for today.</p>
          ) : (
            todayFollowups.map((followup, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom="1px solid #ccc"
                padding="8px 0"
              >
                <Box>
                  <Typography variant="body1"><strong>Name:</strong> {followup.name}</Typography>
                  <Typography variant="body2"><strong>Mobile:</strong> {followup.mobile_phone}</Typography>
                  <Typography variant="body2"><strong>Follow-Up Date:</strong> {followup.created_time}</Typography>
                  <Typography variant="body2"><strong>Assigned To:</strong> {followup.assigned_to}</Typography>
                  <Typography variant="body2"><strong>Status:</strong> {followup.lead_status}</Typography>
                  <Typography variant="body2"><strong>Lead Number:</strong> {followup.lead_number}</Typography>
                </Box>
              </Box>
            ))
          )}
        </TabPanel>
      </Dialog>
    </div>
  );
};

export default Notification;
