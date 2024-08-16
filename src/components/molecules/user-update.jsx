// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { Box, Typography, List, ListItem, Divider, Avatar } from '@mui/material';
// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import config from '../../config/config';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// const Updates = () => {
//   const { id } = useParams();
//   const [history, setHistory] = useState([]);
//   const [error, setError] = useState(null);
//   const [labels, setLabels] = useState([]);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       const fetchedId = id;
//       try {
//         const response = await axios.get(`${config.apiUrl}/appdata/history/${fetchedId}`);
//         setHistory(response.data.data);
//       } catch (error) {
//         setError(error);
//       }
//     };

//     const fetchPageName = async (fetchedId) => {
//       try {
//         console.log('Fetching page name for ID:', fetchedId);
//         const requestBody = { "$match": { "_id": fetchedId } };
//         console.log('Request Body:', requestBody);
    
//         const response = await axios.get(
//           `${config.apiUrl.replace(/\/$/, '')}/appdata/${fetchedId}`,
//           requestBody,
//           {
//             headers: {
//               'Content-Type': 'application/json'
//             }
//           }
//         );
    
//         console.log('Response:', response.data.data.pageName);
//         return response.data.data.pageName;
//       } catch (error) {
//         console.error('Error fetching page name:', error);
//         setError(error);
//       }
//     };

//     const fetchWebForms = async () => {
//       try {
//         const response = await axios.get(`${config.apiUrl}/webforms`);
//         console.log('Web Forms Data:', response.data); // Debugging line
//         return response.data;
//       } catch (error) {
//         console.error('Error fetching web forms:', error);
//         setError(error);
//       }
//     };

//     const fetchData = async () => {
//       const fetchedId = id;
//       const pageName = await fetchPageName(fetchedId);
//       const webFormsResponse = await fetchWebForms();
      
//       if (webFormsResponse && webFormsResponse.status === 'success' && Array.isArray(webFormsResponse.data)) { // Ensure webFormsResponse.data is an array
//         const webFormsData = webFormsResponse.data;
//         const matchedForm = webFormsData.find(form => form.pageName === pageName);
//         if (matchedForm) {
//           const extractedLabels = matchedForm.fields.map(field => field.label);
//           setLabels(extractedLabels);
//         }
//       } else {
//         console.error('webFormsData is not an array:', webFormsResponse); // Error handling
//       }
//     };
    
//     fetchHistory();
//     fetchData();
//   }, [id]);

//   const parseHistoryItem = (item) => {
//     // console.log('Item:', item); // Log the item to verify its format
  
//     // Updated regex pattern to correctly capture date, time, and details
//     const dateRegex = /^On (.*?), (.*?), (.*?)\s+(.+)$/;
//     const matches = item.match(dateRegex);
  
//     // console.log('Matches:', matches); // Log the matches to understand the results
  
//     if (matches) {
//       const [, date, time, , details] = matches;
//       return { dateTime: `${date}, ${time}`, details };
//     }
  
//     return { dateTime: '', details: item };
//   };

//   return (
//     <Box sx={{ margin: 'auto', padding: 2, maxWidth: 800, overflow: 'auto' }}>
//       {error ? (
//         <Typography color="error">Failed to load history: {error.message}</Typography>
//       ) : (
//         <List>
//           {history && history.map((item, index) => {
//             const { dateTime, details } = parseHistoryItem(item);
//             // console.log('Parsed Details:', details); // Debugging line to see the parsed details
//             const parts = details.split('made the following changes: ');
//             const action = parts[0].trim();
//             const changesString = parts[1] ? parts[1].trim() : '';
//             const changeList = changesString ? changesString.split(', ').map(change => change.trim()) : [];

//             return (
//               <React.Fragment key={index}>
//                 <ListItem alignItems="flex-start" sx={{ padding: 0 }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//                     <Typography variant="body2" color="text.primary" sx={{ marginRight: 1 }}>
//                       {dateTime}
//                     </Typography>
//                     <Avatar sx={{ marginRight: 1 }}>
//                       <AccountCircleIcon />
//                     </Avatar>
//                     <Typography variant="body2" color="text.primary" sx={{ marginRight: 1 }}>
//                       {action} made the following changes:
//                     </Typography>
//                   </Box>
//                 </ListItem>
//                 {changeList.length > 0 && (
//                   <ListItem sx={{ paddingLeft: 8, paddingTop: 1 }}>
//                     <Box component="ul" sx={{ pl: 0, m: 0 }}>
//                       {changeList.map((change, idx) => (
//                         <ListItem key={idx} sx={{ padding: 0 }}>
//                           <Typography component="li" variant="body2">
//                             {change}
//                           </Typography>
//                         </ListItem>
//                       ))}
//                     </Box>
//                   </ListItem>
//                 )}
//                 <Divider component="li" />
//               </React.Fragment>
//             );
//           })}
//           {history.length === 0 && <Typography>No history available</Typography>}
//         </List>
//       )}
//     </Box>
//   );
// };

// export default Updates;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, List, ListItem, Divider, Avatar } from '@mui/material';
import axios from 'axios';
import config from '../../config/config';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";


