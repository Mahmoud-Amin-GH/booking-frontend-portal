import React from 'react';

export interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  children: React.ReactNode;
  className?: string;
}

const variantClasses = {
  h1: 'text-3xl font-bold',
  h2: 'text-2xl font-semibold',
  h3: 'text-xl font-medium',
  body: 'text-base',
  caption: 'text-xs text-gray-500',
};

const Typography: React.FC<TypographyProps> = ({ variant = 'body', children, className = '' }) => {
  const Tag = variant === 'body' || variant === 'caption' ? 'p' : variant;
  return <Tag className={`${variantClasses[variant]} ${className}`}>{children}</Tag>;
};

export default Typography; 