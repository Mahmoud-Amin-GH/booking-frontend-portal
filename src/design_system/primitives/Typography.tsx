import React from 'react';
import { Typography as MuiTypography, TypographyProps as MuiTypographyProps } from '@mui/material';

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
  sx?: any;
}

// Map custom variants to MUI variants
const variantToMuiVariant: Record<string, MuiTypographyProps['variant']> = {
  'display-large': 'h1',
  'display-medium': 'h2', 
  'display-small': 'h3',
  'headline-large': 'h4',
  'headline-medium': 'h5',
  'headline-small': 'h6',
  'title-large': 'subtitle1',
  'title-medium': 'subtitle2',
  'title-small': 'body1',
  'body-large': 'body1',
  'body-medium': 'body1',
  'body-small': 'body2',
  'body-xs': 'body2',
  'body-2xs': 'caption',
  'body-3xs': 'caption',
  'label-large': 'button',
  'label-medium': 'button',
  'label-small': 'caption',
  'overline': 'overline',
};

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

// Map custom colors to MUI theme colors
const colorToMuiColor = {
  primary: 'primary.main',
  'on-surface': 'text.primary',
  'on-surface-variant': 'text.secondary', 
  'on-surface-muted': 'text.disabled',
  error: 'error.main',
  success: 'success.main', 
  warning: 'warning.main',
};

// Custom size mapping for precise control
const getCustomSx = (variant: string) => {
  switch (variant) {
    case 'display-large':
      return { fontSize: '3rem', fontWeight: 700, lineHeight: 1.2 }; // 48px
    case 'display-medium':
      return { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.2 }; // 36px  
    case 'display-small':
      return { fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.2 }; // 30px
    case 'headline-large':
      return { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 }; // 24px
    case 'headline-medium':
      return { fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.3 }; // 20px
    case 'headline-small':
      return { fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.3 }; // 18px
    case 'title-large':
      return { fontSize: '1rem', fontWeight: 700, lineHeight: 1.4 }; // 16px
    case 'title-medium':
      return { fontSize: '0.875rem', fontWeight: 700, lineHeight: 1.4 }; // 14px
    case 'title-small':
      return { fontSize: '0.75rem', fontWeight: 700, lineHeight: 1.4 }; // 12px
    case 'body-large':
      return { fontSize: '1.5rem', fontWeight: 400, lineHeight: 1.5 }; // 24px
    case 'body-medium':
      return { fontSize: '1.25rem', fontWeight: 400, lineHeight: 1.5 }; // 20px
    case 'body-small':
      return { fontSize: '1.125rem', fontWeight: 400, lineHeight: 1.5 }; // 18px
    case 'body-xs':
      return { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 }; // 16px
    case 'body-2xs':
      return { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 }; // 14px
    case 'body-3xs':
      return { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.5 }; // 12px
    case 'label-large':
      return { fontSize: '1rem', fontWeight: 500, lineHeight: 1.4 }; // 16px
    case 'label-medium':
      return { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.4 }; // 14px
    case 'label-small':
      return { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.4 }; // 12px
    case 'overline':
      return { fontSize: '0.625rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.4 }; // 10px
    default:
      return {};
  }
};

const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body-xs', 
  component,
  color = 'on-surface',
  children, 
  className = '',
  gutterBottom,
  sx,
  ...props
}) => {
  const muiVariant = variantToMuiVariant[variant] || 'body2';
  const componentTag = component || variantToTagMap[variant] || 'p';
  const colorValue = colorToMuiColor[color];
  const customSx = getCustomSx(variant);

  return (
    <MuiTypography
      variant={muiVariant}
      component={componentTag}
      className={className}
      gutterBottom={gutterBottom}
      sx={{
        ...customSx,
        ...(colorValue && { color: colorValue }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiTypography>
  );
};

export default Typography; 