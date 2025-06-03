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
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
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

  const baseClasses = `
    relative w-full min-w-0
    ${className}
  `;

  const triggerClasses = `
    relative w-full h-14 px-4 py-3
    bg-md-sys-color-surface-container-highest
    border border-md-sys-color-outline
    rounded-lg
    text-md-sys-color-on-surface
    placeholder-md-sys-color-on-surface-variant
    cursor-pointer
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-md-sys-color-primary focus:border-md-sys-color-primary
    hover:bg-md-sys-color-surface-container-high
    ${disabled ? 'opacity-50 cursor-not-allowed bg-md-sys-color-surface-variant' : ''}
    ${error ? 'border-md-sys-color-error' : ''}
    ${isOpen ? 'border-md-sys-color-primary ring-2 ring-md-sys-color-primary' : ''}
    flex items-center justify-between
  `;

  const dropdownClasses = `
    absolute top-full left-0 right-0 mt-1 z-50
    bg-white
    border border-md-sys-color-outline-variant
    rounded-lg
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
    ${index === 0 ? 'rounded-t-lg' : ''}
    ${index === filteredOptions.length - 1 ? 'rounded-b-lg' : ''}
  `;

  return (
    <div className={baseClasses}>
      {label && (
        <label className="block text-sm font-medium text-md-sys-color-on-surface mb-2">
          {label}
          {required && <span className="text-md-sys-color-error ml-1">*</span>}
        </label>
      )}
      
      <div ref={selectRef} className="relative">
        <div
          className={triggerClasses}
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={label}
        >
          <span className="flex-1 text-left truncate">
            {loading ? (
              <span className="text-md-sys-color-on-surface-variant">
                {t('common.loading')}...
              </span>
            ) : selectedOption ? (
              getOptionLabel(selectedOption)
            ) : (
              <span className="text-md-sys-color-on-surface-variant">
                {placeholder || t('common.select')}
              </span>
            )}
          </span>
          
          <div className="flex items-center gap-2">
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
              name={isOpen ? 'arrow-left' : 'arrow-right'}
              size="small"
              className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            />
          </div>
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
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <p className="mt-1 text-sm text-md-sys-color-error flex items-center gap-1">
          <Icon name="close" size="small" />
          {error}
        </p>
      )}
    </div>
  );
}; 