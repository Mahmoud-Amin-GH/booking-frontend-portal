import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Typography } from '../index';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { clearAuthToken } from '../../services/api';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  disabledItems?: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, disabledItems = [] }) => {
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
      tourTarget: 'inventory-nav',
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
    <div 
      className={`fixed left-0 top-0 h-full bg-surface border-r border-outline-variant transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${isRTL ? 'right-0 left-auto border-l border-r-0' : ''}`}
      data-tour="sidebar"
    >
      {/* Header */}
      <div className="p-4 border-b border-outline-variant">
        <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <Typography variant="title-medium" color="on-surface" className="font-bold">
              {t('dashboard.portalTitle')}
            </Typography>
          )}
          <Button variant="text" size="small" onClick={onToggle}>
            <Icon name={isCollapsed ? (isRTL ? 'arrow-left' : 'arrow-right') : (isRTL ? 'arrow-right' : 'arrow-left')} size="small" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActiveItem = isActive(item.path);
          const isDisabled = disabledItems.includes(item.key);
          
          return (
            <Button
              key={item.key}
              variant={isActiveItem ? 'filled' : 'text'}
              onClick={() => handleNavClick(item)}
              disabled={isDisabled}
              className={`w-full ${isCollapsed ? 'justify-center px-2' : `justify-start gap-3 px-4 ${isRTL ? 'flex-row-reverse' : ''}`} ${
                isDisabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''
              }`}
              data-tour={item.tourTarget}
            >
              <Icon name={item.icon} size="small" />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-outline-variant">
        <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''} ${isCollapsed ? 'justify-center' : ''}`}>
          {!isCollapsed && <LanguageSwitcher />}
        </div>
        
        <Button
          variant="text"
          onClick={handleLogout}
          className={`w-full ${isCollapsed ? 'justify-center px-2' : `justify-start gap-3 px-4 ${isRTL ? 'flex-row-reverse' : ''}`} text-error`}
        >
          <Icon name="email" size="small" />
          {!isCollapsed && <span>{t('auth.logout')}</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar; 