// MUI-based Design System Components
// Maintains same API as original design system but uses Material-UI underneath

// ===== MUI PRIMITIVES =====
export { default as Button } from '../primitives/mui/Button';
export type { ButtonProps } from '../primitives/mui/Button';

export { default as Input } from '../primitives/mui/Input';
export type { InputProps } from '../primitives/mui/Input';

export { default as Typography } from '../primitives/mui/Typography';
export type { TypographyProps, TypographyVariant, ColorVariant } from '../primitives/mui/Typography';

export { default as Alert } from '../primitives/mui/Alert';
export type { AlertProps } from '../primitives/mui/Alert';

export { default as Checkbox } from '../primitives/mui/Checkbox';
export type { CheckboxProps } from '../primitives/mui/Checkbox';

export { default as Loader } from '../primitives/mui/Loader';
export type { LoaderProps } from '../primitives/mui/Loader';

export { default as Icon } from '../primitives/mui/Icon';
export type { IconProps } from '../primitives/mui/Icon';

// ===== KEEP EXISTING COMPLEX COMPONENTS (For now) =====
// These will be migrated to MUI gradually

export { NumberInput } from '../primitives/NumberInput';
export type { NumberInputProps } from '../primitives/NumberInput';

export { default as Form, FormSection } from '../components/Form';
export type { FormProps, FormSectionProps } from '../components/Form';

export { Select } from '../components/Select';
export type { SelectProps, SelectOption } from '../components/Select';

export { Modal, ConfirmDialog } from '../components/Modal';
export type { ModalProps, ConfirmDialogProps } from '../components/Modal';

export { ToastProvider, useToast, useSuccessToast, useErrorToast, useWarningToast, useInfoToast } from '../components/Toast';
export type { ToastItem, ToastProviderProps } from '../components/Toast';

export { default as Accordion } from '../components/Accordion';
export type { AccordionProps } from '../components/Accordion';

// Application Components
export { default as OfficeConfigSection } from '../components/OfficeConfigSection';
export { default as BottomNavigation } from '../components/BottomNavigation';
export { default as Sidebar } from '../components/Sidebar';
export { default as DashboardLayout } from '../components/DashboardLayout';
export { default as CarFormSteps } from '../components/CarFormSteps';
export { default as OnboardingTour } from '../components/OnboardingTour';
export { default as PhoneInput } from '../primitives/mui/PhoneInput';
export { default as LanguageSwitcher } from '../components/LanguageSwitcher';

// Re-export commonly used types (keep same API)
export type ButtonVariant = 'elevated' | 'filled' | 'outlined' | 'text';
export type AlertVariant = 'info' | 'success' | 'warning' | 'error'; 