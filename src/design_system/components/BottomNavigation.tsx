import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Paper } from '@mui/material';
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
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        display: { xs: 'flex', md: 'none' },
        alignItems: 'center',
        justifyContent: 'space-around',
        py: 1,
        px: 2,
        borderTop: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
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
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              py: 1,
              px: 1.5,
              minWidth: 0,
              color: isActiveItem ? 'primary.main' : 'text.secondary',
              opacity: isDisabled ? 0.5 : 1,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}
          >
            <Icon 
              name={item.icon} 
              size="small" 
              sx={{
                color: isActiveItem ? 'primary.main' : 'text.secondary',
                opacity: isDisabled ? 0.5 : 1,
              }}
            />
            <Typography 
              variant="label-small" 
              color={isActiveItem ? 'primary' : 'on-surface-variant'}
              sx={{ 
                textAlign: 'center',
                lineHeight: 1.2,
                opacity: isDisabled ? 0.5 : 1,
              }}
            >
              {item.label}
            </Typography>
          </Button>
        );
      })}
    </Paper>
  );
};

export default BottomNavigation; 