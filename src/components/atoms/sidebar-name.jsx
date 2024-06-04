import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import '../../assets/styles/sidebarnames.css';

export default function SimpleContainer({ visibleText }) {
  const texts = {
    calls: "Calls",
    enquiry: "Enquiry",
    leads: "Leads",
    report: "Reports",
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lm" className='side-bar-name'>
        <Box className='side-bar-text'>
          {texts[visibleText]}
        </Box>
      </Container>
    </React.Fragment>
  );
}