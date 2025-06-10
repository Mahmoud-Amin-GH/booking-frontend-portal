import React, { useState } from 'react';
import { cn } from '../utils/cn';

export interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  disabled?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'card' | 'bordered';
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultExpanded = false,
  disabled = false,
  className,
  headerClassName,
  contentClassName,
  icon,
  variant = 'default',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    if (!disabled) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleExpanded();
    }
  };

  const variantStyles = {
    default: {
      container: 'border-b border-gray-200',
      header: 'py-4',
      content: 'pb-4',
    },
    card: {
      container: 'bg-white rounded-lg shadow-sm border border-gray-200',
      header: 'px-6 py-4',
      content: 'px-6 pb-4',
    },
    bordered: {
      container: 'border border-gray-200 rounded-lg',
      header: 'px-4 py-3 border-b border-gray-200 last:border-b-0',
      content: 'px-4 pb-3',
    },
  };

  const currentStyles = variantStyles[variant];

  return (
    <div
      className={cn(
        'font-sakr transition-all duration-200',
        currentStyles.container,
        disabled && 'opacity-60',
        className
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={toggleExpanded}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between text-left transition-colors',
          currentStyles.header,
          !disabled && 'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset',
          disabled && 'cursor-not-allowed',
          headerClassName
        )}
        aria-expanded={isExpanded}
        aria-controls={`accordion-content-${title}`}
      >
        <div className="flex items-center gap-3 flex-1">
          {icon && (
            <div className="shrink-0 text-gray-500">
              {icon}
            </div>
          )}
          <h3 className="text-base font-medium text-gray-900 flex-1">
            {title}
          </h3>
        </div>

        {/* Chevron Icon */}
        <div
          className={cn(
            'shrink-0 ml-3 transform transition-transform duration-200 text-gray-400',
            isExpanded && 'rotate-180'
          )}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Content */}
      <div
        id={`accordion-content-${title}`}
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!isExpanded}
      >
        <div
          className={cn(
            'transition-transform duration-300',
            currentStyles.content,
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
