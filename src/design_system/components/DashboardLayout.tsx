import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar, type SidebarItem } from '@mo_sami/web-design-system';
import { useLanguage } from '../../contexts/LanguageContext';
import { useInventoryStatus } from '../../hooks/useInventoryStatus';

const DashboardLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isEmpty, refreshStatus } = useInventoryStatus();

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

  // Create sidebar navigation items
  const sidebarItems: SidebarItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      href: '/dashboard',
      active: location.pathname === '/dashboard',
      onClick: () => {
        if (!disabledNavItems.includes('overview')) {
          navigate('/dashboard');
        }
      }
    },
    {
      id: 'cars',
      label: 'Car Inventory',
      href: '/dashboard/cars',
      active: location.pathname === '/dashboard/cars',
      onClick: () => navigate('/dashboard/cars')
    },
    {
      id: 'office-configs',
      label: 'Office Configs',
      href: '/dashboard/office-configs',
      active: location.pathname === '/dashboard/office-configs',
      onClick: () => {
        if (!disabledNavItems.includes('settings')) {
          navigate('/dashboard/office-configs');
        }
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop */}
      <Sidebar 
        items={sidebarItems}
        collapsible={true}
        collapsed={isSidebarCollapsed}
        onCollapsedChange={setIsSidebarCollapsed}
        className="h-screen sticky top-0"
        variant="default"
        width="md"
        data-tour="sidebar"
      />
      
      {/* Main content area */}
      <div className="flex-1 transition-all duration-300 ease-in-out pb-20 md:pb-0">
        <Outlet context={inventoryContext} />
      </div>

    </div>
  );
};

export default DashboardLayout; 