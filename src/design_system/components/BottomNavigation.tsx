import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Typography } from '../index';
import { useLanguage } from '../../contexts/LanguageContext';

interface BottomNavigationProps {
  disabledItems?: string[];
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ disabledItems = [] }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isRTL } = useLanguage();

  const navigationItems = [
    {
      key: 'overview',
      label: t('nav.overview'),
      icon: 'check' as const,
      path: '/dashboard',
    },
    {
      key: 'inventory',
      label: t('nav.inventory'),
      icon: 'user' as const,
      path: '/dashboard/cars',
    },
    {
      key: 'settings',
      label: t('nav.settings'),
      icon: 'phone' as const,
      path: '/dashboard/office-configs',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (item: typeof navigationItems[0]) => {
    // Prevent navigation if item is disabled
    if (disabledItems.includes(item.key)) {
      return;
    }
    navigate(item.path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex items-center justify-around py-2 px-4 border-t border-gray-200 bg-white shadow-lg">
      {navigationItems.map((item) => {
        const isActiveItem = isActive(item.path);
        const isDisabled = disabledItems.includes(item.key);
        
        return (
          <button
            key={item.key}
            onClick={() => handleNavClick(item)}
            disabled={isDisabled}
            className={`
              flex flex-col items-center gap-1 py-2 px-3 min-w-0 rounded-lg transition-colors
              ${isActiveItem ? 'text-primary' : 'text-gray-500'}
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
            `}
          >
            <Icon 
              name={item.icon} 
              size="small" 
              className={`${isActiveItem ? 'text-primary' : 'text-gray-500'} ${isDisabled ? 'opacity-50' : ''}`}
            />
            <Typography 
              variant="label-small" 
              className={`text-center leading-tight ${isActiveItem ? 'text-primary' : 'text-gray-500'} ${isDisabled ? 'opacity-50' : ''}`}
            >
              {item.label}
            </Typography>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavigation; 