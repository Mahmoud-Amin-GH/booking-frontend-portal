import React from 'react';
import { cn } from '../../../../utils/cn';
import { Badge } from '../../core/Badge';
import { Button } from '../../core/Button';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: string | number;
  children?: SidebarItem[];
}

export interface SidebarProps {
  items?: SidebarItem[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  width?: 'sm' | 'md' | 'lg';
  collapsible?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  variant?: 'default' | 'bordered' | 'floating';
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ 
    items = [],
    header,
    footer,
    className,
    width = 'md',
    collapsible = false,
    collapsed = false,
    onCollapsedChange,
    variant = 'default',
    ...props 
  }, ref) => {
    const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

    const widthClasses = {
      sm: collapsed ? 'w-16' : 'w-48',
      md: collapsed ? 'w-16' : 'w-64',
      lg: collapsed ? 'w-16' : 'w-80'
    };

    const variantClasses = {
      default: 'bg-background border-r border-border',
      bordered: 'bg-background border border-border rounded-lg',
      floating: 'bg-background border border-border rounded-lg shadow-lg'
    };

    const toggleExpanded = (itemId: string) => {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId);
      } else {
        newExpanded.add(itemId);
      }
      setExpandedItems(newExpanded);
    };

    const renderSidebarItem = (item: SidebarItem, level = 0) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedItems.has(item.id);
      const paddingLeft = collapsed ? 'pl-4' : level === 0 ? 'pl-4' : `pl-${4 + level * 4}`;

      return (
        <div key={item.id}>
          <button
            onClick={() => {
              if (hasChildren) {
                toggleExpanded(item.id);
              } else {
                item.onClick?.();
              }
            }}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors group',
              item.active 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent',
              paddingLeft
            )}
            title={collapsed ? item.label : undefined}
          >
            <div className="flex items-center space-x-3 min-w-0">
              {item.icon && (
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {item.icon}
                </div>
              )}
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </div>
            
            {!collapsed && (
              <div className="flex items-center space-x-2">
                {item.badge && (
                  <Badge size="sm" variant="destructive">
                    {item.badge}
                  </Badge>
                )}
                {hasChildren && (
                  <ChevronDown className={cn(
                    'h-4 w-4 transition-transform',
                    isExpanded && 'rotate-180'
                  )} />
                )}
              </div>
            )}
          </button>

          {hasChildren && isExpanded && !collapsed && item.children && (
            <div className="mt-1 space-y-1">
              {item.children.map((child) => renderSidebarItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col h-full transition-all duration-200',
          widthClasses[width],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {/* Header */}
        {header && (
          <div className={cn(
            'flex items-center justify-between p-4 border-b border-border',
            collapsed && 'justify-center'
          )}>
            {collapsed ? (
              <div className="w-8 h-8 flex items-center justify-center">
                {React.isValidElement(header) && header.props.children?.[0]}
              </div>
            ) : (
              header
            )}
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {items.map((item) => renderSidebarItem(item))}
        </div>

        {/* Footer */}
        {footer && (
          <div className={cn(
            'p-4 border-t border-border',
            collapsed && 'flex justify-center'
          )}>
            {footer}
          </div>
        )}

        {/* Collapse Toggle */}
        {collapsible && (
          <div className="p-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCollapsedChange?.(!collapsed)}
              className="w-full"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Collapse
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export { Sidebar }; 