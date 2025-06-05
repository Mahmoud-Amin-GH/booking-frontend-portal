import React, { useState } from 'react';
import { Alert as MuiAlert, AlertTitle, IconButton, Collapse } from '@mui/material';
import { Close } from '@mui/icons-material';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  dismissible?: boolean;
  icon?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
  sx?: any;
}

const Alert: React.FC<AlertProps> = ({ 
  variant = 'info', 
  title,
  message, 
  dismissible = false,
  icon,
  onDismiss,
  className = '',
  sx 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <Collapse in={isVisible}>
      <MuiAlert
        severity={variant}
        icon={icon}
        className={className}
        action={
          dismissible ? (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleDismiss}
            >
              <Close fontSize="inherit" />
            </IconButton>
          ) : null
        }
        sx={{
          borderRadius: 2, // rounded-md
          boxShadow: 1, // shadow-elevation-1
          '& .MuiAlert-message': {
            width: '100%',
          },
          ...sx,
        }}
      >
        {title && (
          <AlertTitle
            sx={{
              mb: title ? 1 : 0,
              fontSize: '0.875rem', // title-medium equivalent
              fontWeight: 700,
            }}
          >
            {title}
          </AlertTitle>
        )}
        {message}
      </MuiAlert>
    </Collapse>
  );
};

export default Alert; 