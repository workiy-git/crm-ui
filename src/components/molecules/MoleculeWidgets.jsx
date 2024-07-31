import React, { useState, useEffect, useCallback, useRef } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@material-ui/core/Box';
import axios from 'axios';
import config from '../../config/config';
import WidgetsIcon from '@mui/icons-material/WidgetsOutlined';
import AtomWidget from '../atoms/widgets';
import '../../assets/styles/style.css';

const ScrollContainer = styled(Box)({
  overflowY: 'auto',
});

async function retrieveWidgets(dashboardName) {
  try {
    const response = await axios.post(`${config.apiUrl}/dashboards/retrieve`, [
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
    });

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

const MoleculeWidgets = ({ dashboardName }) => {
  const [widgets, setWidgets] = useState([]);
  const [counts, setCounts] = useState({});
  const [hiddenWidgets, setHiddenWidgets] = useState([]);
  const [showHiddenWidgets, setShowHiddenWidgets] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const hiddenWidgetsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const retrievedWidgets = await retrieveWidgets(dashboardName);
      setWidgets(retrievedWidgets);

      // Prepare all count retrieval promises
      const countPromises = retrievedWidgets.map(widget =>
        retrieveWidgetCount(widget.apiEndpoint, JSON.parse(widget.apiEndpointFilter), dashboardName)
          .then(count => ({ name: widget.name, count }))
      );

      // Resolve all promises in parallel
      const countsArray = await Promise.all(countPromises);

      // Transform array into an object
      const countsData = countsArray.reduce((acc, { name, count }) => {
        acc[name] = count;
        return acc;
      }, {});

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

  const handleDragStart = useCallback((index) => {
    setDraggingIndex(index);
    setTimeout(() => {
      document.querySelector(`.widget-${index}`).style.opacity = '1';
    }, 0);
  }, []);

  const handleDragEnter = useCallback((index) => {
    if (draggingIndex !== null && draggingIndex !== index) {
      const updatedWidgets = [...widgets];
      const [draggedWidget] = updatedWidgets.splice(draggingIndex, 1);
      updatedWidgets.splice(index, 0, draggedWidget);
      setWidgets(updatedWidgets);
      setDraggingIndex(index);
    }
  }, [draggingIndex, widgets]);

  const handleDragEnd = useCallback((index) => {
    setDraggingIndex(null);
    document.querySelector(`.widget-${index}`).style.opacity = '1';
  }, []);

  const handleHideWidget = useCallback((index) => {
    setHiddenWidgets([...hiddenWidgets, widgets[index]]);
    setWidgets(widgets.filter((_, i) => i !== index));
  }, [hiddenWidgets, widgets]);

  const toggleShowHiddenWidgets = useCallback(() => {
    setShowHiddenWidgets(!showHiddenWidgets);
  }, [showHiddenWidgets]);

  const handleRestoreWidget = useCallback((index) => {
    setWidgets([...widgets, hiddenWidgets[index]]);
    setHiddenWidgets(hiddenWidgets.filter((_, i) => i !== index));
  }, [hiddenWidgets, widgets]);

  return (
    <ScrollContainer>
      <Box sx={{ flexGrow: 1 }}>
        <div style={{ width: '100%' }}>
          <div style={{ position: 'absolute', top: '90%', right: '50px' }}>
            <button style={{border:'none', alignItems:'center', display:'flex', padding:'8px', borderRadius:'5px'}} onClick={toggleShowHiddenWidgets}><WidgetsIcon /></button>
          </div>
          {showHiddenWidgets && hiddenWidgets.length > 0 && (
            <div
              ref={hiddenWidgetsRef}
              style={{ position: 'absolute', top: '50%', right: '8%', background: 'white', padding: '20px', maxHeight: '30%', overflow: 'auto', borderRadius: '5px' }}
            >
              {hiddenWidgets.map((widget, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', background: 'rgb(255, 192, 61)', padding: '5px', borderRadius: '5px', margin: '10px' }}>
                    <div style={{ display: 'flex', cursor: 'pointer' }} onClick={() => handleRestoreWidget(index)}>
                      <div style={{ background: 'white', borderRadius: '100px', padding: '5px', margin: 'auto', display: 'flex', marginRight: '5px' }}>
                        <img style={{ height: '15px', width: 'auto', margin: 'auto', filter: 'brightness(0) saturate(100%) invert(50%) sepia(100%) saturate(500%) hue-rotate(190deg)' }} src={widget.icon_url || 'default_icon_url'} alt={widget.title} />
                      </div>
                      <div style={{ marginRight: '5px' }}>{widget.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {widgets.length > 0 ? widgets.map((widget, index) => (
            <AtomWidget
              key={index}
              widget={widget}
              count={counts[widget.name]}
              onHide={handleHideWidget}
              onDragStart={handleDragStart}
              onDragEnter={handleDragEnter}
              onDragEnd={handleDragEnd}
              index={index}
            />
          )) : <div>There is no data</div>}
        </div>
      </Box>
    </ScrollContainer>
  );
};

export default MoleculeWidgets;
