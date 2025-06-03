import React from 'react';
import Input, { InputProps } from './Input';

export interface NumberInputProps extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  value?: number | string;
  onChange: (value: number | '') => void;
  min?: number;
  max?: number;
  step?: number;
  allowDecimals?: boolean;
  showControls?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value = '',
  onChange,
  min,
  max,
  step = 1,
  allowDecimals = false,
  showControls = false,
  error,
  ...props
}) => {
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
    if (hasNegative && min !== undefined && min < 0) {
      finalValue = '-' + finalValue;
    } else if (hasNegative && (min === undefined || min < 0)) {
      finalValue = '-' + finalValue;
    }

    // Convert to number if valid
    const numValue = Number(finalValue);
    if (isNaN(numValue)) {
      onChange('');
      return;
    }

    onChange(numValue);
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
    <div className="flex flex-col">
      <button
        type="button"
        onClick={handleIncrement}
        className="px-3 py-1 text-xs hover:bg-md-sys-color-surface-container-high transition-colors rounded-t border-l border-md-sys-color-outline"
        disabled={max !== undefined && Number(value) >= max}
        tabIndex={-1}
      >
        ▲
      </button>
      <button
        type="button"
        onClick={handleDecrement}
        className="px-3 py-1 text-xs hover:bg-md-sys-color-surface-container-high transition-colors rounded-b border-l border-t border-md-sys-color-outline"
        disabled={min !== undefined && Number(value) <= min}
        tabIndex={-1}
      >
        ▼
      </button>
    </div>
  ) : undefined;

  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      value={formatValue(value)}
      onChange={handleInputChange}
      onBlur={handleBlur}
      error={finalError}
      endIcon={stepControls}
    />
  );
}; 