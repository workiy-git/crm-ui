import React, { useState, useEffect } from 'react';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import config from '../../config/config';
import { Avatar, Typography } from '@mui/material';
import { headers } from '../atoms/Authorization';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function PushAPP() {
  const [companylogoData, setCompanylogoData] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    axios.get(`${config.apiUrl}/pagesdata`, {headers})
      .then((response) => {
        console.log('Data received:', response.data);
        setCompanylogoData(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleClick = () => {
    setAlertOpen(true);
  };

  const AlertButton = () => {
    return (
      <>
        {companylogoData.map((item, index) => (
          <div key={index} >
            <Avatar onClick={handleClick} style={{ height: 'fit-content', background:'none', }} >
              <img src={item.summaryPage.pushapp.image} alt="" style={{ height: '25px', width: 'auto' }} />
            </Avatar>
           <div> <Typography style={{fontSize:'10px', fontWeight:'600', color:'#808080'}}>{item.summaryPage.pushapp.title}</Typography></div>
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      <AlertButton />
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity="success" sx={{ width: '100%' }}>
          Opened in Mobile!
        </Alert>
      </Snackbar>
    </>
  );
}

export default PushAPP;
