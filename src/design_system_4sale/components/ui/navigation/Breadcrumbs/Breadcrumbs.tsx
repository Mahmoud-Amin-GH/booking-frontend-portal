import React from 'react';
import { cn } from '../../../../utils/cn';
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  current?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
  maxItems?: number;
  showHome?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ 
    items,
    separator = <ChevronRight className="h-4 w-4" />,
    className,
    maxItems = 5,
    showHome = false,
    size = 'md',
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };

    // Add home item if requested
    const allItems: BreadcrumbItem[] = showHome 
      ? [{ label: 'Home', icon: <Home className="h-4 w-4" />, href: '/' }, ...items]
      : items;

    // Handle item overflow
    const displayItems = React.useMemo(() => {
      if (allItems.length <= maxItems) {
        return allItems;
      }

      const firstItem = allItems[0];
      const lastItems = allItems.slice(-2); // Always show last 2 items
      const middleItems = allItems.slice(1, -2);

      if (middleItems.length === 0 || !firstItem) {
        return allItems;
      }

      const ellipsisItem: BreadcrumbItem = { 
        label: '...', 
        icon: <MoreHorizontal className="h-4 w-4" /> 
      };

      return [
        firstItem,
        ellipsisItem,
        ...lastItems
      ];
    }, [allItems, maxItems]);

    const renderBreadcrumbItem = (item: BreadcrumbItem, index: number) => {
      const isLast = index === displayItems.length - 1;
      const isEllipsis = item.label === '...';

      const itemContent = (
        <span className="flex items-center space-x-1">
          {item.icon && (
            <span className="flex-shrink-0">
              {item.icon}
            </span>
          )}
          <span className={cn(
            'truncate',
            isEllipsis && 'cursor-default'
          )}>
            {item.label}
          </span>
        </span>
      );

      if (isLast || isEllipsis) {
        return (
          <span
            key={index}
            className={cn(
              'flex items-center',
              isLast ? 'text-foreground font-medium' : 'text-muted-foreground',
              isEllipsis && 'cursor-default'
            )}
            aria-current={isLast ? 'page' : undefined}
          >
            {itemContent}
          </span>
        );
      }

      if (item.onClick) {
        return (
          <button
            key={index}
            onClick={item.onClick}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {itemContent}
          </button>
        );
      }

      return (
        <a
          key={index}
          href={item.href}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {itemContent}
        </a>
      );
    };

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn(sizeClasses[size], className)}
        {...props}
      >
        <ol className="flex items-center space-x-2">
          {displayItems.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              {renderBreadcrumbItem(item, index)}
              {index < displayItems.length - 1 && (
                <span className="text-muted-foreground flex-shrink-0" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';

export { Breadcrumbs }; 