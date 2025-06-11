import React from 'react';
import { cn } from '../../../../utils/cn';

export interface SliderMark {
  value: number;
  label?: string;
}

export interface SliderProps {
  value?: number | number[];
  defaultValue?: number | number[];
  onValueChange?: (value: number | number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  range?: boolean;
  marks?: SliderMark[];
  showTooltip?: boolean;
  showValue?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'destructive';
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
  formatValue?: (value: number) => string;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({
    value,
    defaultValue,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    range = false,
    marks = [],
    showTooltip = false,
    showValue = false,
    label,
    helperText,
    error,
    success,
    size = 'md',
    color = 'primary',
    className,
    labelClassName,
    containerClassName,
    formatValue = (val) => val.toString(),
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState<number | number[]>(() => {
      if (value !== undefined) return value;
      if (defaultValue !== undefined) return defaultValue;
      return range ? [min, max] : min;
    });
    
    const [isDragging, setIsDragging] = React.useState(false);
    const [activeThumb, setActiveThumb] = React.useState<number | null>(null);
    const sliderRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    const currentValue = value !== undefined ? value : internalValue;
    const values = Array.isArray(currentValue) ? currentValue : [currentValue];

    const sizeClasses = {
      sm: {
        track: 'h-1',
        thumb: 'h-4 w-4',
        mark: 'h-1 w-1'
      },
      md: {
        track: 'h-2',
        thumb: 'h-5 w-5',
        mark: 'h-1.5 w-1.5'
      },
      lg: {
        track: 'h-3',
        thumb: 'h-6 w-6',
        mark: 'h-2 w-2'
      }
    };

    const colorClasses = {
      primary: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      destructive: 'bg-destructive'
    };

    const getPercentage = (val: number) => {
      return ((val - min) / (max - min)) * 100;
    };

    const getValueFromPosition = (clientX: number) => {
      if (!sliderRef.current) return min;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + percentage * (max - min);
      
      // Snap to step
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.max(min, Math.min(max, steppedValue));
    };

    const handleMouseDown = (event: React.MouseEvent, thumbIndex?: number) => {
      if (disabled) return;
      
      event.preventDefault();
      setIsDragging(true);
      
      if (thumbIndex !== undefined) {
        setActiveThumb(thumbIndex);
      } else {
        // Click on track - find closest thumb or create new value
        const newValue = getValueFromPosition(event.clientX);
        
        if (range && Array.isArray(currentValue)) {
          const distances = currentValue.map((val, idx) => ({
            distance: Math.abs(val - newValue),
            index: idx
          }));
          const closest = distances.reduce((prev, curr) => 
            prev.distance < curr.distance ? prev : curr
          );
          setActiveThumb(closest.index);
        } else {
          setActiveThumb(0);
        }
        
        updateValue(newValue);
      }
    };

    const updateValue = (newValue: number) => {
      let updatedValue: number | number[];
      
      if (range && Array.isArray(currentValue)) {
        const newValues = [...currentValue];
        if (activeThumb !== null && activeThumb < newValues.length) {
          newValues[activeThumb] = newValue;
          // Ensure values don't cross over
          if (activeThumb === 0 && newValues.length > 1) {
            const secondValue = newValues[1];
            if (secondValue !== undefined) {
              newValues[0] = Math.min(newValues[0]!, secondValue);
            }
          } else if (activeThumb === 1 && newValues.length > 1) {
            const firstValue = newValues[0];
            if (firstValue !== undefined) {
              newValues[1] = Math.max(newValues[1]!, firstValue);
            }
          }
        }
        updatedValue = newValues;
      } else {
        updatedValue = newValue;
      }
      
      if (value === undefined) {
        setInternalValue(updatedValue);
      }
      
      onValueChange?.(updatedValue);
    };

    React.useEffect(() => {
      const handleMouseMove = (event: MouseEvent) => {
        if (!isDragging || activeThumb === null) return;
        
        const newValue = getValueFromPosition(event.clientX);
        updateValue(newValue);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        setActiveThumb(null);
      };

      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
      
      return undefined;
    }, [isDragging, activeThumb, updateValue]);

    const renderThumb = (val: number, index: number) => {
      const percentage = getPercentage(val);
      
      return (
        <div
          key={index}
          className={cn(
            'absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-background shadow-lg transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            sizeClasses[size].thumb,
            colorClasses[color],
            disabled && 'opacity-50 cursor-not-allowed',
            isDragging && activeThumb === index && 'scale-110'
          )}
          style={{ left: `${percentage}%` }}
          onMouseDown={(e) => handleMouseDown(e, index)}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={val}
          aria-valuetext={formatValue(val)}
          tabIndex={disabled ? -1 : 0}
        >
          {showTooltip && (
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-popover border border-border rounded text-xs whitespace-nowrap">
              {formatValue(val)}
            </div>
          )}
        </div>
      );
    };

    const renderTrack = () => {
      if (range && values.length >= 2 && values[0] !== undefined && values[1] !== undefined) {
        const startPercentage = getPercentage(values[0]);
        const endPercentage = getPercentage(values[1]);
        
        return (
          <div
            className={cn(
              'absolute top-1/2 transform -translate-y-1/2 rounded-full',
              sizeClasses[size].track,
              colorClasses[color]
            )}
            style={{
              left: `${startPercentage}%`,
              width: `${endPercentage - startPercentage}%`
            }}
          />
        );
      } else if (values[0] !== undefined) {
        const percentage = getPercentage(values[0]);
        
        return (
          <div
            className={cn(
              'absolute top-1/2 transform -translate-y-1/2 rounded-full',
              sizeClasses[size].track,
              colorClasses[color]
            )}
            style={{
              left: '0%',
              width: `${percentage}%`
            }}
          />
        );
      }
      
      return null;
    };

    return (
      <div className={cn('w-full', containerClassName)} ref={ref} {...props}>
        {label && (
          <label
            className={cn(
              'block text-sm font-medium text-foreground mb-4',
              disabled && 'text-muted-foreground',
              labelClassName
            )}
          >
            {label}
            {showValue && (
              <span className="ml-2 text-muted-foreground">
                {Array.isArray(currentValue) && currentValue.length >= 2 && currentValue[0] !== undefined && currentValue[1] !== undefined
                  ? `${formatValue(currentValue[0])} - ${formatValue(currentValue[1])}`
                  : formatValue(Array.isArray(currentValue) && currentValue[0] !== undefined ? currentValue[0] : (currentValue as number))
                }
              </span>
            )}
          </label>
        )}

        <div className="relative px-3">
          {/* Track Background */}
          <div
            ref={sliderRef}
            className={cn(
              'relative w-full rounded-full bg-muted cursor-pointer',
              sizeClasses[size].track,
              disabled && 'cursor-not-allowed'
            )}
            onMouseDown={handleMouseDown}
          >
            {/* Active Track */}
            {renderTrack()}
            
            {/* Marks */}
            {marks.map((mark) => {
              const percentage = getPercentage(mark.value);
              return (
                <div
                  key={mark.value}
                  className={cn(
                    'absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded-full bg-border',
                    sizeClasses[size].mark
                  )}
                  style={{ left: `${percentage}%` }}
                />
              );
            })}
            
            {/* Thumbs */}
            {values.filter((val): val is number => val !== undefined).map((val, index) => renderThumb(val, index))}
          </div>

          {/* Mark Labels */}
          {marks.length > 0 && (
            <div className="relative mt-2">
              {marks.map((mark) => {
                const percentage = getPercentage(mark.value);
                return (
                  <div
                    key={mark.value}
                    className="absolute text-xs text-muted-foreground transform -translate-x-1/2"
                    style={{ left: `${percentage}%` }}
                  >
                    {mark.label || formatValue(mark.value)}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {(helperText || error || success) && (
          <div className="mt-2 text-xs">
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

Slider.displayName = 'Slider';

export { Slider }; 