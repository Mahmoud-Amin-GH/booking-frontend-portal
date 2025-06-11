import React from 'react';
import { cn } from '../../../../utils/cn';
import { Check, Minus } from 'lucide-react';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
  id?: string;
  name?: string;
  value?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    checked,
    defaultChecked,
    onCheckedChange,
    indeterminate = false,
    disabled = false,
    required = false,
    label,
    description,
    error,
    success,
    size = 'md',
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

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    React.useImperativeHandle(ref, () => inputRef.current!, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;
      
      if (checked === undefined) {
        setIsChecked(newChecked);
      }
      
      onCheckedChange?.(newChecked);
    };

    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    const iconSizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
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
              id={uniqueId}
              name={name}
              value={value}
              checked={currentChecked}
              onChange={handleChange}
              disabled={disabled}
              required={required}
              className="sr-only"
              {...props}
            />
            
            <div
              className={cn(
                'flex items-center justify-center rounded border-2 transition-all duration-200',
                'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
                sizeClasses[size],
                currentChecked || indeterminate
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-background border-border hover:border-primary/50',
                hasError && 'border-destructive focus-within:ring-destructive',
                hasSuccess && 'border-success focus-within:ring-success',
                disabled && 'opacity-50 cursor-not-allowed bg-muted border-muted-foreground',
                className
              )}
              onClick={() => !disabled && inputRef.current?.click()}
            >
              {indeterminate ? (
                <Minus className={cn('text-current', iconSizeClasses[size])} />
              ) : currentChecked ? (
                <Check className={cn('text-current', iconSizeClasses[size])} />
              ) : null}
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

Checkbox.displayName = 'Checkbox';

export { Checkbox }; 