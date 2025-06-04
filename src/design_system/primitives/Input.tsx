import React, { useState, useId } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'outlined' | 'filled';
  size?: 'small' | 'medium';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    startIcon, 
    endIcon, 
    variant = 'outlined', 
    size = 'medium',
    className = '',
    disabled,
    value,
    placeholder,
    type = 'text',
    onFocus,
    onBlur,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const { isRTL } = useLanguage();
    const id = useId();
    const inputId = props.id || id;
    
    const hasValue = value !== undefined ? String(value).length > 0 : false;
    const isFloating = isFocused || hasValue || placeholder;
    const hasError = Boolean(error);

    // Size variants
    const sizeStyles = {
      small: {
        container: 'h-12',
        input: 'text-body-2xs px-4 pt-4 pb-2',
        label: 'text-body-3xs px-4 pt-3',
        labelFloating: 'text-overline px-4 pt-2',
        icon: 'w-4 h-4',
        // Align icons with the text area (considering floating label)
        iconTop: 'top-[calc(50%+0.5rem)]', // Slightly lower to align with text area when label is floating
      },
      medium: {
        container: 'h-14',
        input: 'text-body-xs px-4 pt-5 pb-2',
        label: 'text-body-xs px-4 pt-4',
        labelFloating: 'text-label-small px-4 pt-2',
        icon: 'w-5 h-5',
        // Align icons with the text area (considering floating label)
        iconTop: 'top-[calc(50%+0.625rem)]', // Slightly lower to align with text area when label is floating
      },
    };

    const sizeStyle = sizeStyles[size];

    // Base container styles
    const containerStyles = `
      relative ${sizeStyle.container} w-full rounded-xs border transition-all duration-250
      ${variant === 'outlined' ? 'bg-transparent' : 'bg-surface-container-low'}
      ${disabled ? 'opacity-38 cursor-not-allowed' : 'cursor-text'}
    `;

    // Border and state styles
    const getBorderStyles = () => {
      if (hasError) {
        return 'border-error focus-within:border-error focus-within:ring-2 focus-within:ring-error/20';
      }
      if (isFocused) {
        return 'border-primary-600 ring-2 ring-primary-600/20';
      }
      return 'border-outline hover:border-on-surface-variant focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-600/20';
    };

    // Label styles with RTL support
    const labelStyles = `
      absolute ${isRTL ? 'right-0' : 'left-0'} top-0 origin-top-${isRTL ? 'right' : 'left'} transition-all duration-250 pointer-events-none select-none
      ${isFloating ? sizeStyle.labelFloating : sizeStyle.label}
      ${isFloating ? 'transform scale-75' : ''}
      ${hasError ? 'text-error' : isFocused ? 'text-primary-600' : 'text-on-surface-variant'}
    `;

    // Input styles - let browser handle RTL
    const inputStyles = `
      w-full bg-transparent border-0 outline-none resize-none
      text-on-surface placeholder-on-surface-variant
      ${sizeStyle.input}
      ${startIcon ? 'pl-12' : ''} 
      ${endIcon ? 'pr-12' : ''}
      disabled:cursor-not-allowed
    `;

    // Icon styles - simple left/right positioning, browser handles RTL
    const startIconStyles = `
      absolute ${isFloating ? sizeStyle.iconTop : 'top-1/2'} transform -translate-y-1/2 flex items-center justify-center
      ${sizeStyle.icon} text-on-surface-variant left-3
    `;

    const endIconStyles = `
      absolute ${isFloating ? sizeStyle.iconTop : 'top-1/2'} transform -translate-y-1/2 flex items-center justify-center
      ${sizeStyle.icon} text-on-surface-variant right-3
    `;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="w-full space-y-1">
        <div className={`${containerStyles} ${getBorderStyles()} ${className}`}>
          {/* Start Icon - always leading */}
          {startIcon && (
            <div className={startIconStyles}>
              {startIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={type}
            value={value}
            placeholder={isFloating ? placeholder : ''}
            className={inputStyles}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {/* Floating Label */}
          {label && (
            <label
              htmlFor={inputId}
              className={labelStyles}
            >
              {label}
            </label>
          )}

          {/* End Icon - always trailing */}
          {endIcon && (
            <div className={endIconStyles}>
              {endIcon}
            </div>
          )}
        </div>

        {/* Helper Text / Error with RTL support */}
        {(helperText || error) && (
          <div className={`px-4 text-label-small ${isRTL ? 'text-right' : 'text-left'} ${hasError ? 'text-error' : 'text-on-surface-variant'}`}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 