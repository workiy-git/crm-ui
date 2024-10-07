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
import { Grid, Badge } from '@mui/material';
import { headers } from './Authorization'

// Custom Hook for Notifications
export const useNotifications = () => {
  const [menuData, setMenuData] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [count, setCount] = useState(0);

  const fetchNotifications = async () => {
    console.log("Notification");
    try {
      const response = await axios.get(`${config.apiUrl}/appdata`, {headers});
      const a = response.data.data;
      setCount(a.length); // Update the badge count
      if (response.data && response.data.count) {
        setNotificationCount(response.data.count);
      }
      console.log("Notification", a.length);
    } catch (error) {
      console.error('Error fetching notification data:', error);
    }
  };

  const fetchMenuData = () => {
    axios.get(`${config.apiUrl}/menus/menu_bar`, {headers})
      .then((response) => {
        setMenuData(response.data.data.menu_images);
      })
      .catch((error) => {
        console.error('Error fetching menu data:', error);
      });
  };

  const markNotificationsAsRead = () => {
    axios.post(`${config.apiUrl}/appdata`)
      .then((response) => {
        console.log('Notifications marked as read:', response.data);
        setNotificationCount(0); // Reset the notification count
      })
      .catch((error) => {
        console.error('Error marking notifications as read:', error);
      });
  };

  // Fetch menu data on mount
  useEffect(() => {
    fetchMenuData();
  }, []);

  return {
    menuData,
    notificationCount,
    count,
    fetchNotifications,
    markNotificationsAsRead,
  };
};

// Notification Component
const Notification = () => {
  const { menuData, count, fetchNotifications, markNotificationsAsRead } = useNotifications();

  useEffect(() => {
    fetchNotifications(); // Fetch notifications when the component mounts
  }, [fetchNotifications]);

  const handleNotificationClick = () => {
    markNotificationsAsRead(); // Mark as read
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item>
          {menuData && menuData.notifications_icon && (
            <Badge badgeContent={count} color="error" max={99999}>
              <img
                src={menuData.notifications_icon.icon}
                alt='icon'
                style={{
                  width: '30px',
                  height: 'auto',
                  cursor: 'pointer',
                  filter: "brightness(0) invert(1)"
                }}
                onClick={handleNotificationClick}
              />
            </Badge>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Notification;
