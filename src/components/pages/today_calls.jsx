import React, { useEffect } from 'react'; // Import React and useEffect from 'react'
import Header from '../organism/header';
import Menu from "../organism/menu";
import Navigation from "../organism/navigation";
import TodayCallsSubmenu from '../molecules/today_calls_submenu';



function TodayCalls() {
  useEffect(() => {
    document.title = 'Landing Page';

    return () => {
      document.title = 'Default Title';
    };
  }, []);

  return (
    <div style={{height:'100vh'}}>
      <Header />
      <div style={{ display: 'flex', height:'-webkit-fill-available' }}>
        <div style={{ width: '90px', marginTop: '45px' }}>
          <Navigation />
        </div>
        <div style={{ width: '100%', background: '#d9d9d9', borderTopLeftRadius:'10px'}}>
          <Menu />
          <TodayCallsSubmenu/>
        </div>
      </div>
    </div>
  );
}

export default TodayCalls;