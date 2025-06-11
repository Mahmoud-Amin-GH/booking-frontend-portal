import React from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
  labelEn?: string;
  labelAr?: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      const selectedValue = e.target.value;
      // Try to preserve the original type (string or number)
      const originalOption = options.find(opt => opt.value.toString() === selectedValue);
      if (originalOption) {
        onChange(originalOption.value);
      }
    }
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </label>
      )}
      <select
        value={value?.toString() || ''}
        onChange={handleChange}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background ${
          error ? 'border-destructive' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value} 
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};

 