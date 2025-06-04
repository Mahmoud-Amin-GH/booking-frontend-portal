import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Sidebar from './Sidebar';
import BottomNavigation from './BottomNavigation';

const DashboardLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isRTL } = useLanguage();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      
      {/* Main content area */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}
        ${isRTL ? (isSidebarCollapsed ? 'md:mr-16 md:ml-0' : 'md:mr-64 md:ml-0') : ''}
        pb-20 md:pb-0
      `}>
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* Bottom navigation for mobile */}
      <BottomNavigation />
    </div>
  );
};

export default DashboardLayout; 