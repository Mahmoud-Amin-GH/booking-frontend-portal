import React, { useState, useRef, useEffect } from 'react';
import Icon from '../primitives/Icon';
import Typography from '../primitives/Typography';

export interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  disabled?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  onToggle?: (expanded: boolean) => void;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultExpanded = false,
  disabled = false,
  className = '',
  titleClassName = '',
  contentClassName = '',
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children, isExpanded]);

  const handleToggle = () => {
    if (disabled) return;
    
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  return (
    <div className={`border border-outline-variant rounded-lg bg-surface overflow-hidden ${className}`}>
      {/* Header */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full px-6 py-4 flex items-center justify-between 
          hover:bg-surface-container-highest active:bg-surface-container-highest
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600/20
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${titleClassName}
        `}
      >
        <Typography 
          variant="title-medium" 
          color={disabled ? 'on-surface-variant' : 'on-surface'}
          className="font-medium text-left"
        >
          {title}
        </Typography>
        
        <Icon 
          name="arrow-right" 
          size="small"
          className={`
            transition-transform duration-300 ease-in-out
            ${isExpanded ? 'rotate-90' : 'rotate-0'}
            ${disabled ? 'text-on-surface-variant' : 'text-on-surface-variant'}
          `}
        />
      </button>

      {/* Content */}
      <div
        style={{ 
          height: isExpanded ? `${contentHeight}px` : '0px',
          transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        className="overflow-hidden"
      >
        <div 
          ref={contentRef}
          className={`px-6 pb-6 ${contentClassName}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion; 