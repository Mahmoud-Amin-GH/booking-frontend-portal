import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import { TextField, InputAdornment, Box, Divider } from '@mui/material';
import { Icon, Typography } from '../index';
import { formatKuwaitiPhone } from '../../services/api';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  variant?: 'outlined' | 'filled';
  size?: 'small' | 'medium';
  sx?: any;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  placeholder = "XXXX XXXX",
  required = false,
  variant = 'outlined',
  size = 'medium',
  sx,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Only allow digits and format automatically
    const digits = inputValue.replace(/\D/g, '');
    
    // Limit to 8 digits (Kuwaiti phone number without country code)
    if (digits.length <= 8) {
      const formatted = formatKuwaitiPhone(digits);
      onChange(formatted);
    }
  };

  // Get clean phone number without country code for display
  const cleanPhoneValue = value.replace('+965 ', '');

  return (
    <TextField
      type="tel"
      label={
        <>
          {t('auth.phone')} 
          {required && <span style={{ color: 'error.main' }}>*</span>}
        </>
      }
      value={cleanPhoneValue}
      onChange={handleInputChange}
      error={Boolean(error)}
      helperText={
        error || (
          <Typography variant="label-small" color="on-surface-variant">
            {t('common.kuwait')} • {t('common.phoneFormat')}
          </Typography>
        )
      }
      placeholder={placeholder}
      variant={variant}
      size={size}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              pr: 1.5,
              borderRight: 1,
              borderColor: 'divider',
              mr: 1.5,
            }}>
              <Icon name="kuwait-flag" size="small" />
              <Typography variant="body-xs" color="on-surface-variant">
                +965
              </Typography>
            </Box>
          </InputAdornment>
        ),
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
        '& .MuiInputAdornment-root': {
          ml: 0,
        },
        ...sx,
      }}
    />
  );
};

export default PhoneInput; 