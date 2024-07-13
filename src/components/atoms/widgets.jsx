import React, { useState, useEffect } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button, Box } from '@material-ui/core';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../config/config';

const CreateWidgetItem = styled(Paper)(({ theme }) => ({
  backgroundColor: '#ffffff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '75%',
  height: 100,
  borderRadius: 5,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  marginTop: '15%',
  marginLeft: '5%',
}));

const Icon = styled('div')({
  width: '30px',
  height: '30px',
  marginBottom: '8px',
});

const Title = styled('div')({
  marginTop: '8px',
});

const Count = styled('div')({
  marginTop: '8px',
  fontWeight: 'bold',
});

const ScrollContainer = styled(Box)({
  maxHeight: '400px', // Adjust this value as needed
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
        dashboardName: dashboardName, // Dynamically pass dashboardName
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
  const navigate = useNavigate();

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

  return (
    <ScrollContainer>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1} columns={{ xs: 5 }}>
          {widgets.length > 0 ? widgets.map((widget, index) => (
            <Grid item xs={1} sm={1} md={1} key={index} sx={{ marginBottom: '10px' }}>
              <CreateWidgetItem style={{ background: `linear-gradient(${backgroundColor})` }}>
                <Icon>
                  <img src={widget.icon_url || 'default_icon_url'} alt={widget.title} />
                </Icon>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(widget.apiRedirectEndpoint)}
                >
                  {widget.title}
                </Button>
                <Title>{widget.title}</Title>
                <Count>{counts[widget.name] !== undefined ? counts[widget.name] : 'Loading...'}</Count>
              </CreateWidgetItem>
            </Grid>
          )) : <div>Loading...</div>}
        </Grid>
      </Box>
    </ScrollContainer>
  );
};

export default CreateWidget;
