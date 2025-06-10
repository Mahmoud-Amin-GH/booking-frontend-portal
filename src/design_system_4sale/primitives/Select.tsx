import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { cn } from '../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'value' | 'onChange'> {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  helperText?: string;
  label?: string;
  fullWidth?: boolean;
}

const selectSizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-5 text-lg'
};

// Kuwait Governorates for common use case
export const kuwaitGovernorates: SelectOption[] = [
  { value: 'capital', label: 'العاصمة / Capital' },
  { value: 'hawalli', label: 'حولي / Hawalli' },
  { value: 'farwaniya', label: 'الفروانية / Farwaniya' },
  { value: 'mubarak_al_kabeer', label: 'مبارك الكبير / Mubarak Al-Kabeer' },
  { value: 'ahmadi', label: 'الأحمدي / Ahmadi' },
  { value: 'jahra', label: 'الجهراء / Jahra' }
];

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  options,
  value = '',
  onChange,
  placeholder = 'Select an option',
  searchable = false,
  clearable = false,
  size = 'md',
  error,
  helperText,
  label,
  fullWidth = false,
  disabled,
  className,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const hasError = !!error;
  const selectedOption = options.find(option => option.value === value);
  
  // Filter options based on search term
  const filteredOptions = searchable && searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;
  
  // Group options if they have groups
  const groupedOptions = filteredOptions.reduce((groups, option) => {
    const group = option.group || '';
    if (!groups[group]) groups[group] = [];
    groups[group].push(option);
    return groups;
  }, {} as Record<string, SelectOption[]>);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex].value);
        }
        break;
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
  };

  return (
    <div className={cn('relative', fullWidth && 'w-full')}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 font-sakr mb-1">
          {label}
        </label>
      )}

      {/* Hidden native select for form compatibility */}
      <select
        ref={ref}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="sr-only"
        disabled={disabled}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Custom select trigger */}
      <div
        ref={containerRef}
        className={cn(
          'relative cursor-pointer border rounded-lg transition-colors font-sakr',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
          selectSizes[size],
          hasError 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 hover:border-primary-400',
          disabled && 'cursor-not-allowed opacity-50 bg-gray-50',
          fullWidth && 'w-full',
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center justify-between">
          <span className={cn(
            'truncate',
            selectedOption ? 'text-gray-900' : 'text-gray-500'
          )}>
            {selectedOption?.label || placeholder}
          </span>
          
          <div className="flex items-center gap-1">
            {/* Clear button */}
            {clearable && selectedOption && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                aria-label="Clear selection"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {/* Dropdown arrow */}
            <svg 
              className={cn(
                'w-5 h-5 text-gray-400 transition-transform',
                isOpen && 'transform rotate-180'
              )} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search options..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 font-sakr"
              />
            </div>
          )}
          
          {/* Options */}
          <div className="overflow-y-auto max-h-48" role="listbox">
            {Object.keys(groupedOptions).length === 0 ? (
              <div className="px-3 py-2 text-gray-500 font-sakr">No options found</div>
            ) : (
              Object.entries(groupedOptions).map(([group, groupOptions]) => (
                <div key={group}>
                  {/* Group header */}
                  {group && (
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 font-sakr">
                      {group}
                    </div>
                  )}
                  
                  {/* Group options */}
                  {groupOptions.map((option, index) => {
                    const globalIndex = filteredOptions.indexOf(option);
                    return (
                      <div
                        key={option.value}
                        className={cn(
                          'px-3 py-2 cursor-pointer transition-colors font-sakr',
                          'hover:bg-primary-50 hover:text-primary-700',
                          globalIndex === highlightedIndex && 'bg-primary-50 text-primary-700',
                          value === option.value && 'bg-primary-100 text-primary-800 font-medium',
                          option.disabled && 'cursor-not-allowed opacity-50'
                        )}
                        onClick={() => !option.disabled && handleOptionClick(option.value)}
                        role="option"
                        aria-selected={value === option.value}
                      >
                        {option.label}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 font-sakr">{error}</p>
      )}
      
      {/* Helper text */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 font-sakr">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
