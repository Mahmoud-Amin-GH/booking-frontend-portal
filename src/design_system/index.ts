// Material Design 3 Design System Components
import React from 'react';

// ===== PRIMITIVES =====
// Compatibility wrappers that maintain old API while using 4Sale DS internally
export { 
  Button, 
  Input, 
  Alert, 
  Icon, 
  NumberInput, 
  Modal, 
  Select,
  Progress,
  Accordion,
  useSuccessToast,
  useErrorToast,
  useInfoToast,
  useWarningToast
} from './compatibility';
export type { 
  ButtonProps, 
  InputProps, 
  AlertProps, 
  LanguageSwitcherProps, 
  IconProps, 
  NumberInputProps, 
  ModalProps, 
  SelectProps, 
  SelectOption,
  ProgressProps,
  AccordionProps
} from './compatibility';

// Simple Typography wrapper for backward compatibility
export { default as Typography } from './primitives/TypographySimple';
export type { TypographyProps } from './primitives/TypographySimple';

// Direct 4Sale DS components
// export { Accordion } from '../design_system_4sale';
// Progress now comes from compatibility layer above

// Temporarily commented out MUI-dependent components
// export { default as Checkbox } from './primitives/Checkbox';
// export type { CheckboxProps } from './primitives/Checkbox';

// export { default as Loader } from './primitives/Loader';
// export type { LoaderProps } from './primitives/Loader';

// Icon now comes from compatibility layer above

// export { NumberInput } from './primitives/NumberInput';
// export type { NumberInputProps } from './primitives/NumberInput';

// Application Components - Enabling required components for dashboard
// export { default as OfficeConfigSection } from './components/OfficeConfigSection';
export { default as BottomNavigation } from './components/BottomNavigation';
// export { default as Sidebar } from './components/Sidebar';
export { default as DashboardLayout } from './components/DashboardLayout';
export { default as LanguageSwitcher } from './components/LanguageSwitcher';

// Pricing Table Components - Temporarily commented out during migration
// export { PricingTable } from './components/PricingTable';
// export { StatusTags } from './components/StatusTags';
// export { CarImageCell } from './components/CarImageCell';
// export { ActionsDropdown } from './components/ActionsDropdown';

// Re-export commonly used types
export type TypographyVariant = 
  | 'display-large' | 'display-medium' | 'display-small'
  | 'headline-large' | 'headline-medium' | 'headline-small'
  | 'title-large' | 'title-medium' | 'title-small'
  | 'body-large' | 'body-medium' | 'body-small' | 'body-xs' | 'body-2xs' | 'body-3xs'
  | 'label-large' | 'label-medium' | 'label-small'
  | 'overline';

export type ButtonVariant = 'elevated' | 'filled' | 'outlined' | 'text';
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
export type ColorVariant = 'primary' | 'on-surface' | 'on-surface-variant' | 'on-surface-muted' | 'error' | 'success' | 'warning';

// ===== SPACING SYSTEM =====
export { 
  spacing, 
  componentSpacing, 
  responsiveSpacing, 
  spacingUtils, 
  spacingPresets,
  BASE_SPACING 
} from './spacing';
export type { SpacingKey, ComponentSpacingKey, ResponsiveSpacingKey } from './spacing'; 