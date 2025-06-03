// Material Design 3 Design System Components
export { default as Button } from './Button';
export type { ButtonProps } from './Button';

export { default as Input } from './Input';
export type { InputProps } from './Input';

export { default as Typography } from './Typography';
export type { TypographyProps } from './Typography';

export { default as Alert } from './Alert';
export type { AlertProps } from './Alert';

export { default as Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

export { default as Loader } from './Loader';
export type { LoaderProps } from './Loader';

export { default as Form, FormSection } from './Form';
export type { FormProps, FormSectionProps } from './Form';

export { default as Icon } from './Icon';
export type { IconProps } from './Icon';

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

// New Components
export { Select } from './Select';
export { Modal, ConfirmDialog } from './Modal';
export { ToastProvider, useToast, useSuccessToast, useErrorToast, useWarningToast, useInfoToast } from './Toast';
export { NumberInput } from './NumberInput';

// Types
export type { SelectProps, SelectOption } from './Select';
export type { ModalProps, ConfirmDialogProps } from './Modal';
export type { ToastItem, ToastProviderProps } from './Toast';
export type { NumberInputProps } from './NumberInput'; 