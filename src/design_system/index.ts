// Material Design 3 Design System Components

// ===== PRIMITIVES =====
export { default as Button } from './primitives/Button';
export type { ButtonProps } from './primitives/Button';

export { default as Input } from './primitives/Input';
export type { InputProps } from './primitives/Input';

export { default as Typography } from './primitives/Typography';
export type { TypographyProps } from './primitives/Typography';

export { default as Alert } from './primitives/Alert';
export type { AlertProps } from './primitives/Alert';

export { default as Checkbox } from './primitives/Checkbox';
export type { CheckboxProps } from './primitives/Checkbox';

export { default as Loader } from './primitives/Loader';
export type { LoaderProps } from './primitives/Loader';

export { default as Icon } from './primitives/Icon';
export type { IconProps } from './primitives/Icon';

export { NumberInput } from './primitives/NumberInput';
export type { NumberInputProps } from './primitives/NumberInput';

// ===== COMPLEX COMPONENTS =====
export { default as Form, FormSection } from './components/Form';
export type { FormProps, FormSectionProps } from './components/Form';

export { Select } from './components/Select';
export type { SelectProps, SelectOption } from './components/Select';

export { Modal, ConfirmDialog } from './components/Modal';
export type { ModalProps, ConfirmDialogProps } from './components/Modal';

export { ToastProvider, useToast, useSuccessToast, useErrorToast, useWarningToast, useInfoToast } from './components/Toast';
export type { ToastItem, ToastProviderProps } from './components/Toast';

export { default as Accordion } from './components/Accordion';
export type { AccordionProps } from './components/Accordion';

// Application Components
export { default as OfficeConfigSection } from './components/OfficeConfigSection';
export { default as BottomNavigation } from './components/BottomNavigation';
export { default as Sidebar } from './components/Sidebar';
export { default as DashboardLayout } from './components/DashboardLayout';
export { default as CarFormSteps } from './components/CarFormSteps';
export { default as OnboardingTour } from './components/OnboardingTour';
export { default as PhoneInput } from './components/PhoneInput';
export { default as LanguageSwitcher } from './components/LanguageSwitcher';

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