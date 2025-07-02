import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../contexts/LanguageContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

const render = (ui: React.ReactElement, options = {}) =>
  rtlRender(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { render }; 