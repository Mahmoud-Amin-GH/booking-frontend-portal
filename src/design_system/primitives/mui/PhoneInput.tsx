import React, { useState } from 'react';
import { Box, Chip, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../contexts/LanguageContext';
import Icon from './Icon';
import Input from './Input';
import { formatKuwaitiPhone } from '../../../services/api';

export interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  placeholder = "XXXX XXXX",
  required = false,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [isFocused, setIsFocused] = useState(false);

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

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Clean phone value (remove +965 prefix for display)
  const displayValue = value.replace('+965 ', '');

  // Create the start adornment with Kuwait flag and country code
  const startAdornment = (
    <InputAdornment position="start">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pr: 1,
          borderRight: '1px solid',
          borderColor: 'divider',
          mr: 1,
        }}
      >
        <Icon name="kuwait-flag" />
        <Chip
          label="+965"
          size="small"
          variant="outlined"
          sx={{
            height: 24,
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'text.secondary',
            borderColor: 'transparent',
            backgroundColor: 'transparent',
          }}
        />
      </Box>
    </InputAdornment>
  );

  return (
    <Input
      label={t('auth.phone')}
      type="tel"
      value={displayValue}
      onChange={handleInputChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      required={required}
      startIcon={startAdornment}
      helperText={error || `${t('common.kuwait')} • ${t('common.phoneFormat')}`}
      fullWidth
    />
  );
};

export default PhoneInput; 