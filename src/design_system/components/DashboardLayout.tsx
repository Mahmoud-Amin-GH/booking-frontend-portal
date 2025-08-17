import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sidebar, type SidebarItem as BaseSidebarItem, Button } from '@mo_sami/web-design-system';
import { useLanguage } from '../../contexts/LanguageContext';
import { useInventoryStatus } from '../../hooks/useInventoryStatus';
import { clearAuthToken } from '../../services/api';

// Extend SidebarItem type to support nested items
interface SidebarItem extends BaseSidebarItem {
  items?: SidebarItem[];
}

const DashboardLayout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, switchLanguage } = useLanguage();

  // Inventory status hook
  const { isLoading, isEmpty, refreshStatus } = useInventoryStatus();

  // Handle conditional navigation based on inventory status
  useEffect(() => {
    if (!isLoading && isEmpty) {
      // set the active sidebar item to daily rentals
      const carsSidebarItem = sidebarItems.find(item => item.id === 'daily-rentals');
      if (carsSidebarItem) {
        carsSidebarItem.active = true;
      }
    }
  }, [isLoading, isEmpty, location.pathname, navigate]);

  // Create context object to pass to child components
  const inventoryContext = {
    isEmpty,
    isLoading,
    refreshStatus,
  };

  // Navigation enabled by default; no user status gating
  const allNavDisabled = false;
  // Only disable overview when inventory is empty, office configs and price tiers should always be available
  const disabledNavItems = allNavDisabled ? ['overview', 'cars', 'office-configs', 'price-tiers'] : (isEmpty ? ['overview', 'office-configs', 'price-tiers'] : []);

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
    // {
    //   id: 'overview',
    //   label: disabledNavItems.includes('overview') ? `${t('nav.overview')}` : t('nav.overview'),
    //   href: '/dashboard',
    //   active: location.pathname === '/dashboard',
    //   onClick: () => {
    //     if (!disabledNavItems.includes('overview')) {
    //       navigate('/dashboard');
    //     }
    //   }
    // },
    {
      id: 'cars',
      label: disabledNavItems.includes('cars') ? `${t('nav.inventory')}` : t('nav.inventory'),
      children: [
        {
          id: 'daily-rentals',
          label: t('nav.inventory.daily', 'Daily Rentals'),
          href: '/dashboard/cars/daily',
          active: location.pathname === '/dashboard/cars/daily',
          onClick: () => {
            if (!disabledNavItems.includes('cars')) {
              navigate('/dashboard/cars/daily');
            }
          }
        },
        {
          id: 'long-term-rentals',
          label: t('nav.inventory.longTerm', 'Long-term Rentals'),
          href: '/dashboard/cars/long-term',
          active: location.pathname === '/dashboard/cars/long-term',
          onClick: () => {
            if (!disabledNavItems.includes('cars')) {
              navigate('/dashboard/cars/long-term');
            }
          }
        },
        {
          id: 'leasing',
          label: t('nav.inventory.leasing', 'Leasing'),
          href: '/dashboard/cars/leasing',
          active: location.pathname === '/dashboard/cars/leasing',
          onClick: () => {
            if (!disabledNavItems.includes('cars')) {
              navigate('/dashboard/cars/leasing');
            }
          }
        }
      ]
    },
    {
      id: 'price-tiers',
      label: disabledNavItems.includes('price-tiers') ? `${t('nav.priceTiers')}` : t('nav.priceTiers'),
      href: '/dashboard/price-tiers',
      active: location.pathname === '/dashboard/price-tiers',
      onClick: () => {
        if (!disabledNavItems.includes('price-tiers')) {
          navigate('/dashboard/price-tiers');
        }
      }
    },
    {
      id: 'office-configs',
      label: disabledNavItems.includes('office-configs') ? `${t('nav.settings')}` : t('nav.settings'),
      href: '/dashboard/office-configs',
      active: location.pathname === '/dashboard/office-configs',
      onClick: () => {
        if (!disabledNavItems.includes('office-configs')) {
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
        disabled={allNavDisabled}
      >
        {language === 'en' ? 'العربية' : 'English'}
      </Button>
      
      {/* Logout Button */}
      <Button
        variant="text"
        size="sm"
        onClick={handleLogout}
        className="w-full justify-start font-sakr font-normal text-error-600 hover:text-error-700"
        disabled={allNavDisabled}
      >
        {t('auth.logout')}
      </Button>
    </div>
  );

  // Removed pending state UI; user status no longer applicable

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