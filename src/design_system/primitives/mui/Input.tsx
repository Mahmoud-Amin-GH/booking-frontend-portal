import React from 'react';
import { TextField, InputAdornment, FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLanguage } from '../../../contexts/LanguageContext';

export interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'outlined' | 'filled';
  size?: 'small' | 'medium';
  value?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
}

// Custom styled TextField to match your existing design
const StyledTextField = styled(TextField)<{ inputSize: InputProps['size'] }>(({ theme, inputSize }) => {
  const isSmall = inputSize === 'small';
  
  return {
    '& .MuiOutlinedInput-root': {
      height: isSmall ? 48 : 56,
      fontSize: isSmall ? '0.75rem' : '0.875rem', // body-2xs / body-xs
      borderRadius: 4, // rounded-xs equivalent
      transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: 'transparent',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.text.secondary,
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px',
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-error .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.error.main,
      },
      '&.Mui-disabled': {
        opacity: 0.38,
        cursor: 'not-allowed',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.divider,
    },
    '& .MuiInputLabel-root': {
      fontSize: isSmall ? '0.75rem' : '0.875rem',
      color: theme.palette.text.secondary,
      '&.Mui-focused': {
        color: theme.palette.primary.main,
      },
      '&.Mui-error': {
        color: theme.palette.error.main,
      },
      '&.MuiInputLabel-shrunk': {
        fontSize: isSmall ? '0.625rem' : '0.75rem', // overline / label-small
        transform: 'translate(14px, -6px) scale(0.75)',
      },
    },
    '& .MuiOutlinedInput-input': {
      color: theme.palette.text.primary,
      '&::placeholder': {
        color: theme.palette.text.secondary,
        opacity: 1,
      },
    },
  };
});

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    startIcon, 
    endIcon, 
    variant = 'outlined', 
    size = 'medium',
    value,
    placeholder,
    type = 'text',
    disabled = false,
    fullWidth = true,
    onChange,
    onFocus,
    onBlur,
    className,
    id,
    name,
    required = false,
    autoComplete,
    ...props 
  }, ref) => {
    const { isRTL } = useLanguage();
    
    // Determine if we should show the placeholder
    const showPlaceholder = !label || (value && value.length > 0);

    return (
      <StyledTextField
        inputRef={ref}
        id={id}
        name={name}
        label={label}
        value={value}
        placeholder={showPlaceholder ? placeholder : ''}
        type={type}
        variant={variant}
        size={size === 'small' ? 'small' : 'medium'}
        fullWidth={fullWidth}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        error={Boolean(error)}
        helperText={error || helperText}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={className}
        inputSize={size}
        InputProps={{
          startAdornment: startIcon ? (
            <InputAdornment position={isRTL ? 'end' : 'start'}>
              {startIcon}
            </InputAdornment>
          ) : undefined,
          endAdornment: endIcon ? (
            <InputAdornment position={isRTL ? 'start' : 'end'}>
              {endIcon}
            </InputAdornment>
          ) : undefined,
          dir: isRTL ? 'rtl' : 'ltr',
        }}
        FormHelperTextProps={{
          sx: {
            textAlign: isRTL ? 'right' : 'left',
            margin: '4px 16px 0',
            fontSize: '0.75rem',
            color: error ? 'error.main' : 'text.secondary',
          },
        }}
        sx={{
          '& .MuiFormLabel-root': {
            left: isRTL ? 'auto' : '0',
            right: isRTL ? '0' : 'auto',
            transformOrigin: isRTL ? 'top right' : 'top left',
          },
          direction: isRTL ? 'rtl' : 'ltr',
        }}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input; 