import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/loginpage/login';
import Dashboard from './components/common_components/dashboard';
import Header from './components/common_components/header';
import MainNav from './components/common_components/main_nav';
import SubNav from './components/common_components/sub_nav';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <>
            <Header />
            <MainNav />
            <SubNav/>
            <Dashboard />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
