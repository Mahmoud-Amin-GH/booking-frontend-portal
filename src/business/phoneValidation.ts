/**
 * Business Logic Layer for Kuwaiti Phone Number Validation and Formatting
 * 
 * This module provides standardized phone number validation and formatting
 * for the entire application to ensure consistency across all components.
 */

export interface PhoneValidationResult {
  isValid: boolean;
  formatted: string;
  error?: string;
}

/**
 * Validates a Kuwaiti phone number
 * Expected format: +965 XXXX XXXX (with spaces and country code)
 */
export const validateKuwaitiPhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  // Remove all whitespace and special characters for validation
  const cleanPhone = phone.replace(/\s+/g, ' ').trim();
  
  // Check exact format: +965 XXXX XXXX
  const pattern = /^\+965\s\d{4}\s\d{4}$/;
  return pattern.test(cleanPhone);
};

/**
 * Formats a phone number input to Kuwaiti format
 * Handles various input formats and auto-formats to +965 XXXX XXXX
 */
export const formatKuwaitiPhone = (input: string): string => {
  if (!input) return '';
  
  // Remove all non-digit characters
  const digits = input.replace(/\D/g, '');
  
  // If starts with 965, remove it (will be added back)
  let phoneDigits = digits.startsWith('965') ? digits.substring(3) : digits;
  
  // Limit to 8 digits max
  phoneDigits = phoneDigits.substring(0, 8);
  
  // Format based on length
  if (phoneDigits.length <= 4) {
    return phoneDigits;
  } else if (phoneDigits.length <= 8) {
    return `${phoneDigits.substring(0, 4)} ${phoneDigits.substring(4)}`;
  }
  
  return `${phoneDigits.substring(0, 4)} ${phoneDigits.substring(4, 8)}`;
};

/**
 * Validates and formats a phone number input
 * Returns validation result with formatted phone number
 */
export const validateAndFormatPhone = (input: string, errorMessage?: string): PhoneValidationResult => {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      formatted: '',
      error: errorMessage || 'Phone number is required'
    };
  }
  
  const formatted = formatKuwaitiPhone(input);
  const isValid = validateKuwaitiPhone(formatted);
  
  return {
    isValid,
    formatted,
    error: isValid ? undefined : (errorMessage || 'Please enter a valid Kuwaiti phone number (+965 XXXX XXXX)')
  };
};

/**
 * Gets only the 8-digit phone number without country code
 * Useful for displaying clean phone numbers in forms
 */
export const getPhoneDigitsOnly = (phone: string): string => {
  if (!phone) return '';
  
  const digits = phone.replace(/\D/g, '');
  
  if (digits.startsWith('965')) {
    return digits.substring(3);
  }
  
  return digits;
};

/**
 * Checks if a phone number has the minimum required digits
 */
export const hasMinimumPhoneDigits = (phone: string): boolean => {
  const digits = getPhoneDigitsOnly(phone);
  return digits.length >= 8;
};

/**
 * Masks a phone number for display (e.g., +965 1234 *****)
 */
export const maskPhoneNumber = (phone: string): string => {
  if (!validateKuwaitiPhone(phone)) {
    return phone;
  }
  
  const digits = getPhoneDigitsOnly(phone);
  if (digits.length === 8) {
    return `+965 ${digits.substring(0, 4)} ****`;
  }
  
  return phone;
};

/**
 * Converts various phone formats to API-ready format
 * Always returns +965 XXXX XXXX format for backend consumption
 */
export const preparePhoneForAPI = (phone: string): string => {
  const result = validateAndFormatPhone(phone);
  return result.isValid ? result.formatted : phone;
};

/**
 * Handle phone input change with automatic formatting
 * Use this in onChange handlers for phone input fields
 */
export const handlePhoneInputChange = (
  value: string,
  onChange: (formatted: string) => void
): void => {
  const formatted = formatKuwaitiPhone(value);
  onChange(formatted);
}; 