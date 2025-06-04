import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'elevated' | 'filled' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'filled',
  size = 'medium',
  icon,
  iconPosition = 'start',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles for all buttons
  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-medium rounded-xl 
    transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-38 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  // Size variants
  const sizeStyles = {
    small: 'h-8 px-3 text-label-small min-w-[64px]',
    medium: 'h-10 px-4 text-label-medium min-w-[80px]',
    large: 'h-12 px-6 text-label-large min-w-[96px]',
  };

  // Variant styles
  const variantStyles = {
    elevated: `
      bg-surface-container-low text-primary-600 shadow-elevation-1
      hover:bg-surface-container hover:shadow-elevation-2 hover:bg-opacity-8
      active:bg-surface-container active:shadow-elevation-1 active:bg-opacity-12
      focus:ring-primary-500
    `,
    filled: `
      bg-primary-600 text-surface-bright shadow-elevation-1
      hover:bg-primary-700 hover:shadow-elevation-2 hover:bg-opacity-8
      active:bg-primary-700 active:shadow-elevation-1 active:bg-opacity-12
      focus:ring-primary-300
    `,
    outlined: `
      bg-transparent text-primary-600 border border-outline
      hover:bg-primary-600 hover:bg-opacity-8 hover:border-primary-600
      active:bg-primary-600 active:bg-opacity-12 active:border-primary-600
      focus:ring-primary-500 focus:border-primary-600
    `,
    text: `
      bg-transparent text-primary-600
      hover:bg-primary-600 hover:bg-opacity-8
      active:bg-primary-600 active:bg-opacity-12
      focus:ring-primary-500
    `,
  };

  const renderIcon = () => {
    if (isLoading) {
      return (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      );
    }
    return icon;
  };

  const iconElement = renderIcon();
  const shouldShowIcon = icon || isLoading;

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Start icon - always leading (left in LTR, right in RTL) */}
      {shouldShowIcon && iconPosition === 'start' && iconElement}
      
      {/* Button text */}
      <span className={isLoading ? 'opacity-0' : ''}>
        {children}
      </span>
      
      {/* End icon - always trailing (right in LTR, left in RTL) */}
      {shouldShowIcon && iconPosition === 'end' && iconElement}
    </button>
  );
};

export default Button; 