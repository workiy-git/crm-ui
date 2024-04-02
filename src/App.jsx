import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/pages/landing_page';




function App() {
  return (
    <Router>
      <Routes>
      {/* <Route path="/login" element={<LoginPage/>} /> */}
      <Route path="/" element={<LandingPage/>} />
    
      </Routes>
    </Router>
  );
}

export default App;