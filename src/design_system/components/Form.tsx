import React from 'react';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  spacing?: 'compact' | 'comfortable' | 'spacious';
  variant?: 'standard' | 'elevated';
}

const Form: React.FC<FormProps> = ({ 
  children, 
  spacing = 'comfortable',
  variant = 'standard',
  className = '',
  ...props 
}) => {
  // Spacing variants
  const spacingStyles = {
    compact: 'space-y-3',
    comfortable: 'space-y-4',
    spacious: 'space-y-6',
  };

  // Variant styles
  const variantStyles = {
    standard: '',
    elevated: 'p-6 bg-surface-container-low rounded-lg shadow-elevation-1',
  };

  const combinedClassName = `
    ${spacingStyles[spacing]}
    ${variantStyles[variant]}
    ${className}
  `.trim();

  return (
    <form {...props} className={combinedClassName}>
      {children}
    </form>
  );
};

// Form Section Component for grouping related fields
export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-title-large text-on-surface">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-body-2xs text-on-surface-variant">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default Form; 