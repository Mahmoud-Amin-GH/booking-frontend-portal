import React from 'react';
import { cn } from '../utils/cn';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  clickable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className,
  onClick,
  clickable = false,
}) => {
  const variantStyles = {
    default: 'bg-white shadow-sm border border-gray-200',
    outlined: 'bg-white border border-gray-300',
    elevated: 'bg-white shadow-lg border-0',
    filled: 'bg-gray-50 border border-gray-200',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const Component = onClick || clickable ? 'button' : 'div';

  return (
    <Component
      className={cn(
        'rounded-lg font-sakr transition-all duration-200',
        variantStyles[variant],
        paddingStyles[padding],
        (onClick || clickable) && 'cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
        className
      )}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {children}
    </Component>
  );
};
