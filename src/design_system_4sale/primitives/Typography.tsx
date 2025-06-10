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
  gutterBottom?: boolean;
}

const variantClasses: Record<string, string> = {
  'display-large': 'text-5xl font-light font-sakr',
  'display-medium': 'text-4xl font-light font-sakr',
  'display-small': 'text-3xl font-normal font-sakr',
  'headline-large': 'text-2xl font-normal font-sakr',
  'headline-medium': 'text-xl font-normal font-sakr',
  'headline-small': 'text-lg font-medium font-sakr',
  'title-large': 'text-base font-medium font-sakr',
  'title-medium': 'text-sm font-medium font-sakr',
  'title-small': 'text-xs font-medium font-sakr',
  'body-large': 'text-base font-normal font-sakr',
  'body-medium': 'text-sm font-normal font-sakr',
  'body-small': 'text-xs font-normal font-sakr',
  'body-xs': 'text-xs font-normal font-sakr',
  'body-2xs': 'text-[10px] font-normal font-sakr',
  'body-3xs': 'text-[8px] font-normal font-sakr',
  'label-large': 'text-sm font-medium font-sakr',
  'label-medium': 'text-xs font-medium font-sakr',
  'label-small': 'text-[10px] font-medium font-sakr',
  'overline': 'text-[10px] font-medium uppercase tracking-wider font-sakr'
};

const colorClasses: Record<string, string> = {
  'primary': 'text-primary-600',
  'on-surface': 'text-gray-900',
  'on-surface-variant': 'text-gray-600',
  'on-surface-muted': 'text-gray-500',
  'error': 'text-red-600',
  'success': 'text-green-600',
  'warning': 'text-yellow-600'
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body-xs',
  component = 'p',
  color = 'on-surface',
  children,
  className = '',
  gutterBottom = false,
  ...props
}) => {
  const classes = [
    variantClasses[variant] || 'text-xs font-normal font-sakr',
    colorClasses[color] || 'text-gray-900',
    gutterBottom ? 'mb-2' : '',
    className
  ].filter(Boolean).join(' ');

  return React.createElement(
    component,
    { className: classes, ...props },
    children
  );
}; 