const Updates = ({ mode }) => {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [fieldLabels, setFieldLabels] = useState({});
  const [loading, setLoading] = useState(true); // Track loading state
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [jwtToken, setJwtToken] = useState("");
  const [userName, setUserName] = useState("");
  

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken"); // Use sessionStorage instead of localStorage
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
    if (mode === 'add') {
      setHistory([]);
      setLoading(false); // Data fetching is complete
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/appdata/history/${id}`);
        setHistory(response.data.data || []);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false); // Data fetching is complete
      }
    };

    const fetchPageName = async (id) => {
      try {
        const response = await axios.get(`${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`);
        return response.data.data.pageName;
      } catch (error) {
        setError(error);
      }
    };

    const fetchWebForms = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/webforms`);
        return response.data;
      } catch (error) {
        setError(error);
      }
    };

    const fetchData = async () => {
      try {
        const pageName = await fetchPageName(id);
        const webFormsResponse = await fetchWebForms();
        
        if (webFormsResponse && webFormsResponse.status === 'success' && Array.isArray(webFormsResponse.data)) {
          const webFormsData = webFormsResponse.data;
          const matchedForm = webFormsData.find(form => form.pageName === pageName);
          
          if (matchedForm) {
            const fieldLabelMap = matchedForm.fields.reduce((acc, field) => {
              acc[field.fieldName] = field.label;
              return acc;
            }, {});
            setFieldLabels(fieldLabelMap);
          }
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchHistory();
    fetchData();
  }, [id, mode]);

  const parseHistoryItem = (item) => {
    const dateRegex = /^On (.*?), (.*?), (.*?)\s+(.+)$/;
    const matches = item.match(dateRegex);
  
    if (matches) {
      const [, date, time, , details] = matches;
      return { dateTime: `${date}, ${time}`, details, date: `${date}`, time: `${time}` };
    }
  
    return { dateTime: '', details: item, date: '', time: '' };
  };




  

  return (
    <Box sx={{ margin: 'auto', padding: 2, maxWidth: 800, overflow: 'auto' }}>
      {error && <Typography color="error">Failed to load history: {error.message}</Typography>}
      {loading ? (
        <Typography>Loading...</Typography> // Display loading indicator while data is being fetched
      ) : mode === 'add' ? (
        <Typography>No history available for new record.</Typography>
      ) : (
        <>
          {history.length === 0 ? (
            <Typography>No history available.</Typography>
          ) : (
            <List>
              {history.map((item, index) => {
                const { dateTime, details, date, time } = parseHistoryItem(item);
                const parts = details.split('made the following changes: ');
                const action = parts[0].trim();
                const changesString = parts[1] ? parts[1].trim() : '';
                const changeList = changesString ? changesString.split(', ').map(change => change.trim()) : [];        
                
                const currentDate = new Date();
                const day = String(currentDate.getDate()).padStart(2, '0');
                const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is 0
                const year = currentDate.getFullYear();
                const customFormattedDate = `${month}/${day}/${year}`;
                console.log('Current Date:', customFormattedDate);

                const parseDate = (dateString) => {
                  const [month, day, year] = dateString.split('/');
                  return new Date(year, month - 1, day); // Month is 0-indexed
                };
                const startDate = parseDate(customFormattedDate);
                const endDate = parseDate(date);
              
                // Calculate the difference in time (in milliseconds)
                const differenceInTime = startDate - endDate;
              
                // Convert the time difference into days
                const totalDays = differenceInTime / (1000 * 3600 * 24);

                return (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start" sx={{ padding: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <div style={{display:'block', textAlign:'center'}}>
                        <div>
                        <Typography sx={{ marginRight: 1 }} variant="body2" color="text.primary" >
                          {date} {totalDays > 1 ? `(${totalDays} days ago)` : totalDays === 1 ? '(1 day ago)' : '(today)'}
                        </Typography>
                        <div>

                        </div>
                        <Typography sx={{ marginRight: 1 }} variant="body2" color="text.primary" >
                          {time}
                        </Typography>
                        </div>
                        <Avatar
                          alt="Profile"
                          src={userData.profile_img}
                          sx={{ margin: 'auto' }}
                        />
                        </div>
                        <Typography variant="body2" color="text.primary" sx={{ marginRight: 1 }}>
                          {action} {userData.username} : made the following changes:
                        </Typography>
                      </Box>
                    </ListItem>
                    {changeList.length > 0 && (
                      <ListItem sx={{ paddingLeft: 8, paddingTop: 1 }}>
                        <Box component="ul" sx={{ pl: 0, m: 0 }}>
                          {changeList.map((change, idx) => {
                            const [fieldName, value] = change.split(': ');
                            const label = fieldLabels[fieldName] || fieldName;
                            return (
                              <ListItem key={idx} style={{ padding: "10px 30px" }}>
                                <Typography component="li" variant="body2">
                                  <strong>{label}:</strong> {value}
                                </Typography>
                              </ListItem>
                            );
                          })}
                        </Box>
                      </ListItem>
                    )}
                    <Divider style={{margin:'5px'}} component="li" />
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </>
      )}
    </Box>
  );
};

export default Updates;
