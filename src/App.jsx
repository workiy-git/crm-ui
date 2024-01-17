import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import LandingPage from './components/Landing_page';
import TodayCall from './components/calls/todaycalls';


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<LandingPage />} />
        <Route path="/todaycalls" element={<TodayCall />} />
      </Routes>
    </Router>
  );
}

export default App;