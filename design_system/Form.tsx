import React from 'react';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ children, ...props }) => {
  return (
    <form {...props} className={`space-y-4 ${props.className || ''}`}>
      {children}
    </form>
  );
};

export default Form; 