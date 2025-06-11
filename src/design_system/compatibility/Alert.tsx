import React from 'react';
import { Alert as FourSaleAlert } from '../../design_system_4sale';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  message?: string;
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  message,
  children,
  className = '',
  ...props
}) => {
  // Map old variant names to 4Sale DS variants
  const mapVariant = (oldVariant: string) => {
    switch (oldVariant) {
      case 'error':
        return 'destructive';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  const fourSaleVariant = mapVariant(variant);

  return (
    <FourSaleAlert
      variant={fourSaleVariant}
      className={className}
      {...props}
    >
      {message || children}
    </FourSaleAlert>
  );
}; 