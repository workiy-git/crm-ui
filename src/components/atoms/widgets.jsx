import React, { useState, useEffect, useRef } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Box } from '@material-ui/core';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../config/config';
import WidgetsIcon from '@mui/icons-material/WidgetsOutlined';
import '../../assets/styles/style.css';

const CreateWidgetItem = styled(Paper)(({ theme }) => ({
  backgroundColor: '#DDE1E9 !important',
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '100%',
  height: 100,
  borderRadius: '10px !important',
  boxShadow: '0px 3px 5px 1px rgba(0,0,0,0.3)', 
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '0',
  justifyContent: 'space-between',
}));

const Icon = styled('div')({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  width: '40%',
  borderRadius: '10px'
});

const Title = styled('div')({
  color: 'black',
  fontSize: '16px',
});

const Count = styled('div')({
  marginTop: '8px',
  fontWeight: 'bold',
  color: 'black',
  fontSize: '22px',
});

const ScrollContainer = styled(Box)({
  overflowY: 'auto',
});

async function retrieveWidgets(dashboardName) {
  try {
    const response = await axios.post(`${config.apiUrl}/dashboards/retrieve`,
      [
        {
          "$match": {
            "dashboardName": dashboardName
          }
        },
        {
          "$sort": { "createdAt": -1 }
        }
      ], {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }

    const data = response.data;
    console.log('Retrieved data:', data);

    if (data && data.data && data.data.length > 0) {
      return data.data[0].tiles;
    } else {
      console.log('No data found or incorrect structure');
      return [];
    }
  } catch (error) {
    console.error('Error retrieving dashboard data:', error);
    return [];
  }
}

async function retrieveWidgetCount(apiEndpoint, apiEndpointFilter, dashboardName) {
  try {
    const response = await axios.post(apiEndpoint, apiEndpointFilter, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        dashboardName: dashboardName,
      }
    });

    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }

    const data = response.data;
    console.log('Retrieved count data:', data);

    if (data && data.status === 'success' && data.data && data.data.length > 0 && data.data[0][dashboardName] !== undefined) {
      return data.data[0][dashboardName];
    } else {
      console.log(`No count data found for ${dashboardName} or incorrect structure:`, data);
      return 0;
    }
  } catch (error) {
    console.error('Error retrieving count data:', error);
    return 0;
  }
}

