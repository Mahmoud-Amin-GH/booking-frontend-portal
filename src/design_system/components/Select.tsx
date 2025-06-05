import React from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

export interface SelectOption {
  value: string | number;
  label: string;
  labelEn?: string;
  labelAr?: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  onChange: (value: string | number) => void;
  onSearch?: (searchTerm: string) => void;
  className?: string;
  sx?: any;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  loading = false,
  searchable = false,
  clearable = false,
  onChange,
  onSearch,
  className = '',
  sx,
}) => {
  const { language, isRTL } = useLanguage();
  const { t } = useTranslation();

  // Get localized label for option
  const getOptionLabel = (option: SelectOption): string => {
    if (option.labelEn && option.labelAr) {
      return language === 'ar' ? option.labelAr : option.labelEn;
    }
    return option.label;
  };

  // Get selected option
  const selectedOption = options.find(option => option.value === value);

  const handleChange = (_event: any, newValue: SelectOption | null) => {
    if (newValue) {
      onChange(newValue.value);
    } else if (clearable) {
      onChange('');
    }
  };

  const handleInputChange = (_event: any, newInputValue: string) => {
    if (searchable && onSearch) {
      onSearch(newInputValue);
    }
  };

  return (
    <Autocomplete
      options={options}
      value={selectedOption || null}
      onChange={handleChange}
      onInputChange={handleInputChange}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionDisabled={(option) => option.disabled || false}
      loading={loading}
      disabled={disabled}
      clearIcon={clearable ? <Close fontSize="small" /> : null}
      disableClearable={!clearable}
      freeSolo={false}
      filterOptions={searchable ? undefined : (options) => options} // Disable built-in filtering if searchable
      className={className}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={Boolean(error)}
          helperText={error}
          required={required}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5, // rounded-xs
              minHeight: 56, // h-14
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
              fontSize: '0.875rem',
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
          }}
        />
      )}
      sx={{
        width: '100%',
        '& .MuiAutocomplete-paper': {
          borderRadius: 1.5,
          boxShadow: 3,
          maxHeight: 240, // max-h-60
        },
        '& .MuiAutocomplete-option': {
          px: 2,
          py: 1.5,
          '&[aria-selected="true"]': {
            backgroundColor: 'primary.50',
            color: 'primary.main',
            fontWeight: 500,
          },
          '&.Mui-focused': {
            backgroundColor: 'action.hover',
          },
        },
        '& .MuiAutocomplete-noOptions': {
          px: 2,
          py: 1.5,
          color: 'text.secondary',
          textAlign: 'center',
        },
        '& .MuiAutocomplete-loading': {
          px: 2,
          py: 1.5,
          color: 'text.secondary',
          textAlign: 'center',
        },
        ...sx,
      }}
      noOptionsText={t('common.noOptions')}
      loadingText={`${t('common.loading')}...`}
    />
  );
};