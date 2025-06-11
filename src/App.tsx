import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Signup from './pages/Signup';
import OTPVerification from './pages/OTPVerification';
import DashboardOverview from './pages/DashboardOverview';
import CarInventory from './pages/CarInventory';
import OfficeConfigs from './pages/OfficeConfigs';
import { DashboardLayout } from './design_system';
import '@mo_sami/web-design-system/dist/style.css';
import './i18n'; // Initialize i18n
import Login from './pages/Login';

// Simple wrapper component for RTL support
const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isRTL } = useLanguage();

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-gray-50"
    >
      {children}
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppWrapper>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login-4sale" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="cars" element={<CarInventory />} />
              <Route path="office-configs" element={<OfficeConfigs />} />
            </Route>
          </Routes>
        </Router>
      </AppWrapper>
    </LanguageProvider>
  );
}

export default App;
