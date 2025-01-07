import React from 'react';
import LandingPage from './components/LandingPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from './components/authform';
import Dashboard from './components/dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;


