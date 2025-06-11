import React from 'react';
import { Button as FourSaleButton } from '../../design_system_4sale';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
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
  ...props
}) => {
  // Map old API to 4Sale DS API
  const fourSaleVariant = variant;
  const fourSaleSize = size;
  
  return (
    <FourSaleButton
      variant={fourSaleVariant}
      size={fourSaleSize}
      loading={isLoading} // isLoading → loading
      disabled={disabled || isLoading}
      type={type}
      onClick={onClick}
      className={`${fullWidth ? 'w-full' : ''} ${className}`} // fullWidth → w-full class
      {...props}
    >
      {children}
    </FourSaleButton>
  );
}; 