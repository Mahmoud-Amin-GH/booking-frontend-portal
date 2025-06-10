import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ToastProvider } from './design_system';
import { useMUITheme } from './theme/muiTheme';
import Login from './pages/Login';
import LoginMUI from './pages/LoginMUI'; // MUI Demo
import Login4Sale from './pages/Login4Sale'; // 4Sale DS Demo
import Signup from './pages/Signup';
import OTPVerification from './pages/OTPVerification';
import DashboardOverview from './pages/DashboardOverview';
import CarInventory from './pages/CarInventory';
import OfficeConfigs from './pages/OfficeConfigs';
import { DashboardLayout } from './design_system';
import './i18n'; // Initialize i18n

// Theme wrapper component that uses language context
const ThemedApp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useMUITheme();
  const { isRTL } = useLanguage();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          direction: isRTL ? 'rtl' : 'ltr',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
};

function App() {
  return (
    <LanguageProvider>
      <ThemedApp>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/login-4sale" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login-mui" element={<LoginMUI />} /> {/* MUI Demo */}
              <Route path="/login-4sale" element={<Login4Sale />} /> {/* 4Sale DS Demo */}
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
          </Router>
        </ToastProvider>
      </ThemedApp>
    </LanguageProvider>
  );
}

export default App;
