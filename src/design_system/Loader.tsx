import React from 'react';

export interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'circular' | 'linear';
  color?: 'primary' | 'on-surface' | 'inherit';
  className?: string;
  label?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium',
  variant = 'circular',
  color = 'primary',
  className = '',
  label
}) => {
  // Size variants
  const sizeStyles = {
    small: {
      circular: 'w-4 h-4 border-2',
      linear: 'h-1',
    },
    medium: {
      circular: 'w-6 h-6 border-2',
      linear: 'h-1.5',
    },
    large: {
      circular: 'w-8 h-8 border-[3px]',
      linear: 'h-2',
    },
  };

  // Color variants
  const colorStyles = {
    primary: {
      circular: 'border-primary-600 border-t-transparent',
      linear: 'bg-primary-600',
      track: 'bg-primary-200',
    },
    'on-surface': {
      circular: 'border-on-surface border-t-transparent',
      linear: 'bg-on-surface',
      track: 'bg-on-surface/20',
    },
    inherit: {
      circular: 'border-current border-t-transparent',
      linear: 'bg-current',
      track: 'bg-current/20',
    },
  };

  const sizeStyle = sizeStyles[size];
  const colorStyle = colorStyles[color];

  if (variant === 'linear') {
    return (
      <div className={`w-full ${className}`} role="progressbar" aria-label={label || 'Loading'}>
        <div className={`relative w-full ${sizeStyle.linear} ${colorStyle.track} rounded-full overflow-hidden`}>
          <div 
            className={`
              absolute top-0 left-0 h-full ${colorStyle.linear} rounded-full
              animate-pulse
            `}
          />
        </div>
      </div>
    );
  }

  // Circular variant
  return (
    <div 
      className={`
        inline-flex items-center justify-center
        ${className}
      `}
      role="progressbar" 
      aria-label={label || 'Loading'}
    >
      <div 
        className={`
          ${sizeStyle.circular} ${colorStyle.circular}
          rounded-full animate-spin
        `}
      />
    </div>
  );
};

export default Loader; 