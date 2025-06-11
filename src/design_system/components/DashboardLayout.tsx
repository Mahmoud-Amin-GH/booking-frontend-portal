import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useInventoryStatus } from '../../hooks/useInventoryStatus';
// import Sidebar from './Sidebar';
import BottomNavigation from './BottomNavigation';

const DashboardLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isEmpty, refreshStatus } = useInventoryStatus();

  useEffect(() => {
    // Check if user is new (hasn't seen onboarding)
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      // Show onboarding after a short delay to allow layout to settle
      setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
    }
  }, []);

  // Handle conditional navigation based on inventory status
  useEffect(() => {
    if (!isLoading && isEmpty) {
      // If inventory is empty and user is trying to access overview or settings
      if (location.pathname === '/dashboard' || location.pathname === '/dashboard/office-configs') {
        navigate('/dashboard/cars', { replace: true });
      }
    }
  }, [isLoading, isEmpty, location.pathname, navigate]);

  // Create context object to pass to child components
  const inventoryContext = {
    isEmpty,
    isLoading,
    refreshStatus,
  };

  // Determine which navigation items should be disabled
  const disabledNavItems = isEmpty ? ['overview', 'settings'] : [];

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      {/* <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar}
        disabledItems={disabledNavItems}
        data-tour="sidebar"
      /> */}
      
      {/* Main content area */}
      <div 
        className={`
          transition-all duration-300 ease-in-out pb-20 md:pb-0
          ${isRTL 
            ? (isSidebarCollapsed ? 'mr-8' : 'mr-32') 
            : (isSidebarCollapsed ? 'ml-8' : 'ml-32')
          }
        `}
      >
        <Outlet context={inventoryContext} />
      </div>
      
      {/* Bottom navigation for mobile */}
      <BottomNavigation disabledItems={disabledNavItems} />
      
    </div>
  );
};

export default DashboardLayout; 