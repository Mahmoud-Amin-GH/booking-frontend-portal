import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Sidebar from './Sidebar';
import BottomNavigation from './BottomNavigation';
import OnboardingTour from './OnboardingTour';

const DashboardLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { isRTL } = useLanguage();

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
    <div className="min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar}
        data-tour="sidebar"
      />
      
      {/* Main content area */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${isSidebarCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64')}
        md:${isSidebarCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64')}
        pb-20 md:pb-0
      `}>
        <Outlet />
      </div>
      
      {/* Bottom navigation for mobile */}
      <BottomNavigation />
      
      {/* Onboarding Tour */}
      <OnboardingTour
        isVisible={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    </div>
  );
};

export default DashboardLayout; 