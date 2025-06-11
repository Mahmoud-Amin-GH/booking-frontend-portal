import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../../../utils/cn';
import { inputVariants } from '../../../../utils/variants';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /**
   * Label for the input
   */
  label?: string;
  /**
   * Helper text displayed below the input
   */
  helperText?: string;
  /**
   * Error message - when provided, input shows error state
   */
  error?: string;
  /**
   * Success message - when provided, input shows success state
   */
  success?: string;
  /**
   * Icon to display at the start of the input
   */
  startIcon?: React.ReactNode;
  /**
   * Icon to display at the end of the input
   */
  endIcon?: React.ReactNode;
  /**
   * Whether the input is required
   */
  required?: boolean;
  /**
   * Container class name
   */
  containerClassName?: string;
  /**
   * Label class name
   */
  labelClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      size,
      state,
      label,
      helperText,
      error,
      success,
      startIcon,
      endIcon,
      required,
      containerClassName,
      labelClassName,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id || generatedId;
    
    // Determine the actual input state
    const actualState = error ? 'error' : success ? 'success' : state;
    
    // For password inputs, manage the show/hide functionality
    const actualType = type === 'password' && showPassword ? 'text' : type;
    
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium text-foreground mb-1.5',
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {startIcon}
            </div>
          )}
          
          <input
            type={actualType}
            id={inputId}
            className={cn(
              inputVariants({ size, state: actualState }),
              startIcon && 'pl-10',
              (endIcon || type === 'password' || error || success) && 'pr-10',
              className
            )}
            ref={ref}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : 
              success ? `${inputId}-success` : 
              helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {type === 'password' && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
            
            {error && (
              <AlertCircle className="h-4 w-4 text-destructive" aria-hidden="true" />
            )}
            
            {success && !error && (
              <CheckCircle className="h-4 w-4 text-success" aria-hidden="true" />
            )}
            
            {endIcon && !error && !success && type !== 'password' && (
              <span className="text-muted-foreground" aria-hidden="true">{endIcon}</span>
            )}
          </div>
        </div>
        
        {(helperText || error || success) && (
          <div className="mt-1.5 text-sm">
            {error && (
              <p id={`${inputId}-error`} className="text-destructive flex items-center" role="alert">
                <AlertCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                {error}
              </p>
            )}
            {success && !error && (
              <p id={`${inputId}-success`} className="text-success flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                {success}
              </p>
            )}
            {helperText && !error && !success && (
              <p id={`${inputId}-helper`} className="text-muted-foreground">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input }; 