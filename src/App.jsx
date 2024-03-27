import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/pages/landing_page';
import TodayCalls from './components/pages/today_calls';



function App() {
  return (
    <Router>
      <Routes>
      {/* <Route path="/login" element={<LoginPage/>} /> */}
      <Route path="/" element={<LandingPage/>} />
      <Route path="/Todaycalls" element={<TodayCalls/>} />
      </Routes>
    </Router>
  );
}

export default App;