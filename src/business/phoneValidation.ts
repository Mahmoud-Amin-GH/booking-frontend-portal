/**
 * Business Logic Layer for Kuwaiti Phone Number Validation and Formatting
 * 
 * This module provides standardized phone number validation and formatting
 * for the entire application to ensure consistency across all components.
 */

/**
 * @deprecated This interface is part of the old, stricter phone validation and is no longer needed.
 */
export interface PhoneValidationResult {
  isValid: boolean;
  formatted: string;
  error?: string;
}

/**
 * Formats a phone number input to Kuwaiti format
 * This is used for display and user experience purposes in input fields.
 */
export const formatKuwaitiPhone = (input: string): string => {
  if (!input) return '';
  
  // Remove all non-digit characters
  const digits = input.replace(/\D/g, '');
  
  // If starts with 965, remove it (it will be added back by the input prefix)
  let phoneDigits = digits.startsWith('965') ? digits.substring(3) : digits;
  
  // Limit to 8 digits max
  phoneDigits = phoneDigits.substring(0, 8);
  
  // Format as XXXX XXXX
  if (phoneDigits.length > 4) {
    return `${phoneDigits.substring(0, 4)} ${phoneDigits.substring(4)}`;
  }
  
  return phoneDigits;
};


/**
 * Handle phone input change with automatic formatting
 * Use this in onChange handlers for phone input fields to improve UX.
 */
export const handlePhoneInputChange = (
  value: string,
  onChange: (formatted: string) => void
): void => {
  const formatted = formatKuwaitiPhone(value);
  onChange(formatted);
};
