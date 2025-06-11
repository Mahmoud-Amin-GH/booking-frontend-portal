import React from 'react';
import { cn } from '../../../../utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  size?: 'sm' | 'md' | 'lg';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  autoResize?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  labelClassName?: string;
  containerClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    label,
    helperText,
    error,
    success,
    size = 'md',
    resize = 'vertical',
    autoResize = false,
    showCharacterCount = false,
    maxLength,
    minRows = 3,
    maxRows = 10,
    className,
    labelClassName,
    containerClassName,
    disabled,
    required,
    id,
    value,
    defaultValue,
    onChange,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || defaultValue || '');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const generatedId = React.useId();
  const uniqueId = id || generatedId;

    React.useImperativeHandle(ref, () => textareaRef.current!, []);

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        adjustHeight();
      }
    }, [internalValue, autoResize]);

    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate the line height
      const computedStyle = window.getComputedStyle(textarea);
      const lineHeight = parseInt(computedStyle.lineHeight) || 20;
      
      // Calculate min and max heights
      const minHeight = lineHeight * minRows;
      const maxHeight = lineHeight * maxRows;
      
      // Set the height based on content, respecting min/max constraints
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      
      textarea.style.height = `${newHeight}px`;
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      
      if (value === undefined) {
        setInternalValue(newValue);
      }
      
      onChange?.(event);
    };

    const sizeClasses = {
      sm: 'text-xs px-3 py-2',
      md: 'text-sm px-3 py-2',
      lg: 'text-base px-4 py-3'
    };

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    };

    const hasError = Boolean(error);
    const hasSuccess = Boolean(success) && !hasError;
    const currentValue = value !== undefined ? value : internalValue;
    const characterCount = String(currentValue).length;
    const isOverLimit = maxLength ? characterCount > maxLength : false;

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={uniqueId}
            className={cn(
              'block text-sm font-medium text-foreground mb-2',
              disabled && 'text-muted-foreground',
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={textareaRef}
            id={uniqueId}
            value={currentValue}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            rows={autoResize ? minRows : undefined}
            className={cn(
              'w-full rounded-md border bg-background transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              'placeholder:text-muted-foreground',
              sizeClasses[size],
              !autoResize && resizeClasses[resize],
              autoResize && 'resize-none overflow-hidden',
              hasError && 'border-destructive focus:ring-destructive',
              hasSuccess && 'border-success focus:ring-success',
              !hasError && !hasSuccess && 'border-border hover:border-primary/50',
              disabled && 'opacity-50 cursor-not-allowed bg-muted',
              className
            )}
            {...props}
          />
        </div>

        <div className="flex justify-between items-start mt-2">
          <div className="flex-1">
            {(helperText || error || success) && (
              <div className="text-xs">
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

          {showCharacterCount && (
            <div className="text-xs text-muted-foreground ml-2 flex-shrink-0">
              <span className={cn(isOverLimit && 'text-destructive')}>
                {characterCount}
              </span>
              {maxLength && (
                <span>/{maxLength}</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea }; 