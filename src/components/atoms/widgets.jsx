import React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

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
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  marginTop: '15%',
  marginLeft: '5%',
}));

const Icon = styled('div')({
  width: '30px',
  height: '30px',
  marginLeft: '-1%',
});

const Title = styled('div')({
  marginLeft: '-1%',
});

const ScrollContainer = styled(Box)({
  maxHeight: '400px', // Adjust this value as needed
  overflowY: 'auto',
});

const CreateWidget = ({ backgroundColor, widgets }) => (
  <ScrollContainer>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1} columns={{ xs: 5 }}>
        {widgets.map((widget, index) => (
          <Grid item xs={1} sm={1} md={1} key={index} sx={{ marginBottom: '10px' }}>
            <CreateWidgetItem style={{ background: `linear-gradient(${backgroundColor})` }}>
              <Icon>{widget.icon}</Icon>
              <Title>{widget.title}</Title>
            </CreateWidgetItem>
          </Grid>
        ))}
      </Grid>
    </Box>
  </ScrollContainer>
);

export default CreateWidget;
