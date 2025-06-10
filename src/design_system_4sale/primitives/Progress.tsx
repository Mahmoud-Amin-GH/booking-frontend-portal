import React from 'react';
import { cn } from '../utils/cn';

export interface ProgressProps {
  variant?: 'circular' | 'linear';
  value?: number; // 0-100, undefined for indeterminate
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  thickness?: number;
  showValue?: boolean;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
}

const progressColors = {
  primary: {
    bar: 'bg-primary-500',
    stroke: 'stroke-primary-500',
    text: 'text-primary-600'
  },
  secondary: {
    bar: 'bg-secondary-500', 
    stroke: 'stroke-secondary-500',
    text: 'text-secondary-600'
  },
  success: {
    bar: 'bg-green-500',
    stroke: 'stroke-green-500',
    text: 'text-green-600'
  },
  error: {
    bar: 'bg-red-500',
    stroke: 'stroke-red-500', 
    text: 'text-red-600'
  },
  warning: {
    bar: 'bg-yellow-500',
    stroke: 'stroke-yellow-500',
    text: 'text-yellow-600'
  }
};

const circularSizes = {
  sm: { size: 24, strokeWidth: 3 },
  md: { size: 32, strokeWidth: 4 }, 
  lg: { size: 48, strokeWidth: 5 }
};

const linearSizes = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3'
};

const CircularProgress: React.FC<ProgressProps> = ({
  value,
  size = 'md',
  color = 'primary',
  thickness,
  showValue = false,
  className
}) => {
  const { size: circleSize, strokeWidth } = circularSizes[size];
  const finalStrokeWidth = thickness || strokeWidth;
  const radius = (circleSize - finalStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const colorStyles = progressColors[color];
  
  const isIndeterminate = value === undefined;
  const progressValue = Math.min(Math.max(value || 0, 0), 100);
  const strokeDashoffset = circumference - (progressValue / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={circleSize}
        height={circleSize}
        className="transform -rotate-90"
      >
        {/* Track */}
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={finalStrokeWidth}
          fill="none"
          className="text-gray-200"
        />
        
        {/* Progress */}
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={finalStrokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={isIndeterminate ? 0 : strokeDashoffset}
          className={cn(
            colorStyles.stroke,
            isIndeterminate && 'animate-spin origin-center'
          )}
          style={
            isIndeterminate 
              ? { strokeDasharray: `${circumference * 0.25} ${circumference}` }
              : undefined
          }
        />
      </svg>
      
      {/* Value text */}
      {showValue && !isIndeterminate && (
        <span 
          className={cn(
            'absolute text-xs font-medium font-sakr',
            colorStyles.text
          )}
        >
          {Math.round(progressValue)}%
        </span>
      )}
    </div>
  );
};

const LinearProgress: React.FC<ProgressProps> = ({
  value,
  size = 'md', 
  color = 'primary',
  showValue = false,
  className,
  trackClassName,
  barClassName
}) => {
  const isIndeterminate = value === undefined;
  const progressValue = Math.min(Math.max(value || 0, 0), 100);
  const colorStyles = progressColors[color];

  return (
    <div className={cn('w-full', className)}>
      <div 
        className={cn(
          'relative overflow-hidden rounded-full bg-gray-200',
          linearSizes[size],
          trackClassName
        )}
      >
        <div
          className={cn(
            'h-full transition-all duration-300 ease-in-out',
            colorStyles.bar,
            isIndeterminate && 'animate-pulse',
            barClassName
          )}
          style={{
            width: isIndeterminate ? '100%' : `${progressValue}%`,
            transform: isIndeterminate ? 'translateX(-100%)' : 'none',
            animation: isIndeterminate 
              ? 'linear-progress 1.5s ease-in-out infinite' 
              : undefined
          }}
        />
      </div>
      
      {/* Value text */}
      {showValue && !isIndeterminate && (
        <div className="mt-1 text-right">
          <span className={cn('text-sm font-medium font-sakr', colorStyles.text)}>
            {Math.round(progressValue)}%
          </span>
        </div>
      )}
      
      {/* Indeterminate animation styles injected via CSS */}
      {isIndeterminate && (
        <style>
          {`
            @keyframes linear-progress {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}
        </style>
      )}
    </div>
  );
};

export const Progress: React.FC<ProgressProps> = ({ variant = 'circular', ...props }) => {
  if (variant === 'linear') {
    return <LinearProgress {...props} />;
  }
  
  return <CircularProgress {...props} />;
};
