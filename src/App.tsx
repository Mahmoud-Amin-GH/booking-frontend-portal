import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './design_system';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OTPVerification from './pages/OTPVerification';
import Dashboard from './pages/Dashboard';
import CarInventory from './pages/CarInventory';
import './i18n'; // Initialize i18n

function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-otp" element={<OTPVerification />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cars" element={<CarInventory />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
