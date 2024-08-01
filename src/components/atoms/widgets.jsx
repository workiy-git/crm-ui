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
  backgroundColor: '#4BB7D3 !important',
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
      document.querySelector(`.widget-${index}`);
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
    document.querySelector(`.widget-${index}`);
  };

  const handleWidgetClick = (widget) => {
    navigate(widget.apiRedirectEndpoint, {
      state: { filter: widget.apiRedirectEndpointFilter }
    });
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
          <div>
            <button style={{border:'none', alignItems:'center', display:'flex', padding:'8px', borderRadius:'5px',marginRight:'5%', marginTop:'10px', marginLeft:'auto'}} onClick={toggleShowHiddenWidgets}><WidgetsIcon /></button>
          </div>
          {showHiddenWidgets && (
  <div
    ref={hiddenWidgetsRef}
    style={{ position: 'absolute', zIndex:'10', background: 'white', padding: '20px', maxHeight: '30%', top:'25%',right:'2%', overflow: 'auto', borderRadius: '5px' }}
  >
    <div style={{ borderBottom: '1px dashed gray', textAlign: 'center', marginBottom: '10px' }}>Available Filters</div>
    {hiddenWidgets.length > 0 ? (
      hiddenWidgets.map((widget, index) => (
        <div key={index}>
          <div
            style={{ display: 'flex', background: '#212529', color:'white', padding: '5px', borderRadius: '5px', margin: '10px' }}
          >
            <div style={{ display: 'flex', cursor: 'pointer' }} onClick={() => handleRestoreWidget(index)}>
              <div style={{ background: '#fff6', borderRadius: '100px', padding: '5px', margin: 'auto', display: 'flex', marginRight: '5px' }}>
                <img style={{ height: '15px', width: 'auto', margin: 'auto', filter: 'brightness(0) invert(1)' }} src={widget.icon_url || 'default_icon_url'} alt={widget.title} />
              </div>
              <div style={{ marginRight: '5px' }}>{widget.title} </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div style={{ textAlign: 'center', color: 'gray', marginTop: '10px' }}>No filters available</div>
    )}
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
              style={{ width: '250px', height: 'auto', margin:'20px', float: 'left' }}
            >
              <div style={{ textAlign: 'end', marginBottom:'-20px', marginRight:'5px' }}>
                <button className='widget-hide-btn' style={{position:'relative', border:'none', background:'wihite', borderRadius:'100px', cursor:'pointer'}} onClick={() => handleHideWidget(index)}>-</button>
              </div>
              <CreateWidgetItem
                style={{ background:'#4BB7D3 !important' }}
              >
                <Icon>
                  <div style={{ background: '#fff6', borderRadius: '100px', padding: '20px', margin: 'auto', display: 'flex' }}>
                    <img style={{ height: '30px', width: 'auto', margin: 'auto', filter: 'brightness(0) invert(1)' }} src={widget.icon_url || 'default_icon_url'} alt={widget.title} />
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
