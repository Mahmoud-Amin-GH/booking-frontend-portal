import React from 'react';
import { 
  Checkbox as MuiCheckbox, 
  FormControl, 
  FormControlLabel, 
  FormHelperText,
  Box
} from '@mui/material';
import Typography from '@mui/material/Typography';

export interface CheckboxProps {
  label?: string;
  description?: string;
  error?: string;
  size?: 'small' | 'medium';
  indeterminate?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  id?: string;
  name?: string;
  value?: string;
  className?: string;
  sx?: any;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ 
    label, 
    description,
    error,
    size = 'medium',
    indeterminate = false,
    className = '',
    disabled,
    checked,
    sx,
    ...props 
  }, ref) => {
    const hasError = Boolean(error);

    const checkboxElement = (
      <MuiCheckbox
        ref={ref}
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        size={size}
        className={className}
        sx={{
          borderRadius: 1.5, // rounded-xs
          color: hasError ? 'error.main' : 'divider',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
          '&.Mui-checked': {
            color: 'primary.main',
          },
          '&.Mui-indeterminate': {
            color: 'primary.main',
          },
          '&.Mui-disabled': {
            opacity: 0.38,
          },
          '&.Mui-focusVisible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
          },
          ...sx,
        }}
        {...props}
      />
    );

    // If no label or description, return just the checkbox
    if (!label && !description) {
      return checkboxElement;
    }

    return (
      <FormControl error={hasError} disabled={disabled}>
        <FormControlLabel
          control={checkboxElement}
          label={
            <Box>
              {label && (
                <Typography
                  color={hasError ? 'error' : disabled ? 'on-surface-muted' : 'on-surface'}
                  sx={{ lineHeight: 1.2 }}
                >
                  {label}
                </Typography>
              )}
              {description && (
                <Typography
                  color={hasError ? 'error' : 'on-surface-variant'}
                  sx={{ 
                    mt: 0.5, 
                    lineHeight: 1.2,
                    display: 'block'
                  }}
                >
                  {description}
                </Typography>
              )}
            </Box>
          }
          sx={{
            alignItems: 'flex-start',
            ml: 0,
            gap: size === 'small' ? 1 : 1.5,
            '& .MuiFormControlLabel-label': {
              ml: 0,
            },
          }}
        />
        
        {error && (
          <FormHelperText
            sx={{
              fontSize: '0.75rem',
              ml: size === 'small' ? 4 : 5, // Align with label
              mt: 0.5,
            }}
          >
            {error}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox; 