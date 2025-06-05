import React from 'react';
import { Checkbox as MUICheckbox, FormControlLabel, FormHelperText, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLanguage } from '../../../contexts/LanguageContext';

export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  onChange?: (checked: boolean) => void;
  name?: string;
  value?: string;
  className?: string;
  required?: boolean;
  size?: 'small' | 'medium';
}

// Custom styled Checkbox to match your existing design
const StyledCheckbox = styled(MUICheckbox)(({ theme }) => ({
  borderRadius: 4,
  padding: theme.spacing(1),
  '&.Mui-checked': {
    color: theme.palette.primary.main,
  },
  '&.Mui-disabled': {
    opacity: 0.38,
  },
  '&:hover': {
    backgroundColor: `${theme.palette.primary.main}0D`, // 5% opacity
  },
  '&.Mui-focusVisible': {
    outline: `2px solid ${theme.palette.primary.light}`,
    outlineOffset: '2px',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.25rem',
  },
  '&.MuiCheckbox-sizeSmall .MuiSvgIcon-root': {
    fontSize: '1rem',
  },
}));

const StyledFormControlLabel = styled(FormControlLabel)<{ 
  hasError: boolean; 
  isRTL: boolean; 
}>(({ theme, hasError, isRTL }) => ({
  margin: 0,
  flexDirection: isRTL ? 'row-reverse' : 'row',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    lineHeight: 1.4,
    color: hasError ? theme.palette.error.main : theme.palette.text.primary,
    paddingTop: theme.spacing(0.25), // Align with checkbox center
    '&.Mui-disabled': {
      color: theme.palette.text.disabled,
    },
  },
}));

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    label, 
    checked = false, 
    indeterminate = false,
    disabled = false,
    error,
    helperText,
    onChange,
    name,
    value,
    className,
    required = false,
    size = 'medium',
    ...props 
  }, ref) => {
    const { isRTL } = useLanguage();
    const hasError = Boolean(error);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.checked);
    };

    const checkboxElement = (
      <StyledCheckbox
        inputRef={ref}
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        onChange={handleChange}
        name={name}
        value={value}
        required={required}
        size={size}
        color={hasError ? 'error' : 'primary'}
        {...props}
      />
    );

    if (!label) {
      // Return just the checkbox if no label
      return (
        <Box className={className}>
          {checkboxElement}
          {(error || helperText) && (
            <FormHelperText 
              error={hasError}
              sx={{ 
                marginLeft: isRTL ? 0 : 5,
                marginRight: isRTL ? 5 : 0,
                textAlign: isRTL ? 'right' : 'left',
              }}
            >
              {error || helperText}
            </FormHelperText>
          )}
        </Box>
      );
    }

    return (
      <Box className={className}>
        <StyledFormControlLabel
          control={checkboxElement}
          label={label}
          hasError={hasError}
          isRTL={isRTL}
          disabled={disabled}
        />
        {(error || helperText) && (
          <FormHelperText 
            error={hasError}
            sx={{ 
              marginLeft: isRTL ? 0 : 5,
              marginRight: isRTL ? 5 : 0,
              marginTop: 0.5,
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {error || helperText}
          </FormHelperText>
        )}
      </Box>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox; 