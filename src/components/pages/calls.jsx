import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

import Header from '../organism/header';
import SideMenu from "../organism/sidemenu";
import CallsGrid from '../molecules/call_app_bar';

function Calls() {
  // const [backgroundColor, setBackgroundColor] = useState(() => {
  const [backgroundColor] = useState(() => {

    return localStorage.getItem('backgroundColor') || '#d9d9d9';
  });

  // const [selectedWidgets, setSelectedWidgets] = useState([]);

  useEffect(() => {
    document.title = 'Home';

    return () => {
      document.title = 'Default Title';
    };
  }, []);

  // const handleColorChange = (color) => {
  //   setBackgroundColor(color);
  //   localStorage.setItem('backgroundColor', color);
  // };

  // const handleSaveSelectedText = (texts) => {
  //   setSelectedWidgets(texts);
  // };

  const randomGradientColors = [];
  function generateRandomLightColor() {
    const r = Math.floor(Math.random() * 128) + 128;
    const g = Math.floor(Math.random() * 128) + 128;
    const b = Math.floor(Math.random() * 128) + 128;
    return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
  }
  for (let i = 0; i < 30; i++) {
    const color1 = generateRandomLightColor();
    const color2 = generateRandomLightColor();
    const linearGradient = `linear-gradient(145deg, ${color1}, ${color2})`;
    randomGradientColors.push(linearGradient);
  }

  
  
  return (
    <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden', backgroundColor:"gray" }}>
     
      <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden' }}>
      <div style={{ width: '10vh', overflow: 'hidden', backgroundColor: "#0d2d4e" }}>
          <SideMenu backgroundColor={backgroundColor} />
        </div>
        <div style={{ width: '100%', marginRight: "-10px", backgroundColor: backgroundColor, overflow: 'hidden' }}>
        <div>
            <Header backgroundColor={backgroundColor} />
        </div>
        <div>
        <Typography style={{ height:'10rem', color:'white', padding:'10px', fontSize:'30px',backgroundColor:{backgroundColor}  }}>
          calls
        </Typography>
        </div>
       <CallsGrid />
          
        </div>
      </div>
    </div>
  );
}

export default Calls;
