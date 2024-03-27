import React, { useEffect, useState } from 'react';
import Header from '../organism/header';
import MenuComponent from "../organism/menu";
import Navigation from "../organism/navigation";
import Submenu from '../organism/submenu';
import Widget from '../molecules/widget';

import BackgroundColorChanger from '../atoms/BackgroundColorChanger';

function LandingPage() {
  const [backgroundColor, setBackgroundColor] = useState('#d9d9d9');

  useEffect(() => {
    document.title = 'Landing Page';

    return () => {
      document.title = 'Default Title';
    };
  }, []);

  const handleColorChange = (color) => {
    setBackgroundColor(color);
  };

  const colors = [
    'linear-gradient(45deg, #FFDDC1, #AEEEFF)',
    'linear-gradient(45deg, #C1FFC1, #FFF8A9)',
    'linear-gradient(45deg, #FFD700, #FFA07A)',
    'linear-gradient(45deg, #F0E68C, #FFDAB9)',
  ];
  
  
  return (
    <div style={{ height: '100vh', display:"flex", flexDirection:"column", overflow: 'hidden' }}>
      <Header  />
      <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden' }}>
        <div style={{ width: '90px', overflow: 'hidden' }}>
          <Navigation  />
        </div>
        <div style={{ width: '100%', borderTopLeftRadius: '10px', backgroundColor: backgroundColor, overflow: 'hidden' }}>
          <MenuComponent backgroundColor={backgroundColor} />
          <Submenu  />
          <Widget />
          <BackgroundColorChanger colors={colors} onColorChange={handleColorChange} />
        </div>
      </div>
  
    </div>
  );
}

export default LandingPage;
