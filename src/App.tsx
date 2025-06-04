import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './design_system';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OTPVerification from './pages/OTPVerification';
import DashboardOverview from './pages/DashboardOverview';
import CarInventory from './pages/CarInventory';
import OfficeConfigs from './pages/OfficeConfigs';
import DashboardLayout from './components/DashboardLayout';
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
              
              {/* Dashboard with nested routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="cars" element={<CarInventory />} />
                <Route path="office-configs" element={<OfficeConfigs />} />
              </Route>
              
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
