import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Stack } from '@mui/material';
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
    <Paper
      elevation={2}
      data-tour="sidebar"
      sx={{
        position: 'fixed',
        left: isRTL ? 'auto' : 0,
        right: isRTL ? 0 : 'auto',
        top: 0,
        height: '100vh',
        width: isCollapsed ? 64 : 256,
        borderRadius: 0,
        borderRight: isRTL ? 0 : 1,
        borderLeft: isRTL ? 1 : 0,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: isCollapsed ? 'center' : 'space-between',
          }}
        >
          {!isCollapsed && (
            <Typography variant="title-medium" color="on-surface" sx={{ fontWeight: 'bold' }}>
              {t('dashboard.portalTitle')}
            </Typography>
          )}
          <Button variant="text" size="small" onClick={onToggle}>
            <Icon name={isCollapsed ? (isRTL ? 'arrow-left' : 'arrow-right') : (isRTL ? 'arrow-right' : 'arrow-left')} size="small" />
          </Button>
        </Box>
      </Box>

      {/* Navigation */}
      <Box component="nav" sx={{ p: 2, flex: 1 }}>
        <Stack spacing={1}>
          {navigationItems.map((item) => {
            const isActiveItem = isActive(item.path);
            const isDisabled = disabledItems.includes(item.key);
            
            return (
              <Button
                key={item.key}
                variant={isActiveItem ? 'filled' : 'text'}
                onClick={() => handleNavClick(item)}
                disabled={isDisabled}
                data-tour={item.tourTarget}
                sx={{
                  width: '100%',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  flexDirection: (isRTL && !isCollapsed) ? 'row-reverse' : 'row',
                  gap: isCollapsed ? 0 : 1.5,
                  px: isCollapsed ? 1 : 2,
                  opacity: isDisabled ? 0.5 : 1,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  '&:hover': {
                    backgroundColor: isDisabled ? 'transparent' : undefined,
                  },
                }}
              >
                <Icon name={item.icon} size="small" />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </Stack>
      </Box>

      {/* User Section */}
      <Box 
        sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: 'divider',
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: 1.5,
            mb: 1.5,
          }}
        >
          {!isCollapsed && <LanguageSwitcher />}
        </Box>
        
        <Button
          variant="text"
          onClick={handleLogout}
          sx={{
            width: '100%',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            flexDirection: (isRTL && !isCollapsed) ? 'row-reverse' : 'row',
            gap: isCollapsed ? 0 : 1.5,
            px: isCollapsed ? 1 : 2,
            color: 'error.main',
          }}
        >
          <Icon name="email" size="small" />
          {!isCollapsed && <span>{t('auth.logout')}</span>}
        </Button>
      </Box>
    </Paper>
  );
};

export default Sidebar; 