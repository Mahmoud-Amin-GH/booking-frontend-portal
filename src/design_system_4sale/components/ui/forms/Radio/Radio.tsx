import React from 'react';
import { cn } from '../../../../utils/cn';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
}

const Radio = React.forwardRef<HTMLDivElement, RadioProps>(
  ({
    options,
    value,
    defaultValue,
    onValueChange,
    name,
    disabled = false,
    required = false,
    label,
    helperText,
    error,
    success,
    size = 'md',
    orientation = 'vertical',
    className,
    labelClassName,
    containerClassName,
    ...props
  }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState(value ?? defaultValue ?? '');
    const generatedName = React.useId();
    const groupId = React.useId();
    const uniqueName = name || generatedName;

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    const handleChange = (optionValue: string) => {
      if (disabled) return;
      
      if (value === undefined) {
        setSelectedValue(optionValue);
      }
      
      onValueChange?.(optionValue);
    };

    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    const dotSizeClasses = {
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3'
    };

    const labelSizeClasses = {
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base'
    };

    const hasError = Boolean(error);
    const hasSuccess = Boolean(success) && !hasError;
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : selectedValue;

    return (
      <div className={cn('w-full', containerClassName)} ref={ref} {...props}>
        {label && (
          <fieldset>
            <legend
              className={cn(
                'block text-sm font-medium text-foreground mb-3',
                disabled && 'text-muted-foreground',
                labelClassName
              )}
            >
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </legend>

            <div
              role="radiogroup"
              aria-labelledby={groupId}
              className={cn(
                'space-y-3',
                orientation === 'horizontal' && 'flex flex-wrap gap-6 space-y-0',
                className
              )}
            >
              {options.map((option) => {
                const isSelected = currentValue === option.value;
                const isOptionDisabled = disabled || option.disabled;
                const optionId = `${uniqueName}-${option.value}`;

                return (
                  <div key={option.value} className="flex items-start space-x-3">
                    <div className="relative flex items-center">
                      <input
                        type="radio"
                        id={optionId}
                        name={uniqueName}
                        value={option.value}
                        checked={isSelected}
                        onChange={() => handleChange(option.value)}
                        disabled={isOptionDisabled}
                        required={required}
                        className="sr-only"
                      />
                      
                      <div
                        className={cn(
                          'flex items-center justify-center rounded-full border-2 transition-all duration-200',
                          'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
                          sizeClasses[size],
                          isSelected
                            ? 'bg-primary border-primary'
                            : 'bg-background border-border hover:border-primary/50',
                          hasError && 'border-destructive focus-within:ring-destructive',
                          hasSuccess && 'border-success focus-within:ring-success',
                          isOptionDisabled && 'opacity-50 cursor-not-allowed bg-muted border-muted-foreground'
                        )}
                        onClick={() => !isOptionDisabled && handleChange(option.value)}
                      >
                        {isSelected && (
                          <div
                            className={cn(
                              'rounded-full bg-primary-foreground transition-all duration-200',
                              dotSizeClasses[size]
                            )}
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={optionId}
                        className={cn(
                          'block font-medium text-foreground cursor-pointer',
                          labelSizeClasses[size],
                          isOptionDisabled && 'text-muted-foreground cursor-not-allowed'
                        )}
                      >
                        {option.label}
                      </label>
                      
                      {option.description && (
                        <p className={cn(
                          'text-xs text-muted-foreground mt-1',
                          isOptionDisabled && 'opacity-50'
                        )}>
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>
        )}

        {!label && (
          <div
            role="radiogroup"
            className={cn(
              'space-y-3',
              orientation === 'horizontal' && 'flex flex-wrap gap-6 space-y-0',
              className
            )}
          >
            {options.map((option) => {
              const isSelected = currentValue === option.value;
              const isOptionDisabled = disabled || option.disabled;
              const optionId = `${uniqueName}-${option.value}`;

              return (
                <div key={option.value} className="flex items-start space-x-3">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      id={optionId}
                      name={uniqueName}
                      value={option.value}
                      checked={isSelected}
                      onChange={() => handleChange(option.value)}
                      disabled={isOptionDisabled}
                      required={required}
                      className="sr-only"
                    />
                    
                    <div
                      className={cn(
                        'flex items-center justify-center rounded-full border-2 transition-all duration-200',
                        'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
                        sizeClasses[size],
                        isSelected
                          ? 'bg-primary border-primary'
                          : 'bg-background border-border hover:border-primary/50',
                        hasError && 'border-destructive focus-within:ring-destructive',
                        hasSuccess && 'border-success focus-within:ring-success',
                        isOptionDisabled && 'opacity-50 cursor-not-allowed bg-muted border-muted-foreground'
                      )}
                      onClick={() => !isOptionDisabled && handleChange(option.value)}
                    >
                      {isSelected && (
                        <div
                          className={cn(
                            'rounded-full bg-primary-foreground transition-all duration-200',
                            dotSizeClasses[size]
                          )}
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={optionId}
                      className={cn(
                        'block font-medium text-foreground cursor-pointer',
                        labelSizeClasses[size],
                        isOptionDisabled && 'text-muted-foreground cursor-not-allowed'
                      )}
                    >
                      {option.label}
                    </label>
                    
                    {option.description && (
                      <p className={cn(
                        'text-xs text-muted-foreground mt-1',
                        isOptionDisabled && 'opacity-50'
                      )}>
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {(helperText || error || success) && (
          <div className="mt-3 text-xs">
            {error && (
              <p className="text-destructive" role="alert">
                {error}
              </p>
            )}
            {success && !error && (
              <p className="text-success">{success}</p>
            )}
            {helperText && !error && !success && (
              <p className="text-muted-foreground">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export { Radio }; 