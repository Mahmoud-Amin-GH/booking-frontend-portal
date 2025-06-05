import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Paper } from '@mui/material';
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} className={className}>
      {/* Section Header */}
      <Box sx={{ textAlign: isRTL ? 'right' : 'left' }}>
        <Typography 
          variant="title-medium" 
          color="on-surface" 
          sx={{ fontWeight: 'medium', mb: 1 }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body-medium" 
          color="on-surface-variant"
        >
          {description}
        </Typography>
      </Box>

      {/* Options Grid */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2
        }}
      >
        {options.map((option) => (
          <Paper
            key={option.key}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              transition: 'border-color 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'text.secondary',
              },
            }}
          >
            <Checkbox
              label={t(option.labelKey)}
              description={option.descriptionKey ? t(option.descriptionKey) : undefined}
              checked={option.enabled}
              onChange={(e) => onOptionChange(option.key, e.target.checked)}
              sx={{ textAlign: isRTL ? 'right' : 'left' }}
            />
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default OfficeConfigSection; 