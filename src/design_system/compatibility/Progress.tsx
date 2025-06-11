import React from 'react';
import { Progress as FourSaleProgress } from '../../design_system_4sale';

export interface ProgressProps {
  variant?: 'linear' | 'circular' | 'default' | 'secondary' | 'success' | 'warning' | 'destructive';
  value?: number;
  max?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  [key: string]: any;
}

export const Progress: React.FC<ProgressProps> = ({
  variant = 'default',
  value,
  max = 100,
  className = '',
  size = 'md',
  ...props
}) => {
  // Map old variants to 4Sale DS variants
  const mapVariant = (oldVariant: string) => {
    switch (oldVariant) {
      case 'linear':
        return 'default';
      case 'circular':
        return 'default'; // 4Sale DS might not have circular variant
      default:
        return oldVariant as 'default' | 'secondary' | 'success' | 'warning' | 'destructive';
    }
  };

  const fourSaleVariant = mapVariant(variant);

  return (
    <FourSaleProgress
      variant={fourSaleVariant}
      value={value}
      max={max}
      className={className}
      {...props}
    />
  );
}; 