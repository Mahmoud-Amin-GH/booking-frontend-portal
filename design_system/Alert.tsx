import React from 'react';

export interface AlertProps {
  type?: 'error' | 'success' | 'info';
  message: string;
}

const typeStyles = {
  error: 'bg-red-100 text-red-700 border-red-400',
  success: 'bg-green-100 text-green-700 border-green-400',
  info: 'bg-blue-100 text-blue-700 border-blue-400',
};

const Alert: React.FC<AlertProps> = ({ type = 'info', message }) => (
  <div className={`border-l-4 p-3 mb-2 rounded ${typeStyles[type]}`}>{message}</div>
);

export default Alert; 