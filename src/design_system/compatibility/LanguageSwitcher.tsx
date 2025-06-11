import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '' 
}) => {
  const { language, switchLanguage } = useLanguage();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1 text-sm rounded ${
          language === 'en' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground hover:bg-accent'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage('ar')}
        className={`px-3 py-1 text-sm rounded ${
          language === 'ar' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground hover:bg-accent'
        }`}
      >
        العربية
      </button>
    </div>
  );
}; 