const CreateWidget = ({ backgroundColor, dashboardName }) => {
  const [widgets, setWidgets] = useState([]);
  const [counts, setCounts] = useState({});
  const [hiddenWidgets, setHiddenWidgets] = useState([]);
  const [showHiddenWidgets, setShowHiddenWidgets] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const navigate = useNavigate();
  const hiddenWidgetsRef = useRef(null);
  const [filter, setFilter] = React.useState({});

  useEffect(() => {
    const fetchData = async () => {
      const retrievedWidgets = await retrieveWidgets(dashboardName);
      setWidgets(retrievedWidgets);

      const countsData = {};
      for (const widget of retrievedWidgets) {
        const count = await retrieveWidgetCount(widget.apiEndpoint, JSON.parse(widget.apiEndpointFilter), dashboardName);
        countsData[widget.name] = count;
      }
      setCounts(countsData);
    };

    fetchData();
  }, [dashboardName]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hiddenWidgetsRef.current && !hiddenWidgetsRef.current.contains(event.target)) {
        setShowHiddenWidgets(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDragStart = (index) => {
    setDraggingIndex(index);
    setTimeout(() => {
      document.querySelector(`.widget-${index}`).style.opacity = '1';
    }, 0);
  };

  const handleDragEnter = (index) => {
    if (draggingIndex !== null && draggingIndex !== index) {
      const updatedWidgets = [...widgets];
      const [draggedWidget] = updatedWidgets.splice(draggingIndex, 1);
      updatedWidgets.splice(index, 0, draggedWidget);
      setWidgets(updatedWidgets);
      setDraggingIndex(index);
    }
  };

  const handleDragEnd = (index) => {
    setDraggingIndex(null);
    document.querySelector(`.widget-${index}`).style.opacity = '1';
  };

//   const handleWidgetClick = (widget) => {
//     // Create the filter object based on widget data
//     const filter = widget.apiRedirectEndpointFilter || {}; // Assume this is an object
    
//     // Convert filter to JSON string and remove unwanted characters
//     const compactFilterString = JSON.stringify(filter).replace(/\\/g, '');
    
//     // Store the cleaned filter string in localStorage
//     localStorage.setItem('widgetFilter', compactFilterString);
    
//     // Navigate to the specified endpoint
//     navigate(widget.apiRedirectEndpoint);
// };

const handleWidgetClick = (widget) => {
  // Log the entire apiRedirectEndpointFilter object for debugging
  console.log('apiRedirectEndpointFilter:', widget.apiRedirectEndpointFilter);

  // Log the type of apiRedirectEndpointFilter
  console.log('Type of apiRedirectEndpointFilter:', typeof widget.apiRedirectEndpointFilter);

  // Parse apiRedirectEndpointFilter if it's a string
  let apiRedirectEndpointFilter = widget.apiRedirectEndpointFilter;
  if (typeof apiRedirectEndpointFilter === 'string') {
    try {
      apiRedirectEndpointFilter = JSON.parse(apiRedirectEndpointFilter);
    } catch (error) {
      console.error('Failed to parse apiRedirectEndpointFilter:', error);
      return;
    }
  }

  // Check if apiRedirectEndpointFilter is an array
  if (Array.isArray(apiRedirectEndpointFilter)) {
    apiRedirectEndpointFilter.forEach((filter, index) => {
      console.log(`Filter ${index}:`, filter);

      // Extract $match object
      const matchObj = filter?.$match;
      if (matchObj) {
        // Extract the value of the filter key that is not 'pageName'
        const filterKey = Object.keys(matchObj).find(key => key !== 'pageName');
        const filterValue = matchObj[filterKey];
        console.log('Filter value:', filterValue);

        // Check if filterValue is not empty before storing it in localStorage
        if (filterValue) {
          // Store the filter value in localStorage with the appropriate key
          localStorage.setItem('widgetFilter', JSON.stringify({ [filterKey]: filterValue }));
          console.log('Stored filter value in localStorage:', { [filterKey]: filterValue });
        } else {
          console.warn('No relevant filter value found in filter');
        }
      }
    });
  } else {
    console.warn('apiRedirectEndpointFilter is not an array');
  }

  // Navigate to the endpoint
  navigate(widget.apiRedirectEndpoint);
};

  const handleHideWidget = (index) => {
    setHiddenWidgets([...hiddenWidgets, widgets[index]]);
    setWidgets(widgets.filter((_, i) => i !== index));
  };

  const toggleShowHiddenWidgets = () => {
    setShowHiddenWidgets(!showHiddenWidgets);
  };

  const handleRestoreWidget = (index) => {
    setWidgets([...widgets, hiddenWidgets[index]]);
    setHiddenWidgets(hiddenWidgets.filter((_, i) => i !== index));
  };

  return (
    <ScrollContainer>
      
      <Box sx={{ flexGrow: 1 }}>
        <div style={{ width: '100%'}}>
          <div style={{ position: 'absolute', top: '90%', right: '50px' }}>
            <button style={{border:'none', alignItems:'center', display:'flex', padding:'8px', borderRadius:'5px'}} onClick={toggleShowHiddenWidgets}><WidgetsIcon /></button>
          </div>
          {showHiddenWidgets && hiddenWidgets.length > 0 && (
            <div
              ref={hiddenWidgetsRef}
              style={{ position: 'absolute', top: '50%', right: '8%', background:'white', padding:'20px', maxHeight:'30%', overflow:'auto', borderRadius:'5px' }}
            >
              {hiddenWidgets.map((widget, index) => (
                <div key={index}>
                  <div
                    style={{ display:'flex', background:'rgb(255, 192, 61)', padding:'5px', borderRadius:'5px', margin:'10px' }}
                  > <div style={{ display:'flex', cursor:'pointer'}} onClick={() => handleRestoreWidget(index)}>
                    <div style={{ background: 'white', borderRadius: '100px', padding: '5px', margin: 'auto', display: 'flex', marginRight:'5px' }}>
                        <img style={{ height: '15px', width: 'auto', margin: 'auto', filter: 'brightness(0) saturate(100%) invert(50%) sepia(100%) saturate(500%) hue-rotate(190deg)' }} src={widget.icon_url || 'default_icon_url'} alt={widget.title} />
                      </div>
                    <div
                    style={{marginRight:'5px'}}
                      variant="contained"
                      color="primary"
                    >{widget.title }
                    </div>
                  </div>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
          {widgets.length > 0 ? widgets.map((widget, index) => (
            <div
              className={`widget-${index} widget-main`}
              key={index}
              item
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={() => handleDragEnd(index)}
              style={{ width: '250px', height: 'auto', margin:'20px', float: 'left', background:'#DDE1E9 !important' }}
            >
              <div style={{ textAlign: 'end', marginBottom:'-20px', marginRight:'5px' }}>
                <button className='widget-hide-btn' style={{position:'relative', border:'none', background:'wihite', borderRadius:'100px', cursor:'pointer'}} onClick={() => handleHideWidget(index)}>-</button>
              </div>
              <CreateWidgetItem
                style={{ background:'#DDE1E9 !important' }}
              >
                <Icon>
                  <div style={{ background: 'white', borderRadius: '100px', padding: '20px', margin: 'auto', display: 'flex' }}>
                    <img style={{ height: '30px', width: 'auto', margin: 'auto', filter: 'brightness(0) saturate(100%) invert(50%) sepia(100%) saturate(500%) hue-rotate(190deg)' }} src={widget.icon_url || 'default_icon_url'} alt={widget.title} />
                  </div>
                </Icon>
                <div
                  variant="contained"
                  color="primary"
                  onClick={() => handleWidgetClick(widget)}
                  style={{ width: '60%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <Title>{widget.title}</Title>
                  <Count>{counts[widget.name] !== undefined ? counts[widget.name] : 'Loading...'}</Count>
                </div>
              </CreateWidgetItem>
            </div>
          )) : <div>There is no data</div>}
        </div>
      </Box>
    </ScrollContainer>
  );
};

export default CreateWidget;
