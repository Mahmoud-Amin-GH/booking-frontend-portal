import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { Icon, Typography } from '../design_system';
import { formatKuwaitiPhone } from '../services/api';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  placeholder = "XXXX XXXX",
  required = false,
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

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
  };

  // Custom phone input with Material Design 3 styling and RTL support
  return (
    <div className="w-full space-y-1">
      {/* Label */}
      <Typography 
        variant="body-xs" 
        color={error ? 'error' : isFocused ? 'primary' : 'on-surface-variant'}
        className={`px-4 ${isRTL ? 'text-right' : 'text-left'}`}
      >
        {t('auth.phone')} {required && <span className="text-error">*</span>}
      </Typography>

      {/* Input Container */}
      <div className={`
        relative h-14 w-full rounded-xs border transition-all duration-250 bg-transparent
        ${error ? 'border-error focus-within:border-error focus-within:ring-2 focus-within:ring-error/20' : 
          isFocused ? 'border-primary-600 ring-2 ring-primary-600/20' : 
          'border-outline hover:border-on-surface-variant focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-600/20'}
      `}>
        {/* Country Code Section - always at start (leading) */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 border-r border-outline pr-3">
          <Icon name="kuwait-flag" size="small" />
          <Typography variant="body-xs" color="on-surface-variant">
            +965
          </Typography>
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={value.replace('+965 ', '')}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full h-full bg-transparent border-0 outline-none resize-none text-on-surface placeholder-on-surface-variant text-body-xs pl-20 pr-4 py-4 disabled:cursor-not-allowed"
        />
      </div>

      {/* Helper Text / Error with RTL support */}
      <div className={`px-4 space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
        {error ? (
          <Typography variant="label-small" color="error">
            {error}
          </Typography>
        ) : (
          <Typography variant="label-small" color="on-surface-variant">
            {t('common.kuwait')} • {t('common.phoneFormat')}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default PhoneInput; 