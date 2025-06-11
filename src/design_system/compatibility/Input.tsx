import React from 'react';
import { Input as FourSaleInput } from '../../design_system_4sale';

export interface InputProps {
  label?: string;
  type?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  fullWidth?: boolean;
  prefix?: string;
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  fullWidth = false,
  prefix,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      <FourSaleInput
        ref={ref}
        label={label}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`${fullWidth ? 'w-full' : ''} ${error ? 'border-destructive' : ''} ${className}`}
        startIcon={prefix ? <span className="text-muted-foreground">{prefix}</span> : undefined}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}); 