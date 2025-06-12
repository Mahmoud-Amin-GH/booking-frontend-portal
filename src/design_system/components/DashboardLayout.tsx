import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sidebar, type SidebarItem, Button } from '@mo_sami/web-design-system';
import { useLanguage } from '../../contexts/LanguageContext';
import { useInventoryStatus } from '../../hooks/useInventoryStatus';
import { clearAuthToken } from '../../services/api';

const DashboardLayout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, switchLanguage } = useLanguage();
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

  // Handle logout
  const handleLogout = () => {
    clearAuthToken();
    navigate('/login-4sale');
  };

  // Handle language switch
  const handleLanguageSwitch = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    switchLanguage(newLanguage);
  };

  // Create sidebar navigation items with disabled state handling
  const sidebarItems: SidebarItem[] = [
    {
      id: 'overview',
      label: disabledNavItems.includes('overview') ? `${t('nav.overview')} (${t('common.disabled')})` : t('nav.overview'),
      href: '/dashboard',
      active: location.pathname === '/dashboard' && !disabledNavItems.includes('overview'),
      onClick: () => {
        if (!disabledNavItems.includes('overview')) {
          navigate('/dashboard');
        }
      }
    },
    {
      id: 'cars',
      label: t('nav.inventory'),
      href: '/dashboard/cars',
      active: location.pathname === '/dashboard/cars',
      onClick: () => navigate('/dashboard/cars')
    },
    {
      id: 'office-configs',
      label: disabledNavItems.includes('settings') ? `${t('nav.settings')} (${t('common.disabled')})` : t('nav.settings'),
      href: '/dashboard/office-configs',
      active: location.pathname === '/dashboard/office-configs' && !disabledNavItems.includes('settings'),
      onClick: () => {
        if (!disabledNavItems.includes('settings')) {
          navigate('/dashboard/office-configs');
        }
      }
    }
  ];

  // Sidebar footer with logout and language switch buttons
  const sidebarFooter = (
    <div className="p-4 border-t border-neutral-200 space-y-3">
      {/* Language Switch Button */}
      <Button
        variant="text"
        size="sm"
        onClick={handleLanguageSwitch}
        className="w-full justify-start font-sakr font-normal text-text-secondary hover:text-text-primary"
      >
        {language === 'en' ? 'العربية' : 'English'}
      </Button>
      
      {/* Logout Button */}
      <Button
        variant="text"
        size="sm"
        onClick={handleLogout}
        className="w-full justify-start font-sakr font-normal text-error-600 hover:text-error-700"
      >
        {t('auth.logout')}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop */}
      <Sidebar 
        items={sidebarItems}
        footer={sidebarFooter}
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