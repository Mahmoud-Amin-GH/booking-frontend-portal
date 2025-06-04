import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Button, Icon } from '../design_system';
import { useLanguage } from '../contexts/LanguageContext';

const OfficeConfigs: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const plannedFeatures = [
    {
      category: 'Locations Supported',
      items: [
        'Hawalli District (منطقة حولي)',
        'Salmiya Area (منطقة السالمية)',
        'Farwaniya Region (منطقة الفروانية)',
        'Al Jahra Zone (منطقة الجهراء)',
      ],
    },
    {
      category: 'Service Options',
      items: [
        '24 Hours Service (خدمة 24 ساعة)',
        'Full Insurance (تأمين شامل)',
        'Road Services (خدمات الطريق)',
        'With a Driver (مع سائق)',
      ],
    },
    {
      category: 'Delivery Options',
      items: [
        'Airport Delivery (توصيل المطار)',
        'Home Delivery (توصيل منزلي)',
        'No Conditions (بدون شروط)',
        'Free Cancellation (إلغاء مجاني)',
      ],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
        <Typography variant="headline-medium" color="on-surface" className="font-bold mb-2">
          {t('dashboard.officeConfigs')}
        </Typography>
        <Typography variant="body-large" color="on-surface-variant">
          {t('dashboard.officeConfigsDesc')}
        </Typography>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
        <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Icon name="check" size="medium" className="text-primary-600" />
          <Typography variant="title-medium" color="primary" className="font-medium">
            Coming Soon
          </Typography>
        </div>
        <Typography variant="body-medium" color="on-surface" className={`${isRTL ? 'text-right' : 'text-left'}`}>
          This section will allow you to configure your office settings, service options, and delivery preferences 
          for the Kuwait market. All settings will be bilingual and fully customizable.
        </Typography>
      </div>

      {/* Planned Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plannedFeatures.map((feature, index) => (
          <div key={index} className="bg-surface rounded-lg border border-outline-variant p-6">
            <Typography 
              variant="title-small" 
              color="on-surface" 
              className={`font-medium mb-4 ${isRTL ? 'text-right' : 'text-left'}`}
            >
              {feature.category}
            </Typography>
            <div className="space-y-3">
              {feature.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex} 
                  className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-2 h-2 bg-outline rounded-full"></div>
                  <Typography variant="body-small" color="on-surface-variant">
                    {item}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Implementation Preview */}
      <div className={`bg-surface rounded-lg border border-outline-variant p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Typography variant="title-medium" color="on-surface" className="font-medium mb-4">
          Implementation Preview
        </Typography>
        <Typography variant="body-medium" color="on-surface-variant" className="mb-4">
          The office configurations will include:
        </Typography>
        <div className="space-y-2">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Icon name="check" size="small" className="text-green-600" />
            <Typography variant="body-small" color="on-surface">
              Collapsible categories with translated section titles
            </Typography>
          </div>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Icon name="check" size="small" className="text-green-600" />
            <Typography variant="body-small" color="on-surface">
              Checkbox toggles for Kuwait districts and service options
            </Typography>
          </div>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Icon name="check" size="small" className="text-green-600" />
            <Typography variant="body-small" color="on-surface">
              Bilingual labels and descriptions (English/Arabic)
            </Typography>
          </div>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Icon name="check" size="small" className="text-green-600" />
            <Typography variant="body-small" color="on-surface">
              RTL layout support for Arabic interface
            </Typography>
          </div>
        </div>
      </div>

      {/* Development Note */}
      <div className="bg-surface-variant rounded-lg p-6">
        <Typography 
          variant="body-small" 
          color="on-surface-variant" 
          className={`${isRTL ? 'text-right' : 'text-left'} italic`}
        >
          💡 Development Note: This page is ready for implementation with checkboxes, toggles, and 
          collapsible sections as specified in the project requirements. The backend will need 
          corresponding API endpoints for office configuration management.
        </Typography>
      </div>
    </div>
  );
};

export default OfficeConfigs; 