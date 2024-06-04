import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Button } from '@mui/material';
import config from '../../config/config'; // Import the configuration file

const FullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [logoData, setLogoData] = useState([]);

  const handleResize = _.debounce(() => {
    console.log('Resized!');
  }, 300);

  const toggleFullScreen = () => {
    const elem = document.documentElement;

    if (!isFullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    document.title = 'CRM';

    const handleFullScreenChange = () => {
      setIsFullScreen(!!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('msfullscreenchange', handleFullScreenChange);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(document.documentElement);

    return () => {
      document.title = 'Default Title';

      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('msfullscreenchange', handleFullScreenChange);

      resizeObserver.disconnect();
    };
  }, [handleResize]);

  useEffect(() => {
    axios.get(`${config.apiUrl}/menudata`) // Use apiUrl from the configuration file
      .then((response) => {
        console.log('Data received:', response.data);
        setLogoData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className='header_button'>
      {logoData.map((item, index) => (
        <div key={index} className="fullscreen" >
          <Button
            id="exitFullscreenButton"
            className="header_buttons"
            onClick={toggleFullScreen}
           
           
          >
            <img className="full_screen_img" alt="" src={item.menu.header.full_screen.full_screen_icon}  style={{ height: 20, padding:'30px 15px' }} />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FullScreen;