import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  prefix?: string;
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  size = 'md',
  fullWidth = false,
  prefix,
  suffix,
  className = '',
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-base h-10', 
    lg: 'px-6 py-3 text-lg h-12'
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1 font-sakr">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:right-0 rtl:left-auto rtl:pr-3 rtl:pl-0">
            <span className="text-gray-600 font-sakr text-base">{prefix}</span>
          </div>
        )}
        <input
          ref={ref}
          className={`
            block w-full border border-gray-300 rounded-md shadow-sm 
            font-sakr transition-colors
            focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${prefix ? 'pl-14 rtl:pr-14 rtl:pl-4' : ''}
            ${suffix ? 'pr-10 rtl:pl-10 rtl:pr-4' : ''}
            ${sizeClasses[size]}
          `.trim()}
          {...props}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 font-sakr">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 font-sakr">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input'; 