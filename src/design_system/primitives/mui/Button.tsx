import React from 'react';
import { Button as MUIButton, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'filled' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  isLoading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

// Custom styled MUI Button to match your existing variants
const StyledButton = styled(MUIButton)<{ buttonVariant: ButtonProps['variant'] }>(({ theme, buttonVariant }) => {
  const getVariantStyles = () => {
    switch (buttonVariant) {
      case 'elevated':
        return {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.primary.main,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
            boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
          },
          '&:active': {
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
          },
        };
      case 'filled':
        return {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
          },
          '&:active': {
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
          },
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: theme.palette.primary.main,
          border: `1px solid ${theme.palette.divider}`,
          '&:hover': {
            backgroundColor: `${theme.palette.primary.main}0D`, // 5% opacity
            borderColor: theme.palette.primary.main,
          },
          '&:active': {
            backgroundColor: `${theme.palette.primary.main}1F`, // 12% opacity
          },
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: `${theme.palette.primary.main}0D`, // 5% opacity
          },
          '&:active': {
            backgroundColor: `${theme.palette.primary.main}1F`, // 12% opacity
          },
        };
      default:
        return {};
    }
  };

  return {
    ...getVariantStyles(),
    textTransform: 'none',
    fontWeight: 500,
    borderRadius: 12,
    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    '&:focus': {
      outline: '2px solid',
      outlineColor: theme.palette.primary.light,
      outlineOffset: '2px',
    },
    '&.Mui-disabled': {
      opacity: 0.38,
      cursor: 'not-allowed',
    },
  };
});

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'filled',
  size = 'medium',
  icon,
  iconPosition = 'start',
  isLoading = false,
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className,
  ...props
}) => {
  // Map your size variants to MUI sizes
  const getMUISize = () => {
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      default:
        return 'medium';
    }
  };

  // Map your variants to MUI variants (for base styling, then override with StyledButton)
  const getMUIVariant = () => {
    switch (variant) {
      case 'outlined':
        return 'outlined';
      case 'text':
        return 'text';
      default:
        return 'contained';
    }
  };

  const renderIcon = () => {
    if (isLoading) {
      return (
        <CircularProgress 
          size={16} 
          color="inherit"
          sx={{ 
            color: 'currentColor',
          }}
        />
      );
    }
    return icon;
  };

  const iconElement = renderIcon();
  const shouldShowIcon = icon || isLoading;

  return (
    <StyledButton
      buttonVariant={variant}
      variant={getMUIVariant()}
      size={getMUISize()}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
      className={className}
      startIcon={shouldShowIcon && iconPosition === 'start' ? iconElement : undefined}
      endIcon={shouldShowIcon && iconPosition === 'end' ? iconElement : undefined}
      {...props}
    >
      {/* Hide text when loading but keep layout */}
      <Box sx={{ opacity: isLoading ? 0 : 1 }}>
        {children}
      </Box>
    </StyledButton>
  );
};

export default Button; 