import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Loginpage from './components/pages/login_page';
import Welcome from './components/pages/welcome';
import Calls from './components/pages/calls';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Loginpage/>} />
        <Route path="/Welcome" element={<Welcome />} />
        <Route path="/calls" element={<Calls />} />
      </Routes>
    </Router>
  );
};

export default App;
