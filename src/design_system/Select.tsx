import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

export interface SelectOption {
  value: string | number;
  label: string;
  labelEn?: string;
  labelAr?: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  onChange: (value: string | number) => void;
  onSearch?: (searchTerm: string) => void;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  loading = false,
  searchable = false,
  clearable = false,
  onChange,
  onSearch,
  className = '',
}) => {
  const { language, isRTL } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get localized label for option
  const getOptionLabel = (option: SelectOption): string => {
    if (option.labelEn && option.labelAr) {
      return language === 'ar' ? option.labelAr : option.labelEn;
    }
    return option.label;
  };

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter(option =>
        getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Get selected option
  const selectedOption = options.find(option => option.value === value);
  
  // Determine if label should float
  const hasValue = selectedOption !== undefined;
  const isFloating = isFocused || hasValue || isOpen;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
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
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0) {
          handleOptionSelect(filteredOptions[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
    }
  };

  const handleOptionSelect = (option: SelectOption) => {
    if (option.disabled) return;
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange('');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    onSearch?.(term);
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    setFocusedIndex(-1);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const triggerClasses = `
    relative w-full h-14 px-4 py-5 pb-2
    bg-transparent
    border border-md-sys-color-outline
    rounded-xs
    text-md-sys-color-on-surface
    cursor-pointer
    transition-all duration-250
    focus:outline-none focus:ring-2 focus:ring-md-sys-color-primary focus:border-md-sys-color-primary
    hover:border-md-sys-color-on-surface-variant
    ${disabled ? 'opacity-50 cursor-not-allowed bg-md-sys-color-surface-variant' : ''}
    ${error ? 'border-md-sys-color-error focus:border-md-sys-color-error focus:ring-md-sys-color-error/20' : ''}
    ${isOpen || isFocused ? 'border-md-sys-color-primary ring-2 ring-md-sys-color-primary/20' : ''}
    flex items-start justify-between
  `;

  const labelStyles = `
    absolute ${isRTL ? 'right-0' : 'left-0'} top-0 origin-top-${isRTL ? 'right' : 'left'} transition-all duration-250 pointer-events-none select-none
    ${isFloating ? 'text-label-small px-4 pt-2 transform scale-75' : 'text-body-xs px-4 pt-4'}
    ${error ? 'text-md-sys-color-error' : (isFocused || isOpen) ? 'text-md-sys-color-primary' : 'text-md-sys-color-on-surface-variant'}
  `;

  const dropdownClasses = `
    absolute top-full left-0 right-0 mt-1 z-50
    bg-white
    border border-md-sys-color-outline-variant
    rounded-xs
    shadow-xl
    max-h-60 overflow-y-auto
    ${isOpen ? 'block' : 'hidden'}
  `;

  const optionClasses = (option: SelectOption, index: number) => `
    px-4 py-3 cursor-pointer
    text-gray-900
    hover:bg-gray-50
    transition-colors duration-150
    ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${option.value === value ? 'bg-blue-50 text-blue-900 font-medium' : ''}
    ${index === focusedIndex ? 'bg-gray-100' : ''}
    ${index === 0 ? 'rounded-t-xs' : ''}
    ${index === filteredOptions.length - 1 ? 'rounded-b-xs' : ''}
  `;

  return (
    <div className="w-full space-y-1">
      <div ref={selectRef} className="relative">
        <div
          className={triggerClasses}
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={label}
        >
          <div className="flex-1 text-left truncate pt-1">
            {loading ? (
              <span className="text-md-sys-color-on-surface-variant">
                {t('common.loading')}...
              </span>
            ) : selectedOption ? (
              getOptionLabel(selectedOption)
            ) : (
              <span className="text-md-sys-color-on-surface-variant">
                {!isFloating && placeholder ? placeholder : ''}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 pt-1">
            {clearable && selectedOption && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-md-sys-color-surface-container-high rounded-full transition-colors"
                aria-label={t('common.clear')}
              >
                <Icon name="close" size="small" />
              </button>
            )}
            <Icon
              name={isOpen ? 'arrow-left' : (isRTL ? 'arrow-left' : 'arrow-right')}
              size="small"
              className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            />
          </div>

          {/* Floating Label */}
          {label && (
            <label className={labelStyles}>
              {label}
              {required && <span className="text-md-sys-color-error ml-1">*</span>}
            </label>
          )}
        </div>

        <div ref={dropdownRef} className={dropdownClasses} role="listbox">
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={t('common.search')}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xs text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          
          {loading ? (
            <div className="p-4 text-center text-gray-600">
              {t('common.loading')}...
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="p-4 text-center text-gray-600">
              {searchTerm ? t('common.noResults') : t('common.noOptions')}
            </div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                className={optionClasses(option, index)}
                onClick={() => handleOptionSelect(option)}
                role="option"
                aria-selected={option.value === value}
              >
                {getOptionLabel(option)}
              </div>
            ))
          )}
        </div>
      </div>

      {error && (
        <div className={`px-4 text-label-small ${isRTL ? 'text-right' : 'text-left'} text-md-sys-color-error mt-1`}>
          <Icon name="close" size="small" className="inline mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};