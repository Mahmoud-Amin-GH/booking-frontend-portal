import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Typography } from '../design_system';
import { useLanguage } from '../contexts/LanguageContext';

const BottomNavigation: React.FC = () => {
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

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant z-40
      md:hidden flex items-center justify-around py-2 px-4
    `}>
      {navigationItems.map((item) => (
        <Button
          key={item.key}
          variant="text"
          size="small"
          onClick={() => navigate(item.path)}
          className={`
            flex flex-col items-center gap-1 py-2 px-3 min-w-0
            ${isActive(item.path) ? 'text-primary' : 'text-on-surface-variant'}
          `}
        >
          <Icon 
            name={item.icon} 
            size="small" 
            className={isActive(item.path) ? 'text-primary' : 'text-on-surface-variant'}
          />
          <Typography 
            variant="label-small" 
            color={isActive(item.path) ? 'primary' : 'on-surface-variant'}
            className="text-center leading-tight"
          >
            {item.label}
          </Typography>
        </Button>
      ))}
    </div>
  );
};

export default BottomNavigation; 