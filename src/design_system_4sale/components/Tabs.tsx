import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
  fullWidth?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab,
  onTabChange,
  variant = 'underline',
  size = 'md',
  className,
  tabsClassName,
  contentClassName,
  fullWidth = false,
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string, index: number) => {
    let newIndex = index;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = tabs.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleTabChange(tabId);
        return;
      default:
        return;
    }

    // Focus the new tab
    const tabElements = tabsRef.current?.querySelectorAll('[role="tab"]');
    if (tabElements?.[newIndex]) {
      (tabElements[newIndex] as HTMLElement).focus();
    }
  };

  const sizeStyles = {
    sm: 'text-sm px-3 py-2',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-5 py-3',
  };

  const variantStyles = {
    default: {
      container: 'border-b border-gray-200',
      tab: cn(
        'border-b-2 border-transparent transition-colors duration-200',
        'hover:text-gray-700 hover:border-gray-300',
        'focus:outline-none focus:text-primary-600 focus:border-primary-300'
      ),
      activeTab: 'text-primary-600 border-primary-600',
      disabledTab: 'text-gray-400 cursor-not-allowed',
    },
    pills: {
      container: 'bg-gray-100 rounded-lg p-1',
      tab: cn(
        'rounded-md transition-all duration-200',
        'hover:text-gray-700 hover:bg-white/50',
        'focus:outline-none focus:ring-2 focus:ring-primary-500'
      ),
      activeTab: 'bg-white text-primary-600 shadow-sm',
      disabledTab: 'text-gray-400 cursor-not-allowed',
    },
    underline: {
      container: 'border-b border-gray-200',
      tab: cn(
        'border-b-2 border-transparent transition-all duration-200',
        'hover:text-gray-700 hover:border-gray-300',
        'focus:outline-none focus:text-primary-600 focus:border-primary-300'
      ),
      activeTab: 'text-primary-600 border-primary-600',
      disabledTab: 'text-gray-400 cursor-not-allowed',
    },
  };

  const currentVariant = variantStyles[variant];

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={cn('font-sakr', className)}>
      {/* Tab List */}
      <div
        ref={tabsRef}
        className={cn(
          'flex',
          currentVariant.container,
          fullWidth && 'w-full',
          tabsClassName
        )}
        role="tablist"
        aria-orientation="horizontal"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              tabIndex={isActive ? 0 : -1}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              aria-disabled={isDisabled}
              className={cn(
                'flex items-center gap-2 font-medium transition-all duration-200',
                sizeStyles[size],
                currentVariant.tab,
                fullWidth && 'flex-1 justify-center',
                isActive && currentVariant.activeTab,
                isDisabled && currentVariant.disabledTab,
                !isDisabled && !isActive && 'text-gray-600'
              )}
              onClick={() => !isDisabled && handleTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id, index)}
              disabled={isDisabled}
            >
              {tab.icon && (
                <span className="shrink-0">
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className={cn('mt-6', contentClassName)}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`tab-${tab.id}`}
            className={cn(
              'focus:outline-none',
              tab.id === activeTab ? 'block' : 'hidden'
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
