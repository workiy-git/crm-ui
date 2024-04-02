import React, { useEffect} from 'react';
import Header from '../organism/header';


function LandingPage() {

  useEffect(() => {
    document.title = 'Landing Page';

    return () => {
      document.title = 'Default Title';
    };
  }, []);
  return (
    <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden',backgroundColor:"gray" }}>
      <Header />
    </div>
  );
}

export default LandingPage;
