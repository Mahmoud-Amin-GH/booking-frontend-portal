import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@mo_sami/web-design-system';

const LanguageSwitcher: React.FC = () => {
  const { language, switchLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    switchLanguage(newLang);
  };

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={toggleLanguage}
      className="gap-2"
    >
      <span className="text-base">{language === 'en' ? '🇸🇦' : '🇺🇸'}</span>
      <span className="font-sakr font-medium text-sm">
        {language === 'en' ? 'العربية' : 'English'}
      </span>
    </Button>
  );
};

export default LanguageSwitcher; 