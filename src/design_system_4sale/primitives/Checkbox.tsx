import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  helperText?: string;
  indeterminate?: boolean;
  variant?: 'default' | 'error';
}

const checkboxSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5', 
  lg: 'w-6 h-6'
};

const labelSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  size = 'md',
  label,
  error,
  helperText,
  indeterminate = false,
  variant = 'default',
  className,
  disabled,
  id,
  children,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = variant === 'error' || !!error;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2">
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={cn(
              // Base styles
              'peer shrink-0 rounded border-2 text-primary-500 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
              'disabled:cursor-not-allowed disabled:opacity-50',
              
              // Size variants
              checkboxSizes[size],
              
              // State variants
              hasError 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 hover:border-primary-400',
              
              // Checked styles
              'checked:bg-primary-500 checked:border-primary-500',
              'checked:hover:bg-primary-600 checked:hover:border-primary-600',
              
              className
            )}
            disabled={disabled}
            {...props}
          />
          
          {/* Custom checkmark */}
          <div 
            className={cn(
              'absolute inset-0 flex items-center justify-center pointer-events-none',
              'text-white opacity-0 peer-checked:opacity-100 transition-opacity'
            )}
          >
            {indeterminate ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        
        {(label || children) && (
          <label 
            htmlFor={checkboxId}
            className={cn(
              'cursor-pointer select-none font-sakr',
              labelSizes[size],
              hasError ? 'text-red-700' : 'text-gray-700',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {label || children}
          </label>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <span className="text-sm text-red-600 font-sakr">
          {error}
        </span>
      )}
      
      {/* Helper text */}
      {helperText && !error && (
        <span className="text-sm text-gray-500 font-sakr">
          {helperText}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
