import React from 'react';
import { Button as FourSaleButton } from '../../design_system_4sale';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text' | 'outlined';
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  [key: string]: any;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  prefix,
  suffix,
  ...props
}) => {
  // Map old API to 4Sale DS API
  const mapVariant = (oldVariant: string) => {
    switch (oldVariant) {
      case 'text':
        return 'ghost';
      case 'outlined':
        return 'outline';
      default:
        return oldVariant as 'primary' | 'secondary' | 'outline' | 'ghost';
    }
  };

  const mapSize = (oldSize: string) => {
    switch (oldSize) {
      case 'small':
        return 'sm';
      case 'medium':
        return 'md';
      case 'large':
        return 'lg';
      default:
        return oldSize as 'sm' | 'md' | 'lg';
    }
  };

  const fourSaleVariant = mapVariant(variant);
  const fourSaleSize = mapSize(size);
  
  return (
    <FourSaleButton
      variant={fourSaleVariant}
      size={fourSaleSize}
      loading={isLoading} // isLoading → loading
      disabled={disabled || isLoading}
      type={type}
      onClick={onClick}
      className={`${fullWidth ? 'w-full' : ''} ${className}`} // fullWidth → w-full class
      // Note: 4Sale DS Button might have different prefix/suffix API
      // For now, render prefix/suffix as part of children if they exist
      {...props}
    >
      {prefix && <span className="mr-2">{prefix}</span>}
      {children}
      {suffix && <span className="ml-2">{suffix}</span>}
    </FourSaleButton>
  );
}; 