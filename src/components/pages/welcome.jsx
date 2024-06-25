import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import config from '../../config/config';

const Welcome = () => {
  const navigate = useNavigate();
  const [welcomeData, setWelcomeData] = useState(null);

  useEffect(() => {
    axios.get(`${config.apiUrl}/pages`)
      .then((response) => {
        console.log('Data received:', response.data);
        const pages = response.data.data;
        const welcomeDoc = pages.find(doc => doc.title === 'Welcome');
        if (welcomeDoc) {
          setWelcomeData(welcomeDoc.welcome);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleButtonClick = () => {
    navigate('/home');
  };

  if (!welcomeData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <img alt="" src={welcomeData.Images.welcome_bg_img} style={{ width: '100%' }} />
      </div>
      <div style={{ width: '50%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column' }}>
        <div className="signin-signup">
          <form action="#" className="sign-in-form">
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '60px', textAlign: 'left' }}>{welcomeData.Texts.text1}</h1>
              <h4 style={{ fontSize: '25px', lineHeight: '2', textAlign: 'left', marginTop: '50px', fontWeight: '400' }}>{welcomeData.Texts.text2}</h4>
              <Button sx={{ fontSize: '20px', mt: '40px' }} variant="contained" color="primary" onClick={handleButtonClick}>
                {welcomeData.Texts.text3}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
