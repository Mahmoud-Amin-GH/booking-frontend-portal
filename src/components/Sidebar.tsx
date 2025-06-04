import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Typography } from '../design_system';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { clearAuthToken } from '../services/api';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isRTL } = useLanguage();

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login');
  };

  const navigationItems = [
    {
      key: 'dashboard',
      label: t('common.dashboard'),
      icon: 'check' as const,
      path: '/dashboard',
    },
    {
      key: 'cars',
      label: t('dashboard.carInventory'),
      icon: 'user' as const,
      path: '/dashboard/cars',
    },
    {
      key: 'office-configs',
      label: t('dashboard.officeConfigs'),
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
      fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full bg-surface border-r border-outline-variant z-40
      transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-64'}
      hidden md:flex md:flex-col
    `}>
      {/* Header */}
      <div className={`
        p-4 border-b border-outline-variant flex items-center justify-between
        ${isCollapsed ? 'px-2' : 'px-4'}
      `}>
        {!isCollapsed && (
          <Typography variant="title-small" color="on-surface" className="font-medium">
            {t('dashboard.portalTitle')}
          </Typography>
        )}
        <Button
          variant="text"
          size="small"
          onClick={onToggle}
          className="p-2 min-w-0"
        >
          <Icon 
            name={isCollapsed ? (isRTL ? 'arrow-left' : 'arrow-right') : (isRTL ? 'arrow-right' : 'arrow-left')} 
            size="small" 
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <div key={item.key} className={`px-2 ${isCollapsed ? 'px-1' : 'px-2'}`}>
              <Button
                variant={isActive(item.path) ? 'filled' : 'text'}
                size="medium"
                onClick={() => navigate(item.path)}
                className={`
                  w-full justify-start gap-3 py-3
                  ${isCollapsed ? 'min-w-0 px-2' : 'px-4'}
                  ${isRTL ? 'flex-row-reverse' : ''}
                `}
              >
                <Icon name={item.icon} size="small" />
                {!isCollapsed && (
                  <span className={`${isRTL ? 'text-right' : 'text-left'} flex-1`}>
                    {item.label}
                  </span>
                )}
              </Button>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-outline-variant space-y-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {!isCollapsed && (
          <div className="mb-2">
            <LanguageSwitcher />
          </div>
        )}
        
        <Button
          variant="text"
          size="medium"
          onClick={handleLogout}
          className={`
            w-full justify-start gap-3 py-3 text-error
            ${isCollapsed ? 'min-w-0 px-2' : 'px-4'}
            ${isRTL ? 'flex-row-reverse' : ''}
          `}
        >
          <Icon name="close" size="small" />
          {!isCollapsed && (
            <span className={`${isRTL ? 'text-right' : 'text-left'} flex-1`}>
              {t('auth.logout')}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar; 