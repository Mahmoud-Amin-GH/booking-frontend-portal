import React, { createContext, useContext, useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../../utils/cn';

// Types
interface AccordionContextValue {
  type: 'single' | 'multiple';
  value: string | string[] | undefined;
  onValueChange: (value: string | string[] | undefined) => void;
  collapsible?: boolean;
}

interface AccordionProps {
  type: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[] | undefined) => void;
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface AccordionItemProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
}

interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

// Context
const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion');
  }
  return context;
};

// Item Context
const AccordionItemContext = createContext<{ value: string; disabled?: boolean } | undefined>(undefined);

const useAccordionItem = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionTrigger and AccordionContent must be used within an AccordionItem');
  }
  return context;
};

// Main Accordion Component
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ type, value, defaultValue, onValueChange, collapsible = false, className, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState<string | string[] | undefined>(
      value ?? defaultValue ?? (type === 'multiple' ? [] : undefined)
    );

    const currentValue = value ?? internalValue;

    const handleValueChange = useCallback((newValue: string | string[] | undefined) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    }, [value, onValueChange]);

    const contextValue: AccordionContextValue = {
      type,
      value: currentValue,
      onValueChange: handleValueChange,
      collapsible
    };

    return (
      <AccordionContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn('space-y-2', className)}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

Accordion.displayName = 'Accordion';

// Accordion Item
export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled = false, className, children, ...props }, ref) => {
    return (
      <AccordionItemContext.Provider value={{ value, disabled }}>
        <div
          ref={ref}
          className={cn(
            'border border-border rounded-lg overflow-hidden',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);

AccordionItem.displayName = 'AccordionItem';

// Accordion Trigger
export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { type, value, onValueChange, collapsible } = useAccordion();
    const { value: itemValue, disabled } = useAccordionItem();

    const isOpen = type === 'multiple' 
      ? Array.isArray(value) && value.includes(itemValue)
      : value === itemValue;

    const handleClick = () => {
      if (disabled) return;

      if (type === 'single') {
        const newValue = isOpen && collapsible ? undefined : itemValue;
        onValueChange(newValue);
      } else {
        const currentArray = Array.isArray(value) ? value : [];
        const newValue = isOpen
          ? currentArray.filter(v => v !== itemValue)
          : [...currentArray, itemValue];
        onValueChange(newValue);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          'flex w-full items-center justify-between px-4 py-3 text-left',
          'font-medium text-foreground hover:bg-muted/50 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        aria-expanded={isOpen}
        {...props}
      >
        <span>{children}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
    );
  }
);

AccordionTrigger.displayName = 'AccordionTrigger';

// Accordion Content
export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { type, value } = useAccordion();
    const { value: itemValue } = useAccordionItem();

    const isOpen = type === 'multiple' 
      ? Array.isArray(value) && value.includes(itemValue)
      : value === itemValue;

    return (
      <div
        ref={ref}
        className={cn(
          'overflow-hidden transition-all duration-200 ease-in-out',
          isOpen ? 'animate-accordion-down' : 'animate-accordion-up'
        )}
        style={{
          height: isOpen ? 'auto' : 0,
        }}
        {...props}
      >
        <div className={cn('px-4 py-3 border-t border-border', className)}>
          {children}
        </div>
      </div>
    );
  }
);

AccordionContent.displayName = 'AccordionContent';

// Convenience component for simple use cases
interface SimpleAccordionItem {
  value: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface SimpleAccordionProps extends Omit<AccordionProps, 'children'> {
  items: SimpleAccordionItem[];
}

export const SimpleAccordion = React.forwardRef<HTMLDivElement, SimpleAccordionProps>(
  ({ items, ...accordionProps }, ref) => {
    return (
      <Accordion ref={ref} {...accordionProps}>
        {items.map((item) => (
          <AccordionItem 
            key={item.value} 
            value={item.value} 
            disabled={item.disabled ?? false}
          >
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }
);

SimpleAccordion.displayName = 'SimpleAccordion'; 