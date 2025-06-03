import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => (
  <label className="inline-flex items-center space-x-2">
    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" {...props} />
    {label && <span className="text-sm text-gray-700">{label}</span>}
  </label>
);

export default Checkbox; 