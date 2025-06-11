import React from 'react';
import { cn } from '../../../../utils/cn';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'destructive';
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
  id?: string;
  name?: string;
  value?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({
    checked,
    defaultChecked,
    onCheckedChange,
    disabled = false,
    required = false,
    label,
    description,
    error,
    success,
    size = 'md',
    color = 'primary',
    className,
    labelClassName,
    containerClassName,
    id,
    name,
    value,
    ...props
  }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked ?? defaultChecked ?? false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const generatedId = React.useId();
  const uniqueId = id || generatedId;

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    React.useImperativeHandle(ref, () => inputRef.current!, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;
      
      if (checked === undefined) {
        setIsChecked(newChecked);
      }
      
      onCheckedChange?.(newChecked);
    };

    const sizeClasses = {
      sm: {
        track: 'h-5 w-9',
        thumb: 'h-4 w-4',
        translate: 'translate-x-4'
      },
      md: {
        track: 'h-6 w-11',
        thumb: 'h-5 w-5',
        translate: 'translate-x-5'
      },
      lg: {
        track: 'h-7 w-14',
        thumb: 'h-6 w-6',
        translate: 'translate-x-7'
      }
    };

    const colorClasses = {
      primary: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      destructive: 'bg-destructive'
    };

    const labelSizeClasses = {
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base'
    };

    const hasError = Boolean(error);
    const hasSuccess = Boolean(success) && !hasError;
    const isControlled = checked !== undefined;
    const currentChecked = isControlled ? checked : isChecked;

    return (
      <div className={cn('flex flex-col', containerClassName)}>
        <div className="flex items-start space-x-3">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="checkbox"
              role="switch"
              id={uniqueId}
              name={name}
              value={value}
              checked={currentChecked}
              onChange={handleChange}
              disabled={disabled}
              required={required}
              aria-checked={currentChecked}
              className="sr-only"
              {...props}
            />
            
            <div
              className={cn(
                'relative inline-flex items-center rounded-full border-2 border-transparent transition-all duration-200 ease-in-out',
                'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
                sizeClasses[size].track,
                currentChecked
                  ? colorClasses[color]
                  : 'bg-muted',
                hasError && 'focus-within:ring-destructive',
                hasSuccess && 'focus-within:ring-success',
                disabled && 'opacity-50 cursor-not-allowed',
                className
              )}
              onClick={() => !disabled && inputRef.current?.click()}
            >
              <div
                className={cn(
                  'inline-block rounded-full bg-background shadow-lg ring-0 transition-all duration-200 ease-in-out',
                  sizeClasses[size].thumb,
                  currentChecked ? sizeClasses[size].translate : 'translate-x-0'
                )}
              />
            </div>
          </div>

          {(label || description) && (
            <div className="flex-1 min-w-0">
              {label && (
                <label
                  htmlFor={uniqueId}
                  className={cn(
                    'block font-medium text-foreground cursor-pointer',
                    labelSizeClasses[size],
                    disabled && 'text-muted-foreground cursor-not-allowed',
                    labelClassName
                  )}
                >
                  {label}
                  {required && <span className="text-destructive ml-1">*</span>}
                </label>
              )}
              
              {description && (
                <p className={cn(
                  'text-xs text-muted-foreground mt-1',
                  disabled && 'opacity-50'
                )}>
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

        {(error || success) && (
          <div className="mt-2 text-xs">
            {error && (
              <p className="text-destructive" role="alert">
                {error}
              </p>
            )}
            {success && !error && (
              <p className="text-success">{success}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch }; 