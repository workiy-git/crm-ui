import React, { useEffect, useState } from 'react';
import Header from '../../organism/header';
import MenuComponent from "../../organism/menu";
import SideMenu from "../../organism/sidemenu";
import Submenu from '../../organism/submenu';
import BackgroundColorChanger from '../../atoms/BackgroundColorChanger';
import Footer from '../../atoms/Footer';

function Home() {
  const [backgroundColor, setBackgroundColor] = useState(() => {
    return localStorage.getItem('backgroundColor') || '#d9d9d9';
  });

  const [selectedWidgets, setSelectedWidgets] = useState([]);

  useEffect(() => {
    document.title = 'Home';

    return () => {
      document.title = 'Default Title';
    };
  }, []);



  const handleSaveSelectedText = (texts) => {
    setSelectedWidgets(texts);
  };

  const handleColorChange = (color) => {
    setBackgroundColor(color);
    localStorage.setItem('backgroundColor', color);
  };

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
    <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden', backgroundColor: "gray" ,paddingLeft:0 }}>
      
      <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden' }}>
        <div style={{ width: '10vh', overflow: 'hidden', backgroundColor: "#0d2d4e" }}>
          <SideMenu backgroundColor={backgroundColor} />
        </div>
          <div style={{ width: '100%', marginRight: "-10px", backgroundColor: backgroundColor, overflow: 'hidden' }}>
            <div>
              <Header backgroundColor={backgroundColor} />
            <BackgroundColorChanger colors={randomGradientColors} onColorChange={handleColorChange} />

            </div>
            <div>
              <MenuComponent  onSaveSelectedText={handleSaveSelectedText} backgroundColor={backgroundColor} />
            </div>
            <div>
              <Submenu backgroundColor={backgroundColor} />
            </div>
          </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;