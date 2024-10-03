import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, List, Card,CardContent,ListItem, Divider, Avatar, Button } from '@mui/material';
import axios from 'axios';
import config from '../../config/config';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Loader from '../atoms/update-loader';
import '../../assets/styles/style.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HistoryIcon from '@mui/icons-material/History';

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
  const [showAllHistory, setShowAllHistory] = useState(false); // State to control "Show More" for history
  const [expandedHistoryItems, setExpandedHistoryItems] = useState({}); // Track expanded history items

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

  // Determine the number of items to display initially
  const itemsToShow = showAllHistory ? history.length : 3;

  return (
    <Box className="details-updates" sx={{ margin: 'auto', padding: 2, maxWidth: 800, overflow: 'auto' }}>
      {/* {error && <Typography color="error">Failed to load history: {error.message}</Typography>} */}
      {loading ? (
        <Loader/>// Display loading indicator while data is being fetched
      ) : mode === 'add' ? (
        <Typography>No history available for new record.</Typography>
      ) : (
        <>
          {history.length === 0 ? (
            <Typography>No history available.</Typography>
          ) : (
            <List>
              {history.slice(0, itemsToShow).map((item, index) => {
                const { dateTime, details, date, time } = parseHistoryItem(item);
                const parts = details.split('made the following changes: ');
                const action = parts[0].trim();
                const changesString = parts[1] ? parts[1].trim() : '';
                const changeList = changesString ? changesString.split(', ').map(change => change.trim()) : [];        
                const Stringdate = new Date(date);

const options = { day: '2-digit', month: 'long', year: 'numeric' };
const formattedDate = new Intl.DateTimeFormat('en-US', options).format(Stringdate );

console.log('Formatted Date:', formattedDate);
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

                const expanded = expandedHistoryItems[index];
                const changeItemsToShow = expanded ? changeList.length : 3;

                return (
                  <React.Fragment key={index}>
                   <Card sx={{ flex: 1, padding: '0', paddingBottom: '0px', marginBottom: '10px' }}>
                    <ListItem  sx={{ padding: 0 }}>
                      <Box sx={{ display: 'flex',  alignItems: 'center', width: '100%' }}>
                      <Card sx={{ display: 'flex', alignItems: 'center', padding: 1, margin: 1 , width:'100%'}}>
      <Avatar
        alt="Profile"
        src={userData.profile_img}
        sx={{ width: 35, height: 35, marginRight: 2 }}
      />
      <CardContent sx={{ flex: 1,padding:'0',paddingBottom: '0px' }}>
        <Typography  className="comments-title" component="div">
          {userData.first_name} {userData.last_name}
        </Typography>
        <Typography  className="comments-content" variant="body2" color="text.secondary">
           {formattedDate} {totalDays > 1 ? `(${totalDays} days ago)` : totalDays === 1 ? '(1 day ago)' : '(today)'}
        </Typography>
      </CardContent>
    </Card>
                        </Box>
                    </ListItem>
                    {changeList.length > 0 && (
                      <>
                      <Card sx={{ display: 'flex', alignItems: 'center', padding: 2, margin: 1 , width:'100%'}}>
                        <CardContent sx={{ flex: 1,padding:'0',paddingBottom: '0px' }}>
                        <ListItem sx={{ paddingLeft: 2, paddingTop: 1, paddingRight: 2}}>
                          <Box component="ul" sx={{ pl: 0, m: 0 }}>
                            {changeList.slice(0, changeItemsToShow).map((change, idx) => {
                              const [fieldName, value] = change.split(': ');
                              const label = fieldLabels[fieldName] || fieldName;
                              return (
                                <ListItem key={idx} style={{ padding: "0px 30px" }}>
                                  <Typography sx={{fontSize:'13px'}} component="li" variant="body2">
                                    <strong>{label}:</strong> {value}
                                  </Typography>
                                </ListItem>
                              );
                            })}
                          </Box>
                        </ListItem>
                        </CardContent>
                        </Card>
                        {changeList.length > 3 && (
                          <Box textAlign="center" marginTop={1}>
                         <Button
  variant="text"
  className='comments-viewMore'
  onClick={() =>
    setExpandedHistoryItems(prevState => ({
      ...prevState,
      [index]: !expanded
    }))
  }
>
  {expanded ? (
    <>
      Show Less <ExpandLessIcon style={{ color: '#2375f7', height:'16px' }} />
    </>
  ) : (
    <>
      Show More <ExpandMoreIcon style={{ color: '#2375f7', height:'16px' }} />
    </>
  )}
</Button>
                          </Box>
                        )}
                      </>
                    )}
                 
                    </Card>
                  </React.Fragment>
                );
              })}
              {history.length > 3 && (
                <Box textAlign="center" marginTop={2}>
                <Button
  className='details-page-post-btns'
  onClick={() => setShowAllHistory(!showAllHistory)}
  startIcon={<HistoryIcon />} // Adds the History icon
>
  {showAllHistory ? (
    <>
Show Less History       <ExpandLessIcon /> 
    </>
  ) : (
    <>
  Show More History    <ExpandMoreIcon /> 
    </>
  )}
</Button>
                </Box>
              )}
            </List>
          )}
        </>
      )}
    </Box>
  );
};

export default Updates;

