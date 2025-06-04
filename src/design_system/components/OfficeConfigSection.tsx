import React from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Typography } from '../index';
import { useLanguage } from '../../contexts/LanguageContext';

interface ConfigOption {
  key: string;
  labelKey: string;
  descriptionKey?: string;
  enabled: boolean;
}

interface OfficeConfigSectionProps {
  title: string;
  description: string;
  options: ConfigOption[];
  onOptionChange: (optionKey: string, enabled: boolean) => void;
  className?: string;
}

const OfficeConfigSection: React.FC<OfficeConfigSectionProps> = ({
  title,
  description,
  options,
  onOptionChange,
  className = '',
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Section Header */}
      <div className={`mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Typography 
          variant="title-medium" 
          color="on-surface" 
          className="font-medium mb-2"
        >
          {title}
        </Typography>
        <Typography 
          variant="body-medium" 
          color="on-surface-variant"
        >
          {description}
        </Typography>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <div 
            key={option.key}
            className="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant hover:border-outline transition-colors"
          >
            <Checkbox
              label={t(option.labelKey)}
              description={option.descriptionKey ? t(option.descriptionKey) : undefined}
              checked={option.enabled}
              onChange={(e) => onOptionChange(option.key, e.target.checked)}
              className={isRTL ? 'text-right' : 'text-left'}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfficeConfigSection; 