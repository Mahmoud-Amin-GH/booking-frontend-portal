import React, { useState } from 'react';
import { cn } from '../utils/cn';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message?: string;
  children?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const alertVariants = {
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: 'text-blue-500',
    title: 'text-blue-900',
    message: 'text-blue-700'
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: 'text-green-500',
    title: 'text-green-900', 
    message: 'text-green-700'
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: 'text-yellow-500',
    title: 'text-yellow-900',
    message: 'text-yellow-700'
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: 'text-red-500', 
    title: 'text-red-900',
    message: 'text-red-700'
  }
};

const defaultIcons = {
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

export const Alert: React.FC<AlertProps> = ({ 
  variant = 'info', 
  title,
  message,
  children, 
  dismissible = false,
  onDismiss,
  icon,
  className
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const variantStyles = alertVariants[variant];
  const displayIcon = icon || defaultIcons[variant];
  const content = children || message;

  return (
    <div 
      className={cn(
        'rounded-lg border p-4 font-sakr',
        variantStyles.container,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {displayIcon && (
          <div className={cn('shrink-0 mt-0.5', variantStyles.icon)}>
            {displayIcon}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn(
              'text-sm font-semibold mb-1',
              variantStyles.title
            )}>
              {title}
            </h4>
          )}
          
          {content && (
            <div className={cn(
              'text-sm',
              variantStyles.message
            )}>
              {content}
            </div>
          )}
        </div>
        
        {/* Dismiss button */}
        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className={cn(
              'shrink-0 rounded-md p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2',
              variantStyles.icon,
              variant === 'info' && 'focus:ring-blue-500',
              variant === 'success' && 'focus:ring-green-500', 
              variant === 'warning' && 'focus:ring-yellow-500',
              variant === 'error' && 'focus:ring-red-500'
            )}
            aria-label="Dismiss alert"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}; 