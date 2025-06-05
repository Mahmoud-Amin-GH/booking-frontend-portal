import React from 'react';
import { Button as MuiButton, CircularProgress, Box } from '@mui/material';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'color'> {
  variant?: 'elevated' | 'filled' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  isLoading?: boolean;
  fullWidth?: boolean;
  sx?: any;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'filled',
  size = 'medium',
  icon,
  iconPosition = 'start',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  sx,
  ...props
}) => {
  // Map custom variants to MUI variants
  const getMuiVariant = () => {
    switch (variant) {
      case 'filled':
        return 'contained';
      case 'outlined':
        return 'outlined';
      case 'text':
        return 'text';
      case 'elevated':
        return 'contained'; // Use contained as base for elevated
      default:
        return 'contained';
    }
  };

  // Custom sizing for button heights
  const getSizeSx = () => {
    switch (size) {
      case 'small':
        return {
          height: 32, // h-8
          px: 1.5, // px-3
          fontSize: '0.75rem', // text-label-small
          minWidth: 64,
        };
      case 'medium':
        return {
          height: 40, // h-10
          px: 2, // px-4  
          fontSize: '0.875rem', // text-label-medium
          minWidth: 80,
        };
      case 'large':
        return {
          height: 48, // h-12
          px: 3, // px-6
          fontSize: '1rem', // text-label-large
          minWidth: 96,
        };
      default:
        return {
          height: 40,
          px: 2,
          fontSize: '0.875rem',
          minWidth: 80,
        };
    }
  };

  // Custom variant styling
  const getVariantSx = () => {
    const baseSx = {
      borderRadius: 3, // rounded-xl
      fontWeight: 500,
      textTransform: 'none' as const,
      transition: 'all 0.25s ease',
      '&:disabled': {
        opacity: 0.38,
      },
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseSx,
          backgroundColor: 'background.paper',
          color: 'primary.main',
          boxShadow: 2,
          '&:hover': {
            backgroundColor: 'action.hover',
            boxShadow: 4,
          },
          '&:active': {
            boxShadow: 1,
          },
        };
      case 'filled':
        return {
          ...baseSx,
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          boxShadow: 1,
          '&:hover': {
            backgroundColor: 'primary.dark',
            boxShadow: 2,
          },
          '&:active': {
            boxShadow: 1,
          },
        };
      case 'outlined':
        return {
          ...baseSx,
          backgroundColor: 'transparent',
          color: 'primary.main',
          borderColor: 'divider',
          '&:hover': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            borderColor: 'primary.main',
          },
        };
      case 'text':
        return {
          ...baseSx,
          backgroundColor: 'transparent',
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        };
      default:
        return baseSx;
    }
  };

  const renderIcon = () => {
    if (isLoading) {
      return (
        <CircularProgress
          size={16}
          sx={{
            color: 'inherit',
          }}
        />
      );
    }
    return icon;
  };

  const iconElement = renderIcon();
  const shouldShowIcon = icon || isLoading;

  return (
    <MuiButton
      variant={getMuiVariant()}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      className={className}
      sx={{
        ...getSizeSx(),
        ...getVariantSx(),
        ...sx,
      }}
      {...props}
    >
      {/* Start icon */}
      {shouldShowIcon && iconPosition === 'start' && (
        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
          {iconElement}
        </Box>
      )}
      
      {/* Button text */}
      <Box sx={{ opacity: isLoading ? 0 : 1 }}>
        {children}
      </Box>
      
      {/* End icon */}
      {shouldShowIcon && iconPosition === 'end' && (
        <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
          {iconElement}
        </Box>
      )}
    </MuiButton>
  );
};

export default Button; 