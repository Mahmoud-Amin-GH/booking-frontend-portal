import React from 'react';
import ReactDatePicker from 'react-datepicker';
import type { DatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CustomDatePickerProps {
  fullWidth?: boolean;
  label?: string;
  className?: string;
  selected?: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  placeholderText?: string;
  disabled?: boolean;
}

export const DatePicker: React.FC<CustomDatePickerProps> = ({
  fullWidth = false,
  label,
  className,
  ...props
}) => {
  return (
    <div 
      className={`${fullWidth ? 'w-full' : 'w-auto'} ${className || ''}`}
      style={{
        '--outline': 'var(--outline, #e2e8f0)',
        '--primary': 'var(--primary, #3b82f6)',
        '--primary-rgb': 'var(--primary-rgb, 59, 130, 246)',
      } as React.CSSProperties}
    >
      {label && (
        <label className="block mb-2 font-medium text-sm">
          {label}
        </label>
      )}
      <div className="w-full">
        <ReactDatePicker
          {...props}
          className="w-full px-3 py-2 border border-[var(--outline)] rounded-md text-base focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-20 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
};

DatePicker.displayName = 'DatePicker';

export default DatePicker; 