import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Create a class name builder with default classes
 */
export function createClassBuilder(baseClasses: string) {
  return (...inputs: ClassValue[]) => cn(baseClasses, ...inputs);
}

/**
 * Conditional class utility
 */
export function conditionalClass(
  condition: boolean,
  trueClass: string,
  falseClass?: string
): string {
  return condition ? trueClass : falseClass || '';
}

/**
 * Focus ring utility
 */
export function focusRing(className?: string) {
  return cn(
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    className
  );
}

/**
 * Disabled state utility
 */
export function disabledState(className?: string) {
  return cn('disabled:opacity-50 disabled:pointer-events-none', className);
} 