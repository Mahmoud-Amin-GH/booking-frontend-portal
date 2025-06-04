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
    <div className={`
      fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant z-40
      md:hidden flex items-center justify-around py-2 px-4
    `}>
      {navigationItems.map((item) => {
        const isActiveItem = isActive(item.path);
        const isDisabled = disabledItems.includes(item.key);
        
        return (
          <Button
            key={item.key}
            variant="text"
            size="small"
            onClick={() => handleNavClick(item)}
            disabled={isDisabled}
            className={`
              flex flex-col items-center gap-1 py-2 px-3 min-w-0
              ${isActiveItem ? 'text-primary' : 'text-on-surface-variant'}
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <Icon 
              name={item.icon} 
              size="small" 
              className={`${isActiveItem ? 'text-primary' : 'text-on-surface-variant'} ${
                isDisabled ? 'opacity-50' : ''
              }`}
            />
            <Typography 
              variant="label-small" 
              color={isActiveItem ? 'primary' : 'on-surface-variant'}
              className={`text-center leading-tight ${isDisabled ? 'opacity-50' : ''}`}
            >
              {item.label}
            </Typography>
          </Button>
        );
      })}
    </div>
  );
};

export default BottomNavigation; 