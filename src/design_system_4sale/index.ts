// 4Sale Design System Simulation
// This simulates what @4saletech/web-design-system would provide

// Core primitives (simulated 4Sale DS components)
export { Button } from './primitives/Button';
export { Input } from './primitives/Input';
export { Typography } from './primitives/Typography';
export { Alert } from './primitives/Alert';
export { Checkbox } from './primitives/Checkbox';
export { Progress } from './primitives/Progress';
export { Select } from './primitives/Select';
export { Switch } from './primitives/Switch';
export { Textarea } from './primitives/Textarea';
export { Badge } from './primitives/Badge';
export { Card } from './primitives/Card';

// Complex components
export { Modal } from './components/Modal';
export { Accordion } from './components/Accordion';
export { Tabs } from './components/Tabs';
export { Tooltip } from './components/Tooltip';
export { DropdownMenu } from './components/DropdownMenu';
export { Navigation } from './components/Navigation';
export { Breadcrumbs } from './components/Breadcrumbs';
export { Pagination } from './components/Pagination';
export { Toast } from './components/Toast';

// Utility hooks and functions
export { cn } from './utils/cn';
export { useToast } from './utils/useToast';

// Theme configuration
export * from './theme';

// Types
export type { ButtonProps } from './primitives/Button';
export type { InputProps } from './primitives/Input';
export type { TypographyProps } from './primitives/Typography';
export type { AlertProps } from './primitives/Alert';
export type { CheckboxProps } from './primitives/Checkbox';
export type { ProgressProps } from './primitives/Progress';
export type { SelectProps } from './primitives/Select';
export type { CardProps } from './primitives/Card';
export type { ModalProps } from './components/Modal';
export type { AccordionProps } from './components/Accordion';
export type { TabsProps, TabItem } from './components/Tabs';

// Export Kuwait governorates for convenience
export { kuwaitGovernorates } from './primitives/Select'; 