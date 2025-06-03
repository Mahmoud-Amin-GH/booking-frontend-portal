import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  ...props
}) => {
  const base =
    'px-4 py-2 rounded font-semibold focus:outline-none transition-colors disabled:opacity-50';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };
  return (
    <button
      className={`${base} ${variants[variant]}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <span className="loader mr-2" /> : null}
      {children}
    </button>
  );
};

export default Button; 