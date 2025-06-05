import React from 'react';
import { Typography as MUITypography, TypographyProps as MUITypographyProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export type TypographyVariant = 
  | 'display-large' | 'display-medium' | 'display-small'
  | 'headline-large' | 'headline-medium' | 'headline-small'
  | 'title-large' | 'title-medium' | 'title-small'
  | 'body-large' | 'body-medium' | 'body-small' | 'body-xs' | 'body-2xs' | 'body-3xs'
  | 'label-large' | 'label-medium' | 'label-small'
  | 'overline';

export type ColorVariant = 'primary' | 'on-surface' | 'on-surface-variant' | 'on-surface-muted' | 'error' | 'success' | 'warning';

export interface TypographyProps {
  children: React.ReactNode;
  variant?: TypographyVariant;
  color?: ColorVariant;
  className?: string;
  component?: React.ElementType;
  align?: 'left' | 'center' | 'right' | 'justify';
  noWrap?: boolean;
  gutterBottom?: boolean;
}

// Mapping from custom variants to MUI variants
const getMUIVariant = (variant: TypographyVariant): MUITypographyProps['variant'] => {
  switch (variant) {
    case 'display-large':
      return 'h1';
    case 'display-medium':
      return 'h2';
    case 'display-small':
      return 'h3';
    case 'headline-large':
      return 'h4';
    case 'headline-medium':
      return 'h5';
    case 'headline-small':
      return 'h6';
    case 'title-large':
      return 'subtitle1';
    case 'title-medium':
    case 'title-small':
      return 'subtitle2';
    case 'body-large':
      return 'body1';
    case 'body-medium':
    case 'body-small':
    case 'body-xs':
    case 'body-2xs':
    case 'body-3xs':
      return 'body2';
    case 'label-large':
    case 'label-medium':
    case 'label-small':
      return 'button';
    case 'overline':
      return 'overline';
    default:
      return 'body1';
  }
};

// Custom styled Typography to handle our specific variants and colors
const StyledTypography = styled(MUITypography)<{ 
  customVariant: TypographyVariant; 
  customColor: ColorVariant;
}>(({ theme, customVariant, customColor }) => {
  // Define custom font sizes and styles for variants not perfectly mapped by MUI
  const getCustomStyles = () => {
    switch (customVariant) {
      case 'title-small':
        return {
          fontSize: '0.875rem',
          fontWeight: 500,
          lineHeight: 1.4,
        };
      case 'body-xs':
        return {
          fontSize: '0.8125rem',
          fontWeight: 400,
          lineHeight: 1.4,
        };
      case 'body-2xs':
        return {
          fontSize: '0.75rem',
          fontWeight: 400,
          lineHeight: 1.3,
        };
      case 'body-3xs':
        return {
          fontSize: '0.6875rem',
          fontWeight: 400,
          lineHeight: 1.3,
        };
      case 'label-large':
        return {
          fontSize: '1rem',
          fontWeight: 500,
          lineHeight: 1.4,
        };
      case 'label-small':
        return {
          fontSize: '0.75rem',
          fontWeight: 500,
          lineHeight: 1.3,
        };
      default:
        return {};
    }
  };

  // Define color mapping
  const getColor = () => {
    switch (customColor) {
      case 'primary':
        return theme.palette.primary.main;
      case 'on-surface':
        return theme.palette.text.primary;
      case 'on-surface-variant':
        return theme.palette.text.secondary;
      case 'on-surface-muted':
        return theme.palette.text.disabled;
      case 'error':
        return theme.palette.error.main;
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      default:
        return theme.palette.text.primary;
    }
  };

  return {
    color: getColor(),
    ...getCustomStyles(),
  };
});

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body-medium',
  color = 'on-surface',
  className,
  component,
  align,
  noWrap = false,
  gutterBottom = false,
}) => {
  return (
    <StyledTypography
      variant={getMUIVariant(variant)}
      customVariant={variant}
      customColor={color}
      className={className}
      {...(component && { component })}
      align={align}
      noWrap={noWrap}
      gutterBottom={gutterBottom}
    >
      {children}
    </StyledTypography>
  );
};

export default Typography; 