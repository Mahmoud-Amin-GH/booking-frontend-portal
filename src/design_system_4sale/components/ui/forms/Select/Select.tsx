import React from 'react';
import { cn } from '../../../../utils/cn';
import { ChevronDown, Check, X, Search } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
  maxHeight?: number;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({
    options,
    value,
    defaultValue,
    onValueChange,
    placeholder = 'Select an option...',
    label,
    helperText,
    error,
    success,
    disabled = false,
    required = false,
    multiple = false,
    searchable = false,
    clearable = false,
    size = 'md',
    className,
    labelClassName,
    containerClassName,
    maxHeight = 200,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedValues, setSelectedValues] = React.useState<string[]>(() => {
      if (value !== undefined) {
        return Array.isArray(value) ? value : [value];
      }
      if (defaultValue !== undefined) {
        return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
      }
      return [];
    });

    const selectRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const uniqueId = React.useId();

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValues(Array.isArray(value) ? value : [value]);
      }
    }, [value]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchTerm('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    React.useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    const sizeClasses = {
      sm: 'h-8 text-xs px-3',
      md: 'h-10 text-sm px-3',
      lg: 'h-12 text-base px-4'
    };

    const filteredOptions = React.useMemo(() => {
      if (!searchTerm) return options;
      return options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [options, searchTerm]);

    const selectedOptions = React.useMemo(() => {
      return options.filter(option => selectedValues.includes(option.value));
    }, [options, selectedValues]);

    const handleSelect = (optionValue: string) => {
      let newValues: string[];

      if (multiple) {
        if (selectedValues.includes(optionValue)) {
          newValues = selectedValues.filter(v => v !== optionValue);
        } else {
          newValues = [...selectedValues, optionValue];
        }
      } else {
        newValues = [optionValue];
        setIsOpen(false);
      }

      setSelectedValues(newValues);
      
      const returnValue = multiple ? newValues : newValues[0] || '';
      onValueChange?.(returnValue);
      setSearchTerm('');
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedValues([]);
      onValueChange?.(multiple ? [] : '');
    };

    const handleRemoveTag = (valueToRemove: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const newValues = selectedValues.filter(v => v !== valueToRemove);
      setSelectedValues(newValues);
      onValueChange?.(multiple ? newValues : newValues[0] || '');
    };

    const getDisplayText = () => {
      if (selectedOptions.length === 0) {
        return placeholder;
      }

      if (multiple) {
        return `${selectedOptions.length} selected`;
      }

      return selectedOptions[0]?.label || '';
    };

    const hasError = Boolean(error);
    const hasSuccess = Boolean(success) && !hasError;

    return (
      <div className={cn('w-full', containerClassName)} ref={ref} {...props}>
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

        <div className="relative" ref={selectRef}>
          <button
            id={uniqueId}
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-labelledby={label ? `${uniqueId}-label` : undefined}
            className={cn(
              'w-full flex items-center justify-between rounded-md border bg-background transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              sizeClasses[size],
              hasError && 'border-destructive focus:ring-destructive',
              hasSuccess && 'border-success focus:ring-success',
              !hasError && !hasSuccess && 'border-border hover:border-primary/50',
              disabled && 'opacity-50 cursor-not-allowed bg-muted',
              className
            )}
          >
            <div className="flex-1 flex items-center min-w-0">
              {multiple && selectedOptions.length > 0 ? (
                <div className="flex flex-wrap gap-1 max-w-full">
                  {selectedOptions.slice(0, 2).map((option) => (
                    <span
                      key={option.value}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md"
                    >
                      {option.label}
                      <button
                        type="button"
                        onClick={(e) => handleRemoveTag(option.value, e)}
                        className="hover:bg-primary/20 rounded-sm p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedOptions.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{selectedOptions.length - 2} more
                    </span>
                  )}
                </div>
              ) : (
                <span
                  className={cn(
                    'truncate',
                    selectedOptions.length === 0 && 'text-muted-foreground'
                  )}
                >
                  {getDisplayText()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 ml-2">
              {clearable && selectedValues.length > 0 && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-accent rounded-sm"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  isOpen && 'rotate-180'
                )}
              />
            </div>
          </button>

          {isOpen && (
            <div
              className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg"
              style={{ maxHeight }}
            >
              {searchable && (
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search options..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              <div className="max-h-48 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    {searchTerm ? 'No options found' : 'No options available'}
                  </div>
                ) : (
                  <div role="listbox" aria-multiselectable={multiple}>
                    {filteredOptions.map((option) => {
                      const isSelected = selectedValues.includes(option.value);
                      
                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          disabled={option.disabled}
                          onClick={() => !option.disabled && handleSelect(option.value)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors',
                            'hover:bg-accent focus:bg-accent focus:outline-none',
                            isSelected && 'bg-primary/10 text-primary',
                            option.disabled && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          {option.icon && (
                            <span className="flex-shrink-0">
                              {option.icon}
                            </span>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{option.label}</div>
                            {option.description && (
                              <div className="text-xs text-muted-foreground truncate">
                                {option.description}
                              </div>
                            )}
                          </div>

                          {isSelected && (
                            <Check className="h-4 w-4 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
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

Select.displayName = 'Select';

export { Select }; 