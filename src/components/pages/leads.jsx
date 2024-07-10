import React, { useState } from 'react';
import { Typography } from '@mui/material';
import Header from '../organism/header';
import SideMenu from "../organism/sidemenu";
import Grid from '../organism/grid';

function Leads() {
  const endpoint = '/appdata';
  const [backgroundColor] = useState(() => {
    return localStorage.getItem('backgroundColor') || '#d9d9d9';
  });

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
    <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden' }}>
      <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden' }}>
        <div style={{ width: '10vh', backgroundColor: "#0d2d4e" }}>
          <SideMenu backgroundColor={backgroundColor} />
        </div>
        <div style={{ width: '100%', backgroundColor: backgroundColor, overflow: 'hidden' }}>
          <Header backgroundColor={backgroundColor} />
          <Typography style={{ height: '3rem', color: 'white', padding: '10px', fontSize: '30px', background: 'linear-gradient(90deg, rgba(12,45,78,1) 0%, rgba(28,104,180,1) 100%)' }}>
            Leads
          </Typography>
          <Grid endpoint={endpoint} pageName="leads" />
        </div>
      </div>
    </div>
  );
}

export default Leads;
