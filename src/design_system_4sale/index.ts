// 4Sale Design System Simulation
// This simulates what @4saletech/web-design-system would provide

// Core primitives (simulated 4Sale DS components)
export { Button } from './primitives/Button';
export { Input } from './primitives/Input';
export { Typography } from './primitives/Typography';
export { Card } from './primitives/Card';
export { Badge } from './primitives/Badge';
export { Alert } from './primitives/Alert';
export { Checkbox } from './primitives/Checkbox';
export { Switch } from './primitives/Switch';
export { Select } from './primitives/Select';
export { Textarea } from './primitives/Textarea';
export { Progress } from './primitives/Progress';

// Complex components
export { Modal } from './components/Modal';
export { Accordion } from './components/Accordion';
export { Tabs } from './components/Tabs';
export { Navigation } from './components/Navigation';
export { Toast } from './components/Toast';
export { Tooltip } from './components/Tooltip';
export { DropdownMenu } from './components/DropdownMenu';
export { Pagination } from './components/Pagination';
export { Breadcrumbs } from './components/Breadcrumbs';

// Utility hooks and functions
export { useToast } from './utils/useToast';
export { cn } from './utils/cn';

// Theme configuration
export * as theme from './theme';

// Types
export type { ButtonProps } from './primitives/Button';
export type { InputProps } from './primitives/Input';
export type { TypographyProps } from './primitives/Typography';
export type { CardProps } from './primitives/Card';
export type { BadgeProps } from './primitives/Badge';
export type { AlertProps } from './primitives/Alert';
export type { CheckboxProps } from './primitives/Checkbox';
export type { ProgressProps } from './primitives/Progress';
export type { SelectProps, SelectOption } from './primitives/Select';

// Export Kuwait governorates for convenience
export { kuwaitGovernorates } from './primitives/Select'; 