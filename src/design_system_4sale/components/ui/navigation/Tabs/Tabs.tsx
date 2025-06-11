import React from 'react';
import { cn } from '../../../../utils/cn';
import { Badge } from '../../core/Badge';

export interface TabItem {
  id: string;
  label: string;
  content?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  fullWidth?: boolean;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ 
    items,
    defaultValue,
    value,
    onValueChange,
    className,
    variant = 'default',
    size = 'md',
    orientation = 'horizontal',
    fullWidth = false,
    ...props 
  }, ref) => {
    const [activeTab, setActiveTab] = React.useState(
      value || defaultValue || items[0]?.id || ''
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setActiveTab(value);
      }
    }, [value]);

    const handleTabChange = (tabId: string) => {
      if (value === undefined) {
        setActiveTab(tabId);
      }
      onValueChange?.(tabId);
    };

    const sizeClasses = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-6 py-3'
    };

    const getTabClasses = (item: TabItem, isActive: boolean) => {
      const baseClasses = cn(
        'inline-flex items-center justify-center space-x-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        sizeClasses[size],
        fullWidth && 'flex-1',
        item.disabled && 'opacity-50 cursor-not-allowed'
      );

      switch (variant) {
        case 'pills':
          return cn(
            baseClasses,
            'rounded-full',
            isActive 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          );
        case 'underline':
          return cn(
            baseClasses,
            'border-b-2 rounded-none',
            isActive 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          );
        case 'bordered':
          return cn(
            baseClasses,
            'border rounded-md',
            isActive 
              ? 'border-primary bg-primary/5 text-primary' 
              : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
          );
        default:
          return cn(
            baseClasses,
            'rounded-md',
            isActive 
              ? 'bg-background text-foreground shadow-sm border border-border' 
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          );
      }
    };

    const getTabListClasses = () => {
      const baseClasses = cn(
        'flex',
        orientation === 'vertical' ? 'flex-col space-y-1' : 'space-x-1',
        fullWidth && orientation === 'horizontal' && 'w-full'
      );

      switch (variant) {
        case 'underline':
          return cn(
            baseClasses,
            orientation === 'horizontal' 
              ? 'border-b border-border' 
              : 'border-r border-border'
          );
        case 'bordered':
          return cn(baseClasses, 'p-1 bg-muted rounded-lg');
        default:
          return baseClasses;
      }
    };

    const activeItem = items.find(item => item.id === activeTab);

    return (
      <div
        ref={ref}
        className={cn(
          'w-full',
          orientation === 'vertical' && 'flex gap-6',
          className
        )}
        {...props}
      >
        {/* Tab List */}
        <div
          role="tablist"
          aria-orientation={orientation}
          className={getTabListClasses()}
        >
          {items.map((item) => {
            const isActive = item.id === activeTab;
            
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${item.id}`}
                id={`tab-${item.id}`}
                disabled={item.disabled}
                onClick={() => !item.disabled && handleTabChange(item.id)}
                className={getTabClasses(item, isActive)}
              >
                {item.icon && (
                  <span className="flex-shrink-0">
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
                {item.badge && (
                  <Badge size="sm" variant="secondary">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeItem?.content && (
          <div
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className={cn(
              'mt-4',
              orientation === 'vertical' && 'mt-0 flex-1'
            )}
          >
            {activeItem.content}
          </div>
        )}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';

export { Tabs }; 