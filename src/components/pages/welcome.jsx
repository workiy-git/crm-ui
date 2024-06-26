import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import config from '../../config/config';
import '../../assets/styles/welcome.css';

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
    <div className="welcome-container">
      <div className="welcome-image-container">
        <img alt="" src={welcomeData.Images.welcome_bg_img} className="welcome-image" />
      </div>
      <div className="welcome-content">
        <div className="signin-signup">
          <form action="#" className="sign-in-form">
            <div className="welcome-form-container">
              <h1 className="welcome-title">{welcomeData.Texts.text1}</h1>
              <h4 className="welcome-subtitle">{welcomeData.Texts.text2}</h4>
              <Button className="welcome-button" variant="contained" color="primary" onClick={handleButtonClick}>
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
