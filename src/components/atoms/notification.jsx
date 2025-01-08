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
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import config from '../../config/config'; // Import the configuration file
import { Grid, Badge, Dialog, DialogTitle, Tabs, Tab, Box, IconButton, Typography } from '@mui/material';
import { headers } from './Authorization';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import '../../assets/styles/style.css';

export const useNotifications = () => {
  const [menuData, setMenuData] = useState(null);
  const [newLeadCount, setNewLeadCount] = useState(0);
  const [todayFollowupCount, setTodayFollowupCount] = useState(0);
  const [missedFollowupCount, setMissedFollowupCount] = useState(0);
  const [newLeads, setNewLeads] = useState([]);
  const [todayFollowups, setTodayFollowups] = useState([]);
  const [missedFollowups, setMissedFollowups] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Function to fetch notifications and follow-ups
  const fetchNotifications = async (filter) => {
    try {
      // const response = await axios.post(`${config.apiUrl}/appdata/retrieve`,filter, { headers });
      const response = await axios.post(
        `${config.apiUrl.replace(/\/$/, "")}/appdata/retrieve?page=1&pageSize=100`, 
        filter, // This is the body (data you are sending)
        
        {
          headers: headers, // This is the config object where headers go
        }
      );
      // Check if the response contains multiple arrays and concatenate them
      let allDataArray = response.data.data;
      console.log("allDataArray",allDataArray)
      
      // If data is an array of arrays, flatten them into a single array
      if (Array.isArray(allDataArray) && Array.isArray(allDataArray[0])) {
        allDataArray = [].concat(...allDataArray); // Merge the arrays
      }

      // Filter new leads for `pageName == "leads"` and `lead_status == "JUNK"`
      const filteredNewLeads = allDataArray.filter(item => item.pageName === 'leads' && item.lead_status === 'New lead');
      setNewLeads(filteredNewLeads); // Set filtered new leads
      // setNewLeadCount(filteredNewLeads.length); // Update the badge count


      const getTodayDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
      // Filter today's follow-up leads
      const filteredFollowups = allDataArray.filter(item => {
        const itemDate = item.follow_up_on.split('T')[0]; // Extract date part
        return item.pageName === 'leads' && itemDate === getTodayDate();
    });
    setTodayFollowups(filteredFollowups);    // Set follow-up data

    const filteredMissedFollowups = allDataArray.filter(item => {
      const itemDate = item.follow_up_on.split('T')[0]; // Extract date part
      return item.pageName === 'leads' && itemDate < getTodayDate();
  });
    setMissedFollowups(filteredMissedFollowups);    // Set follow-up data
      
    } catch (error) {
      console.error('Error fetching notification data:', error);
    }
  };

  const fetchNewLeadCount = async (filter) => {
    try {
      // const response = await axios.post(`${config.apiUrl}/appdata/retrieve`,filter, { headers });
      const response = await axios.post(
        `${config.apiUrl.replace(/\/$/, "")}/appdata/retrieve?page=1&pageSize=100`, 
        filter, // This is the body (data you are sending)
        
        {
          headers: headers, // This is the config object where headers go
        }
      );
      // Check if the response contains multiple arrays and concatenate them
      let allDataArray = response.data.data;
      
      // If data is an array of arrays, flatten them into a single array
      if (Array.isArray(allDataArray) && Array.isArray(allDataArray[0])) {
        allDataArray = [].concat(...allDataArray); // Merge the arrays
      }

      // Filter new leads for `pageName == "leads"` and `lead_status == "JUNK"`
      const filteredNewLeads = allDataArray.filter(item => item.pageName === 'leads' && item.lead_status === 'New lead');
      setNewLeadCount(filteredNewLeads.length); // Update the badge count

    } catch (error) {
      console.error('Error fetching notification data:', error);
    }
  };

  const fetchTodayFollowUpCount = async (filter) => {
    try {
      // const response = await axios.post(`${config.apiUrl}/appdata/retrieve`,filter, { headers });
      const response = await axios.post(
        `${config.apiUrl.replace(/\/$/, "")}/appdata/retrieve?page=1&pageSize=100`, 
        filter, // This is the body (data you are sending)
        
        {
          headers: headers, // This is the config object where headers go
        }
      );
      // Check if the response contains multiple arrays and concatenate them
      let allDataArray = response.data.data;
      
      // If data is an array of arrays, flatten them into a single array
      if (Array.isArray(allDataArray) && Array.isArray(allDataArray[0])) {
        allDataArray = [].concat(...allDataArray); // Merge the arrays
      }

      const getTodayDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
      // Filter today's follow-up leads
      const filteredFollowups = allDataArray.filter(item => {
        const itemDate = item.follow_up_on.split('T')[0]; // Extract date part
        return item.pageName === 'leads' && itemDate === getTodayDate();
    });
    setTodayFollowupCount(filteredFollowups.length); // Update the badge count

    } catch (error) {
      console.error('Error fetching notification data:', error);
    }
  };
  const fetchMissedFollowUpCount = async (filter) => {
    try {
      // const response = await axios.post(`${config.apiUrl}/appdata/retrieve`,filter, { headers });
      const response = await axios.post(
        `${config.apiUrl.replace(/\/$/, "")}/appdata/retrieve?page=1&pageSize=100`, 
        filter, // This is the body (data you are sending)
        
        {
          headers: headers, // This is the config object where headers go
        }
      );
      // Check if the response contains multiple arrays and concatenate them
      let allDataArray = response.data.data;
      console.log("allDataArray",allDataArray)
      
      // If data is an array of arrays, flatten them into a single array
      if (Array.isArray(allDataArray) && Array.isArray(allDataArray[0])) {
        allDataArray = [].concat(...allDataArray); // Merge the arrays
      }

      const getTodayDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const filteredMissedFollowups = allDataArray.filter(item => {
      const itemDate = item.follow_up_on.split('T')[0]; // Extract date part
      return item.pageName === 'leads' && itemDate < getTodayDate();
  });
    setMissedFollowupCount(filteredMissedFollowups.length); // Update the badge count

    } catch (error) {
      console.error('Error fetching notification data:', error);
    }
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

  const handleNavigate = (data) => {
    // navigate(`/app/leads/${data._id}`);
    setOpen(false);
    const pageName = 'leads';
    const mode = 'view';
    if (data) {
      navigate(`/${pageName}/${mode}/${data._id}`, {
          state: { rowData: data, pageName, mode },
      });
  }
  };
// Function to mark a new lead as read
const markLeadAsRead = (index) => {
  const updatedNewLeads = [...newLeads];
  
  // Remove the lead from the list
  updatedNewLeads.splice(index, 1);
  
  // Update the state to reflect the new leads array and notification count
  setNewLeads(updatedNewLeads);
  
  // Reduce the notification count immediately
  setNewLeadCount(prevCount => Math.max(0, prevCount - 1)); // Ensure the count doesn't go below 0
};


  // Fetch menu data on mount
  useEffect(() => {
    fetchMenuData();
  }, []);

  return {
    menuData,
    newLeadCount,
    todayFollowupCount,
    missedFollowupCount,
    newLeads,
    todayFollowups,
    missedFollowups,
    fetchNotifications,
    fetchNewLeadCount,
    fetchTodayFollowUpCount,
    fetchMissedFollowUpCount,
    markLeadAsRead,
    handleNavigate,
    open,
    setOpen

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
  const { menuData, newLeadCount, todayFollowupCount, missedFollowupCount, newLeads, todayFollowups, missedFollowups, fetchNotifications, fetchNewLeadCount, fetchTodayFollowUpCount, fetchMissedFollowUpCount, markLeadAsRead, handleNavigate, open, setOpen } = useNotifications();
  const [tabValue, setTabValue] = useState(0);




  // Fetch notifications when the component mounts
  // useEffect(() => {
  //   fetchNotifications(filter); // Fetch notifications when the component mounts
  // }, [fetchNotifications]);

  const getNotification = (event) => { 
    const filter = [
      {
        $match: {
          pageName: 'leads',
          lead_status: 'New lead',
        },
      },
    ];
    fetchNotifications(filter);
    fetchNewLeadCount(filter);
  };

  const getTodayFollowup = (event) => { 
    const getTodayDate = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    console.log("Today:", getTodayDate());
    
    const filter = [
      {
        $match: {
          pageName: 'leads',
          follow_up_on: { $regex: `^${getTodayDate()}` }, // Match any date starting with today's date
        },
      },
    ];
    
    fetchNotifications(filter);
    fetchTodayFollowUpCount(filter);
  };
  

const getMissedFollowup = (event) => {
    const getTodayDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    console.log("Today:", getTodayDate());
    
    const filter = [
        {
            $match: {
                pageName: 'leads',
                $and: [
                    { follow_up_on: { $regex: `^\\d{4}-\\d{2}-\\d{2}` } }, // Matches a valid date pattern
                    { follow_up_on: { $lt: getTodayDate() } } // Matches dates less than today
                ]
            },
        },
    ];
    
    fetchNotifications(filter);
    fetchMissedFollowUpCount(filter);
};


  const handleNotificationClick = () => {
    setOpen(true); // Open the popup dialog
    getNotification(); // Fetch notifications
    getTodayFollowup(); // Fetch today's follow-ups
    getMissedFollowup(); // Fetch missed follow-ups
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
            // <Badge badgeContent={notificationCount} color="error" max={99999}>
              <img
                src={menuData.notifications_icon.icon}
                alt='icon'
                style={{
                  width: '30px',
                  height: 'auto',
                  cursor: 'pointer',
                  filter: "brightness(0) invert(1)"
                }}
                onClick={handleNotificationClick} //Open popup on click
              />
            // </Badge>
          )}
        </Grid>
      </Grid>

      {/* Popup Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Notifications</DialogTitle>
        <Tabs class="notification_badge" value={tabValue} onChange={handleTabChange}>
          <Tab onClick={getNotification} style={{padding:'10px'}} 
          label={
          <span>
            New Leads{" "}
            <span
              style={{
                backgroundColor: "red",
                color: "white",
                borderRadius: "12px",
                padding: "4px 7px",
                fontSize: "10px",
                marginLeft: "5px",
              }}
            >
              {newLeadCount}
            </span>
          </span>
        } />
          <Tab onClick={getTodayFollowup} style={{padding:'10px'}}
          label={
            <span>
              Today Follow-Up{" "}
              <span
                style={{
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "12px",
                  padding: "4px 7px",
                  fontSize: "10px",
                  marginLeft: "5px",
                }}
              >
                {todayFollowupCount}
              </span>
            </span>
          } />
          <Tab onClick={getMissedFollowup} style={{padding:'10px'}} 
           label={
            <span>
              Missed Follow-Up{" "}
              <span
                style={{
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "12px",
                  padding: "4px 7px",
                  fontSize: "10px",
                  marginLeft: "5px",
                }}
              >
                {missedFollowupCount}
              </span>
            </span>
          }
           />
           
        </Tabs>

        {/* Tab Panel for New Leads */}
        <TabPanel value={tabValue} index={0}>
          {newLeads.length === 0 ? (
            <p>No new leads.</p>
          ) : (
            newLeads.map((data, index) => (
              
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom="1px solid #ccc"
                padding="8px 0"
                onDoubleClick={() => handleNavigate(data)}
              >
                <Box>
                  <Typography variant="body1"><strong>Name:</strong> {data.name}</Typography>
                  <Typography variant="bogy2"><strong>Mobile:</strong> {data.mobile_phone}</Typography>
                  <Typography variant="body2"><strong>Assigned To:</strong> {data.assigned_to}</Typography>
                  <Typography variant="body2"><strong>Status:</strong> {data.lead_status}</Typography>
                  <Typography variant="body2"><strong>Lead Number:</strong> {data.lead_number}</Typography>
                  {/* <Typography variant="body2"><strong>Created By:</strong> {data.created_by} on {new Date(data.created_time).toLocaleString()}</Typography>
                  <Typography variant="body2"><strong>Lead Source:</strong> {data.lead_source}</Typography> */}
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
            todayFollowups.map((data, index) => (
              <Box
                key={index}
                onDoubleClick={() => handleNavigate(data)}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom="1px solid #ccc"
                padding="8px 0"
              >
                <Box>
                  <Typography variant="body1"><strong>Name:</strong> {data.name}</Typography>
                  <Typography variant="body2"><strong>Mobile:</strong> {data.mobile_phone}</Typography>
                  <Typography variant="body2"><strong>Follow-Up Date:</strong> {data.follow_up_on}</Typography>
                  <Typography variant="body2"><strong>Assigned To:</strong> {data.assigned_to}</Typography>
                  <Typography variant="body2"><strong>Status:</strong> {data.lead_status}</Typography>
                  <Typography variant="body2"><strong>Lead Number:</strong> {data.lead_number}</Typography>
                </Box>
              </Box>
            ))
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {missedFollowups.length === 0 ? (
            <p>No Missed follow-ups.</p>
          ) : (
            missedFollowups.map((data, index) => (
              <Box
                key={index}
                onDoubleClick={() => handleNavigate(data)}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom="1px solid #ccc"
                padding="8px 0"
              >
                <Box>
                  <Typography variant="body1"><strong>Name:</strong> {data.name}</Typography>
                  <Typography variant="body2"><strong>Mobile:</strong> {data.mobile_phone}</Typography>
                  <Typography variant="body2"><strong>Follow-Up Date:</strong> {data.follow_up_on}</Typography>
                  <Typography variant="body2"><strong>Assigned To:</strong> {data.assigned_to}</Typography>
                  <Typography variant="body2"><strong>Status:</strong> {data.lead_status}</Typography>
                  <Typography variant="body2"><strong>Lead Number:</strong> {data.lead_number}</Typography>
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
