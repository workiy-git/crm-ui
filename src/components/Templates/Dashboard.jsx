import React, { useEffect, useState } from 'react';
import Header from '../../organism/SuperadminHeader';
import SideMenu from "../../organism/SuperadminsecondaryMenu";
import Footer from '../../atoms/Footer';
import PieArcLabel from '../../atoms/piechart';
import BarChaer from '../../atoms/barChart';
import ParentChartComponent from '../../molecules/ParentChartComponent';

function Dashboard() {
  const [backgroundColor, setBackgroundColor] = useState(() => {
    return localStorage.getItem('backgroundColor') || '#d9d9d9';
  });

  const [selectedWidgets, setSelectedWidgets] = useState([]);

  useEffect(() => {
    document.title = 'Dashboard';

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
    const linearGradient = linear-gradient(145deg, ${color1}, ${color2});
    randomGradientColors.push(linearGradient);
  }

  return (
    <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden', backgroundColor: "#f1f2f6" ,paddingLeft:0 }}>
      
      <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden', padding:'20px 0 10px 50px'  }}>
        <div style={{  overflow: 'hidden', backgroundColor: "#0d2d4e", padding:'10px', borderRadius:'10px'}}>
          <SideMenu backgroundColor={backgroundColor} />
        </div>
          <div style={{ width: '100%', marginRight: "-10px", backgroundColor: backgroundColor, overflow: 'hidden' }}>
            <div>
              <Header backgroundColor={backgroundColor} />

            </div>
            <div style={{display:'flex', width:'100%'}}>
              <ParentChartComponent />
            </div>
          </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;