import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { cn } from '../../../../utils/cn';

// Types
interface DropdownMenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DropdownMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface DropdownMenuContentProps {
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  alignOffset?: number;
  children: React.ReactNode;
}

interface DropdownMenuItemProps {
  disabled?: boolean;
  destructive?: boolean;
  className?: string;
  onSelect?: () => void;
  children: React.ReactNode;
}

interface DropdownMenuCheckboxItemProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface DropdownMenuRadioItemProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface DropdownMenuRadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface DropdownMenuSubProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

// Context
const DropdownMenuContext = createContext<DropdownMenuContextValue | undefined>(undefined);
const DropdownMenuRadioGroupContext = createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
} | undefined>(undefined);

const useDropdownMenu = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('DropdownMenu components must be used within a DropdownMenu');
  }
  return context;
};

// Main DropdownMenu Component
export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ open, defaultOpen = false, onOpenChange, children }, ref) => {
    const [internalOpen, setInternalOpen] = useState(open ?? defaultOpen);
    const currentOpen = open ?? internalOpen;

    const handleOpenChange = useCallback((newOpen: boolean) => {
      if (open === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    }, [open, onOpenChange]);

    const contextValue: DropdownMenuContextValue = {
      open: currentOpen,
      onOpenChange: handleOpenChange
    };

    return (
      <DropdownMenuContext.Provider value={contextValue}>
        <div ref={ref} className="relative inline-block">
          {children}
        </div>
      </DropdownMenuContext.Provider>
    );
  }
);

DropdownMenu.displayName = 'DropdownMenu';

// DropdownMenu Trigger
export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const { open, onOpenChange } = useDropdownMenu();

    const handleClick = () => {
      onOpenChange(!open);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onOpenChange(!open);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        onOpenChange(true);
      }
    };

    if (asChild) {
      return React.cloneElement(children as React.ReactElement, {
        ref,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        'aria-expanded': open,
        'aria-haspopup': 'menu',
        ...props
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        {...props}
      >
        {children}
      </button>
    );
  }
);

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

// DropdownMenu Content
export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, align = 'center', side = 'bottom', sideOffset = 4, children, ...props }, ref) => {
    const { open, onOpenChange } = useDropdownMenu();
    const contentRef = useRef<HTMLDivElement>(null);

    // Combine refs
    React.useImperativeHandle(ref, () => contentRef.current!);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
          onOpenChange(false);
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onOpenChange(false);
        }
      };

      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('keydown', handleEscape);
        };
      }
      
      return undefined;
    }, [open, onOpenChange]);

    if (!open) return null;

    const sideClasses = {
      top: 'bottom-full mb-1',
      right: 'left-full ml-1',
      bottom: 'top-full mt-1',
      left: 'right-full mr-1'
    };

    const alignClasses = {
      start: side === 'top' || side === 'bottom' ? 'left-0' : 'top-0',
      center: side === 'top' || side === 'bottom' ? 'left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2',
      end: side === 'top' || side === 'bottom' ? 'right-0' : 'bottom-0'
    };

    return (
      <div
        ref={contentRef}
        className={cn(
          'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg',
          'animate-in fade-in-0 zoom-in-95',
          sideClasses[side],
          alignClasses[align],
          className
        )}
        style={{
          marginTop: side === 'bottom' ? sideOffset : undefined,
          marginBottom: side === 'top' ? sideOffset : undefined,
          marginLeft: side === 'right' ? sideOffset : undefined,
          marginRight: side === 'left' ? sideOffset : undefined,
        }}
        role="menu"
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownMenuContent.displayName = 'DropdownMenuContent';

// DropdownMenu Item
export const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ disabled = false, destructive = false, className, onSelect, children, ...props }, ref) => {
    const { onOpenChange } = useDropdownMenu();

    const handleClick = () => {
      if (!disabled) {
        onSelect?.();
        onOpenChange(false);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    };

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
          'focus:bg-accent focus:text-accent-foreground',
          disabled && 'pointer-events-none opacity-50',
          destructive && 'text-destructive focus:text-destructive',
          className
        )}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownMenuItem.displayName = 'DropdownMenuItem';

