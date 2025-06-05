import React from 'react';
import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange' | 'size' | 'color'> {
  value?: number | string;
  onChange: (value: number | '') => void;
  label?: string;
  error?: string;
  helperText?: string;
  min?: number;
  max?: number;
  step?: number;
  allowDecimals?: boolean;
  showControls?: boolean;
  variant?: 'outlined' | 'filled';
  size?: 'small' | 'medium';
  sx?: any;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value = '',
  onChange,
  label,
  error,
  helperText,
  min,
  max,
  step = 1,
  allowDecimals = false,
  showControls = false,
  variant = 'outlined',
  size = 'medium',
  disabled,
  placeholder,
  sx,
  ...props
}) => {
  const { isRTL } = useLanguage();

  const formatValue = (val: number | string): string => {
    if (val === '' || val === undefined || val === null) return '';
    const numVal = Number(val);
    if (isNaN(numVal)) return '';
    return numVal.toString();
  };

  const validateRange = (val: number): string | undefined => {
    if (min !== undefined && val < min) {
      return `Minimum value is ${min}`;
    }
    if (max !== undefined && val > max) {
      return `Maximum value is ${max}`;
    }
    return undefined;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty string
    if (inputValue === '') {
      onChange('');
      return;
    }

    // Remove non-numeric characters based on allowDecimals
    const cleanValue = allowDecimals 
      ? inputValue.replace(/[^0-9.-]/g, '')
      : inputValue.replace(/[^0-9-]/g, '');

    // Handle negative numbers
    const hasNegative = cleanValue.includes('-');
    const numericPart = cleanValue.replace(/-/g, '');
    
    // For decimals, ensure only one decimal point
    let finalValue = numericPart;
    if (allowDecimals) {
      const parts = numericPart.split('.');
      if (parts.length > 2) {
        finalValue = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    // Add back negative sign if needed (only at the beginning)
    if (hasNegative && (min === undefined || min < 0)) {
      finalValue = '-' + finalValue;
    }

    // Convert to number if valid
    const numValue = Number(finalValue);
    if (isNaN(numValue) && finalValue !== '' && finalValue !== '-') {
      return; // Don't update if invalid
    }

    onChange(finalValue === '' || finalValue === '-' ? '' : numValue);
  };

  const handleIncrement = () => {
    const currentValue = Number(value) || 0;
    const newValue = currentValue + step;
    
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    const currentValue = Number(value) || 0;
    const newValue = currentValue - step;
    
    if (min === undefined || newValue >= min) {
      onChange(newValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      // Apply min/max constraints on blur
      let constrainedValue = numValue;
      if (min !== undefined && constrainedValue < min) {
        constrainedValue = min;
      }
      if (max !== undefined && constrainedValue > max) {
        constrainedValue = max;
      }
      
      if (constrainedValue !== numValue) {
        onChange(constrainedValue);
      }
    }

    // Call original onBlur if provided
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  // Calculate range validation error
  const rangeError = value !== '' && !isNaN(Number(value)) ? validateRange(Number(value)) : undefined;
  const finalError = error || rangeError;

  // Create step controls if enabled
  const stepControls = showControls ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        ml: 1,
      }}
    >
      <IconButton
        size="small"
        onClick={handleIncrement}
        disabled={disabled || (max !== undefined && Number(value) >= max)}
        sx={{
          p: 0.25,
          borderRadius: '4px 4px 0 0',
          fontSize: '0.75rem',
          minWidth: 0,
          width: 20,
          height: 16,
        }}
      >
        <Add fontSize="inherit" />
      </IconButton>
      <IconButton
        size="small"
        onClick={handleDecrement}
        disabled={disabled || (min !== undefined && Number(value) <= min)}
        sx={{
          p: 0.25,
          borderRadius: '0 0 4px 4px',
          fontSize: '0.75rem',
          minWidth: 0,
          width: 20,
          height: 16,
        }}
      >
        <Remove fontSize="inherit" />
      </IconButton>
    </Box>
  ) : null;

  return (
    <TextField
      {...props}
      label={label}
      value={formatValue(value)}
      onChange={handleInputChange}
      onBlur={handleBlur}
      error={Boolean(finalError)}
      helperText={finalError || helperText}
      variant={variant}
      size={size}
      placeholder={placeholder}
      disabled={disabled}
      inputProps={{
        inputMode: 'numeric',
        pattern: allowDecimals ? '[0-9]*[.]?[0-9]*' : '[0-9]*',
        min,
        max,
        step,
      }}
      InputProps={{
        endAdornment: stepControls ? (
          <InputAdornment position="end">
            {stepControls}
          </InputAdornment>
        ) : null,
      }}
      sx={{
        width: '100%',
        '& .MuiOutlinedInput-root': {
          borderRadius: 1.5, // rounded-xs
          minHeight: size === 'small' ? 48 : 56,
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
        ...sx,
      }}
    />
  );
}; 