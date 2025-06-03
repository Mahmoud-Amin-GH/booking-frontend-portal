import React, { useId } from 'react';
import Typography from './Typography';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  description?: string;
  error?: string;
  size?: 'small' | 'medium';
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    label, 
    description,
    error,
    size = 'medium',
    indeterminate = false,
    className = '',
    disabled,
    checked,
    ...props 
  }, ref) => {
    const id = useId();
    const checkboxId = props.id || id;
    const hasError = Boolean(error);

    // Size variants
    const sizeStyles = {
      small: {
        container: 'h-4 w-4',
        icon: 'w-3 h-3',
        gap: 'gap-2',
      },
      medium: {
        container: 'h-5 w-5',
        icon: 'w-4 h-4',
        gap: 'gap-3',
      },
    };

    const sizeStyle = sizeStyles[size];

    // Checkbox container styles
    const checkboxStyles = `
      relative inline-flex items-center justify-center flex-shrink-0
      ${sizeStyle.container} rounded-xs border-2 transition-all duration-250
      ${disabled ? 'cursor-not-allowed opacity-38' : 'cursor-pointer'}
      ${hasError ? 'border-error' : 'border-outline hover:border-primary-600'}
      ${checked || indeterminate ? 'bg-primary-600 border-primary-600' : 'bg-surface-bright'}
      focus-within:ring-2 focus-within:ring-primary-600/20
    `;

    // Checkmark icon
    const CheckmarkIcon = () => (
      <svg 
        className={`${sizeStyle.icon} text-surface-bright transition-all duration-200 ${
          checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );

    // Indeterminate icon
    const IndeterminateIcon = () => (
      <svg 
        className={`${sizeStyle.icon} text-surface-bright transition-all duration-200 ${
          indeterminate ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`} 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M19 13H5v-2h14v2z" />
      </svg>
    );

    return (
      <div className={`flex flex-col ${className}`}>
        <label 
          htmlFor={checkboxId}
          className={`
            inline-flex items-start ${sizeStyle.gap} cursor-pointer
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
        >
          {/* Checkbox Container */}
          <div className={checkboxStyles}>
            {/* Hidden Native Input */}
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              {...props}
            />

            {/* Custom Icons */}
            <div className="absolute inset-0 flex items-center justify-center">
              {indeterminate ? <IndeterminateIcon /> : <CheckmarkIcon />}
            </div>
          </div>

          {/* Label and Description */}
          {(label || description) && (
            <div className="flex-1 min-w-0">
              {label && (
                <Typography 
                  variant={size === 'small' ? 'body-2xs' : 'body-xs'}
                  color={hasError ? 'error' : disabled ? 'on-surface-muted' : 'on-surface'}
                  className="leading-tight"
                >
                  {label}
                </Typography>
              )}
              {description && (
                <Typography 
                  variant="body-3xs"
                  color={hasError ? 'error' : 'on-surface-variant'}
                  className="mt-1 leading-tight"
                >
                  {description}
                </Typography>
              )}
            </div>
          )}
        </label>

        {/* Error Message */}
        {error && (
          <div className="mt-1 pl-8">
            <Typography variant="label-small" color="error">
              {error}
            </Typography>
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox; 