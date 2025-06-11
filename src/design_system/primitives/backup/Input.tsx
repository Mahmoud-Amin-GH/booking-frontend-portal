import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'outlined' | 'filled';
  size?: 'small' | 'medium';
  sx?: any;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    startIcon, 
    endIcon, 
    variant = 'outlined', 
    size = 'medium',
    className = '',
    disabled,
    value,
    placeholder,
    type = 'text',
    sx,
    ...props 
  }, ref) => {
    const { isRTL } = useLanguage();
    const hasError = Boolean(error);

    // Map variant to MUI variant
    const muiVariant = variant === 'filled' ? 'filled' : 'outlined';

    // Custom sizing 
    const getSizeSx = () => {
      switch (size) {
        case 'small':
          return {
            '& .MuiInputBase-root': {
              height: 48, // h-12
              fontSize: '0.875rem', // text-body-2xs
            },
            '& .MuiInputBase-input': {
              py: 1.5,
              px: 2,
            },
          };
        case 'medium':
          return {
            '& .MuiInputBase-root': {
              height: 56, // h-14
              fontSize: '1rem', // text-body-xs
            },
            '& .MuiInputBase-input': {
              py: 2,
              px: 2,
            },
          };
        default:
          return {};
      }
    };

    // Custom styling to match original design
    const getCustomSx = () => {
      return {
        width: '100%',
        '& .MuiOutlinedInput-root': {
          borderRadius: 1.5, // rounded-xs
          backgroundColor: variant === 'filled' ? 'action.hover' : 'transparent',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'text.secondary',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
            borderWidth: 2,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: 'error.main',
          },
        },
        '& .MuiFilledInput-root': {
          borderRadius: 1.5,
          backgroundColor: 'action.hover',
          '&:hover': {
            backgroundColor: 'action.selected',
          },
          '&.Mui-focused': {
            backgroundColor: 'action.selected',
          },
        },
        '& .MuiInputLabel-root': {
          fontSize: size === 'small' ? '0.75rem' : '0.875rem',
          '&.Mui-focused': {
            color: 'primary.main',
          },
          '&.Mui-error': {
            color: 'error.main',
          },
        },
        '& .MuiFormHelperText-root': {
          fontSize: '0.75rem',
          textAlign: isRTL ? 'right' : 'left',
          mx: 2,
          '&.Mui-error': {
            color: 'error.main',
          },
        },
        ...getSizeSx(),
        ...sx,
      };
    };

    return (
      <TextField
        ref={ref}
        label={label}
        variant={muiVariant}
        size={size === 'small' ? 'small' : 'medium'}
        value={value}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        error={hasError}
        helperText={error || helperText}
        className={className}
        sx={getCustomSx()}
        InputProps={{
          ...(startIcon && {
            startAdornment: (
              <InputAdornment position="start">
                {startIcon}
              </InputAdornment>
            ),
          }),
          ...(endIcon && {
            endAdornment: (
              <InputAdornment position="end">
                {endIcon}
              </InputAdornment>
            ),
          }),
        }}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input; 