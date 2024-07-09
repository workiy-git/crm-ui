import React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const CreateWidgetItem = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: 100,
  borderRadius: 5,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  marginTop: '5%',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Icon = styled('div')(({ theme }) => ({
  width: '30px',
  height: '30px',
  marginLeft: '-1%',
}));

const Title = styled('div')(({ theme }) => ({
  marginLeft: '-1%',
}));

const CreateWidget = ({ backgroundColor, widgets }) => (
  <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={2}>
      {widgets.map((widget, index) => (
        <Grid item xs={6} sm={4} md={3} key={index}>
          <CreateWidgetItem style={{ background: backgroundColor }}>
            <Icon>{widget.icon}</Icon>
            <Title>{widget.title}</Title>
          </CreateWidgetItem>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default CreateWidget;
