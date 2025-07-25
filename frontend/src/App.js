import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import MakerDashboard from './MakerDashboard';
import CheckerDashboard from './CheckerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/maker" element={<MakerDashboard />} />
        <Route path="/checker" element={<CheckerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
