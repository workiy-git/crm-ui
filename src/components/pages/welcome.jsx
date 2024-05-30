import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import config from '../../config/config';


const Welcome = () => {
  const navigate = useNavigate();
  const [WelcomeData, setWelcomeData] = useState([]);


  useEffect(() => {
    axios.get(`${config.apiUrl}/Pagesdata`)
      .then((response) => {
        console.log('Data received:', response.data);
        setWelcomeData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleButtonClick = () => {
    // navigate('/dashboard');
    navigate('/dashboard');

  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      {WelcomeData.map((item, index) => (
        // <img style={{ width: '100%' }} src={Image2} alt="" />
        <img alt="" src={item.welcome.Images.welcome_bg_gif1} />
      ))}
        <div style={{ position: 'absolute' }}>
        </div>
      </div>
      <div style={{ width: '50%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection:'column' }}>
        <div className="signin-signup">
          <form action="#" className="sign-in-form">
        {WelcomeData.map((item, index) => (
        <div style={{textAlign:'center'}}>
          {/* <img alt="" src={item.welcome.Images.welcome_bg_img} /> */}
          <h1 style={{fontSize:'60px', textAlign:'left'}}>{item.welcome.Texts.text1}</h1>
          <h4 style={{fontSize:'25px', lineHeight:'2', textAlign:'left', marginTop:'50px', fontWeight:'400'}}>{item.welcome.Texts.text2}</h4>
       
{/* <h4>Thank you for choosing Workiy-CRM your partner in success!</h4> */}
            <Button sx={{fontSize:'20px', mt:'40px'}} variant="contained" color="primary" onClick={handleButtonClick}>
            {item.welcome.Texts.text3}
            </Button>
            </div>
        ))}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Welcome;