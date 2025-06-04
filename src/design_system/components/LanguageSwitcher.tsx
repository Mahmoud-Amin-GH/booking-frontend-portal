import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button, Typography } from '../index';

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
      <Typography variant="label-small" className="font-medium">
        {language === 'en' ? 'العربية' : 'English'}
      </Typography>
    </Button>
  );
};

export default LanguageSwitcher; 