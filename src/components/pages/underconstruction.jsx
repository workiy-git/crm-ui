import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../atoms/Footer';
import config from '../../config/config';
import Icon from '../../assets/underconstruction.png';

function Underconstruction() {
  const [backgroundColor] = useState(() => {
    return sessionStorage.getItem('backgroundColor') || '#d9d9d9';
  });
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    document.title = 'Home';

    axios.get(`${config.apiUrl}/pages`)
      .then((response) => {
        console.log('Data received:', response.data);
        const pages = response.data.data;
        const homeDoc = pages.find(doc => doc.title === 'Home');
        if (homeDoc) {
          setHomeData(homeDoc);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    return () => {
      document.title = 'Default Title';
    };
  }, []);

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

  if (!homeData) {
    return
  }

  return (
    <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden', backgroundColor: "#dde1e9", paddingLeft: 0 }}>
      <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden' }}>
        {/* <div style={{ backgroundColor: "#121A2C" }}>
          <SideMenu backgroundColor={backgroundColor} />
        </div> */}
        <div style={{ width: '100%', marginRight: "-10px", backgroundColor: backgroundColor, overflow: 'hidden' }}>
          {/* <div>
            <Header backgroundColor={backgroundColor} />
          </div> */}
          <div style={{textAlign:'center', position:'relative', top:'20%'}}>
            <img src={Icon} alt="Under Construction"  />
          </div>
      
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Underconstruction;
