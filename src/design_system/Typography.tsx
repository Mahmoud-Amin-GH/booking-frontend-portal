import React from 'react';

export interface TypographyProps {
  variant?: 
    | 'display-large' | 'display-medium' | 'display-small'
    | 'headline-large' | 'headline-medium' | 'headline-small'
    | 'title-large' | 'title-medium' | 'title-small'
    | 'body-large' | 'body-medium' | 'body-small' | 'body-xs' | 'body-2xs' | 'body-3xs'
    | 'label-large' | 'label-medium' | 'label-small'
    | 'overline';
  component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  color?: 'primary' | 'on-surface' | 'on-surface-variant' | 'on-surface-muted' | 'error' | 'success' | 'warning';
  children: React.ReactNode;
  className?: string;
}

const variantToTagMap = {
  'display-large': 'h1',
  'display-medium': 'h1',
  'display-small': 'h2',
  'headline-large': 'h2',
  'headline-medium': 'h3',
  'headline-small': 'h3',
  'title-large': 'h4',
  'title-medium': 'h5',
  'title-small': 'h6',
  'body-large': 'p',
  'body-medium': 'p',
  'body-small': 'p',
  'body-xs': 'p',
  'body-2xs': 'p',
  'body-3xs': 'p',
  'label-large': 'span',
  'label-medium': 'span',
  'label-small': 'span',
  'overline': 'span',
} as const;

const variantClasses = {
  // Display variants (extracted from Figma)
  'display-large': 'text-display-large',     // 48px/700
  'display-medium': 'text-display-medium',   // 36px/700
  'display-small': 'text-display-small',     // 30px/700
  
  // Headline variants
  'headline-large': 'text-headline-large',   // 24px/700
  'headline-medium': 'text-headline-medium', // 20px/700
  'headline-small': 'text-headline-small',   // 18px/700
  
  // Title variants
  'title-large': 'text-title-large',         // 16px/700
  'title-medium': 'text-title-medium',       // 14px/700
  'title-small': 'text-title-small',         // 12px/700
  
  // Body variants
  'body-large': 'text-body-large',           // 24px/400
  'body-medium': 'text-body-medium',         // 20px/400
  'body-small': 'text-body-small',           // 18px/400
  'body-xs': 'text-body-xs',                 // 16px/400
  'body-2xs': 'text-body-2xs',               // 14px/400
  'body-3xs': 'text-body-3xs',               // 12px/400
  
  // Label variants (Medium weight)
  'label-large': 'text-label-large',         // 16px/500
  'label-medium': 'text-label-medium',       // 14px/500
  'label-small': 'text-label-small',         // 12px/500
  
  // Overline
  'overline': 'text-overline uppercase tracking-wider', // 10px/500
};

const colorClasses = {
  primary: 'text-primary-600',
  'on-surface': 'text-on-surface',
  'on-surface-variant': 'text-on-surface-variant',
  'on-surface-muted': 'text-on-surface-muted',
  error: 'text-error',
  success: 'text-success',
  warning: 'text-warning',
};

const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body-xs', 
  component,
  color = 'on-surface',
  children, 
  className = '' 
}) => {
  const Tag = component || variantToTagMap[variant] || 'p';
  
  const combinedClassName = `
    ${variantClasses[variant]} 
    ${colorClasses[color]} 
    ${className}
  `.trim();

  return React.createElement(Tag, { className: combinedClassName }, children);
};

export default Typography; 