// DropdownMenu Checkbox Item
export const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  ({ checked = false, onCheckedChange, disabled = false, className, children, ...props }, ref) => {
    const handleClick = () => {
      if (!disabled) {
        onCheckedChange?.(!checked);
      }
    };

    return (
      <DropdownMenuItem
        ref={ref}
        disabled={disabled}
        className={cn('pl-8', className)}
        onSelect={handleClick}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {checked && <Check className="h-4 w-4" />}
        </span>
        {children}
      </DropdownMenuItem>
    );
  }
);

DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

// DropdownMenu Radio Group
export const DropdownMenuRadioGroup = React.forwardRef<HTMLDivElement, DropdownMenuRadioGroupProps>(
  ({ value, onValueChange, children }, ref) => {
    const contextValue = {
      ...(value !== undefined && { value }),
      ...(onValueChange !== undefined && { onValueChange })
    };

    return (
      <DropdownMenuRadioGroupContext.Provider value={contextValue}>
        <div ref={ref} role="radiogroup">
          {children}
        </div>
      </DropdownMenuRadioGroupContext.Provider>
    );
  }
);

DropdownMenuRadioGroup.displayName = 'DropdownMenuRadioGroup';

// DropdownMenu Radio Item
export const DropdownMenuRadioItem = React.forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(
  ({ value, disabled = false, className, children, ...props }, ref) => {
    const radioContext = useContext(DropdownMenuRadioGroupContext);
    const isSelected = radioContext?.value === value;

    const handleClick = () => {
      if (!disabled) {
        radioContext?.onValueChange?.(value);
      }
    };

    return (
      <DropdownMenuItem
        ref={ref}
        disabled={disabled}
        className={cn('pl-8', className)}
        onSelect={handleClick}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected && <div className="h-2 w-2 rounded-full bg-current" />}
        </span>
        {children}
      </DropdownMenuItem>
    );
  }
);

DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

// DropdownMenu Separator
export const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-muted', className)}
      role="separator"
      {...props}
    />
  )
);

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

// DropdownMenu Label
export const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-2 py-1.5 text-sm font-semibold text-foreground', className)}
      {...props}
    >
      {children}
    </div>
  )
);

DropdownMenuLabel.displayName = 'DropdownMenuLabel';

// DropdownMenu Sub (for nested menus)
export const DropdownMenuSub = React.forwardRef<HTMLDivElement, DropdownMenuSubProps>(
  ({ open, defaultOpen = false, onOpenChange, children }, ref) => {
    const [internalOpen, setInternalOpen] = useState(open ?? defaultOpen);
    const currentOpen = open ?? internalOpen;

    const handleOpenChange = useCallback((newOpen: boolean) => {
      if (open === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    }, [open, onOpenChange]);

    const contextValue: DropdownMenuContextValue = {
      open: currentOpen,
      onOpenChange: handleOpenChange
    };

    return (
      <DropdownMenuContext.Provider value={contextValue}>
        <div ref={ref} className="relative">
          {children}
        </div>
      </DropdownMenuContext.Provider>
    );
  }
);

DropdownMenuSub.displayName = 'DropdownMenuSub';

// DropdownMenu Sub Trigger
export const DropdownMenuSubTrigger = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className, children, ...props }, ref) => {
    const { onOpenChange } = useDropdownMenu();

    return (
      <DropdownMenuItem
        ref={ref}
        className={cn('focus:bg-accent', className)}
        onSelect={() => onOpenChange(true)}
        {...props}
      >
        {children}
        <ChevronRight className="ml-auto h-4 w-4" />
      </DropdownMenuItem>
    );
  }
);

DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

// DropdownMenu Sub Content
export const DropdownMenuSubContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, ...props }, ref) => (
    <DropdownMenuContent
      ref={ref}
      side="right"
      align="start"
      className={cn('min-w-[8rem]', className)}
      {...props}
    />
  )
);

DropdownMenuSubContent.displayName = 'DropdownMenuSubContent'; 