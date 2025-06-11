import React from 'react';
import { cn } from '../../../../utils/cn';

// Types
interface ProgressProps {
  value?: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
  striped?: boolean;
  indeterminate?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface CircularProgressProps {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary';
  showValue?: boolean;
  showPercentage?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface StepProgressProps {
  steps: Array<{
    label: string;
    description?: string;
    completed?: boolean;
    current?: boolean;
    error?: boolean;
  }>;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

// Linear Progress Component
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    value = 0, 
    max = 100, 
    variant = 'default',
    size = 'md',
    showValue = false,
    showPercentage = false,
    animated = false,
    striped = false,
    indeterminate = false,
    className,
    children,
    ...props 
  }, ref) => {
    const percentage = indeterminate ? 0 : Math.min(Math.max((value / max) * 100, 0), 100);

    const sizeClasses = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4'
    };

    const variantClasses = {
      default: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      destructive: 'bg-destructive',
      secondary: 'bg-secondary'
    };

    return (
      <div className={cn('w-full', className)} ref={ref} {...props}>
        {(showValue || showPercentage || children) && (
          <div className="flex justify-between items-center mb-2">
            <div>{children}</div>
            <div className="text-sm text-muted-foreground">
              {showValue && `${value}/${max}`}
              {showValue && showPercentage && ' '}
              {showPercentage && `${Math.round(percentage)}%`}
            </div>
          </div>
        )}
        
        <div
          className={cn(
            'w-full bg-muted rounded-full overflow-hidden',
            sizeClasses[size]
          )}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={indeterminate ? 'Loading...' : `${Math.round(percentage)}% complete`}
        >
          <div
            className={cn(
              'h-full transition-all duration-300 ease-in-out rounded-full',
              variantClasses[variant],
              striped && 'bg-stripes',
              animated && 'animate-pulse',
              indeterminate && 'animate-progress-indeterminate w-1/3'
            )}
            style={{
              width: indeterminate ? undefined : `${percentage}%`,
              backgroundImage: striped ? 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)' : undefined,
              backgroundSize: striped ? '1rem 1rem' : undefined,
              animation: striped && animated ? 'progress-stripes 1s linear infinite' : undefined
            }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

// Circular Progress Component
export const CircularProgress = React.forwardRef<SVGSVGElement, CircularProgressProps>(
  ({ 
    value = 0, 
    max = 100, 
    size = 120,
    strokeWidth = 8,
    variant = 'default',
    showValue = false,
    showPercentage = false,
    className,
    children,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const variantClasses = {
      default: 'stroke-primary',
      success: 'stroke-success',
      warning: 'stroke-warning',
      destructive: 'stroke-destructive',
      secondary: 'stroke-secondary'
    };

    return (
      <div className={cn('relative inline-flex items-center justify-center', className)}>
        <svg
          ref={ref}
          width={size}
          height={size}
          className="transform -rotate-90"
          {...props}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-muted opacity-20"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn('transition-all duration-300 ease-in-out', variantClasses[variant])}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {children}
            {(showValue || showPercentage) && (
              <div className="text-sm font-medium">
                {showValue && `${value}/${max}`}
                {showValue && showPercentage && ' '}
                {showPercentage && `${Math.round(percentage)}%`}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CircularProgress.displayName = 'CircularProgress';

// Step Progress Component
export const StepProgress = React.forwardRef<HTMLDivElement, StepProgressProps>(
  ({ steps, orientation = 'horizontal', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
          className
        )}
        {...props}
      >
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          
          return (
            <React.Fragment key={index}>
              <div
                className={cn(
                  'flex items-center',
                  orientation === 'vertical' && 'flex-col text-center'
                )}
              >
                {/* Step indicator */}
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium',
                    step.completed && 'bg-success border-success text-success-foreground',
                    step.current && !step.completed && 'bg-primary border-primary text-primary-foreground',
                    step.error && 'bg-destructive border-destructive text-destructive-foreground',
                    !step.completed && !step.current && !step.error && 'bg-background border-muted-foreground text-muted-foreground'
                  )}
                >
                  {step.completed ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : step.error ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                
                {/* Step content */}
                <div
                  className={cn(
                    orientation === 'horizontal' ? 'ml-3' : 'mt-2',
                    'text-left'
                  )}
                >
                  <div
                    className={cn(
                      'text-sm font-medium',
                      step.completed && 'text-success',
                      step.current && !step.completed && 'text-primary',
                      step.error && 'text-destructive',
                      !step.completed && !step.current && !step.error && 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    orientation === 'horizontal' 
                      ? 'flex-1 h-px mx-4' 
                      : 'w-px h-8 my-2 ml-4',
                    'bg-border',
                    step.completed && 'bg-success'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);

StepProgress.displayName = 'StepProgress';

// Multi-Progress Component (for showing multiple progress bars)
interface MultiProgressProps {
  items: Array<{
    label: string;
    value: number;
    max?: number;
    variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary';
  }>;
  size?: 'sm' | 'md' | 'lg';
  showValues?: boolean;
  showPercentages?: boolean;
  className?: string;
}

export const MultiProgress = React.forwardRef<HTMLDivElement, MultiProgressProps>(
  ({ items, size = 'md', showValues = false, showPercentages = false, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-3', className)} {...props}>
        {items.map((item, index) => (
          <Progress
            key={index}
            value={item.value}
            max={item.max || 100}
            variant={item.variant || 'default'}
            size={size}
            showValue={showValues}
            showPercentage={showPercentages}
          >
            <span className="text-sm font-medium">{item.label}</span>
          </Progress>
        ))}
      </div>
    );
  }
);

MultiProgress.displayName = 'MultiProgress'; 