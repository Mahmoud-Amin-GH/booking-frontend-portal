import React from 'react';

export interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  variant?: string;
  component?: string;
  [key: string]: any;
}

const Typography: React.FC<TypographyProps> = ({ 
  children, 
  className = '', 
  variant,
  component = 'span',
  ...props 
}) => {
  // Simple wrapper - just use span for now
  return (
    <span className={className} {...props}>
      {children}
    </span>
  );
};

export default Typography; 