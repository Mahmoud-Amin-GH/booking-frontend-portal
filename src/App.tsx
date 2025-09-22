import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import CarInventory from './pages/CarInventory';
import OfficeConfigs from './pages/OfficeConfigs';
import { PriceTiers } from './pages/PriceTiers';
import { DashboardLayout } from './design_system';
import '@mo_sami/web-design-system/dist/style.css';
import './i18n';
import Login from './pages/Login';
import ReceivedBookings from './pages/ReceivedBookings';




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
            <Route path="/" element={<Navigate to="/login-4sale" replace />} />
            <Route path="/login-4sale" element={<Login />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard/cars/daily" replace />} />
              <Route path="cars" element={<Navigate to="/dashboard/cars/daily" replace />} />
              <Route path="cars/daily" element={<CarInventory />} />
              <Route path="cars/long-term" element={<CarInventory />} />
              <Route path="cars/leasing" element={<CarInventory />} />
              <Route path="office-configs" element={<OfficeConfigs />} />
              <Route path="price-tiers" element={<PriceTiers />} />
              <Route path="received-bookings" element={<ReceivedBookings />} />
              
              {/* Availability Management Routes */}
              
              
              
            </Route>
          </Routes>
        </Router>
      </AppWrapper>
    </LanguageProvider>
  );
}

export default App;
