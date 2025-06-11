// Compatibility layer for migrating from custom design system to 4Sale DS
// These wrappers maintain the old API while using 4Sale components internally

export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Alert } from './Alert';
export type { AlertProps } from './Alert';

export { LanguageSwitcher } from './LanguageSwitcher';
export type { LanguageSwitcherProps } from './LanguageSwitcher';

export { Icon } from './Icon';
export type { IconProps } from './Icon';

export { NumberInput } from './NumberInput';
export type { NumberInputProps } from './NumberInput';

export { Modal } from './Modal';
export type { ModalProps } from './Modal';

export { Select } from './Select';
export type { SelectProps, SelectOption } from './Select';

export { Progress } from './Progress';
export type { ProgressProps } from './Progress';

export { Accordion } from './Accordion';
export type { AccordionProps } from './Accordion';

// Toast utilities
export { useSuccessToast, useErrorToast, useInfoToast, useWarningToast } from './toast'; 