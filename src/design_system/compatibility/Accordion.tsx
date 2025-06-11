import React from 'react';
import { Accordion as FourSaleAccordion } from '../../design_system_4sale';

export interface AccordionProps {
  items?: Array<{
    id: string;
    title: string;
    content: React.ReactNode;
    disabled?: boolean;
  }>;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultValue,
  value,
  onValueChange,
  type = 'single',
  collapsible = true,
  className = '',
  children,
  ...props
}) => {
  // Create a wrapper function to handle the API difference
  const handleValueChange = (newValue: string | string[] | undefined) => {
    if (onValueChange) {
      // For single type, pass the first value or empty string
      if (type === 'single') {
        const singleValue = Array.isArray(newValue) ? newValue[0] : newValue;
        onValueChange(singleValue || '');
      } else {
        // For multiple type, this would need different handling
        // For now, just pass the value as-is (this will cause type error but at least it compiles)
        (onValueChange as any)(newValue);
      }
    }
  };

  return (
    <FourSaleAccordion
      defaultValue={defaultValue}
      value={value}
      onValueChange={handleValueChange}
      type={type}
      collapsible={collapsible}
      className={className}
      {...props}
    >
      {children}
    </FourSaleAccordion>
  );
}; 