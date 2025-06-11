import React from 'react';
import { Input } from './Input';

export interface NumberInputProps {
  label?: string;
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  error,
  placeholder,
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue) && onChange) {
      // Apply min/max constraints
      let constrainedValue = newValue;
      if (min !== undefined && constrainedValue < min) {
        constrainedValue = min;
      }
      if (max !== undefined && constrainedValue > max) {
        constrainedValue = max;
      }
      onChange(constrainedValue);
    } else if (event.target.value === '' && onChange) {
      onChange(0); // or handle empty value as needed
    }
  };

  return (
    <Input
      label={label}
      type="number"
      value={value?.toString() || ''}
      onChange={handleInputChange}
      error={error}
      placeholder={placeholder}
      fullWidth={fullWidth}
      disabled={disabled}
      className={className}
      min={min}
      max={max}
      step={step}
      {...props}
    />
  );
}; 