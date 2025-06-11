import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Login4Sale from './pages/Login4Sale';
import Signup from './pages/Signup';
import OTPVerification from './pages/OTPVerification';
// import DashboardOverview from './pages/DashboardOverview';
// import CarInventory from './pages/CarInventory';
// import OfficeConfigs from './pages/OfficeConfigs';
// import { DashboardLayout } from './design_system';
import './design_system_4sale'; // Import 4Sale Design System styles
import './i18n'; // Initialize i18n

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
            <Route path="/" element={<Navigate to="/signup" replace />} />
            <Route path="/login-4sale" element={<Login4Sale />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            
            {/* Dashboard routes commented out until migration is complete */}
            {/* 
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="cars" element={<CarInventory />} />
              <Route path="office-configs" element={<OfficeConfigs />} />
            </Route>
            */}
          </Routes>
        </Router>
      </AppWrapper>
    </LanguageProvider>
  );
}

export default App;
