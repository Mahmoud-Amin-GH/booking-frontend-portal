// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock i18next
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

// Mock web-design-system components
jest.mock('@mo_sami/web-design-system', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Input: ({ label, ...props }: any) => (
    <div>
      <label>{label}</label>
      <input {...props} />
    </div>
  ),
  Modal: ({ children, title, ...props }: any) => (
    <div role="dialog" {...props}>
      <h2>{title}</h2>
      {children}
    </div>
  ),
  ModalFooter: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Alert: ({ children, ...props }: any) => <div role="alert" {...props}>{children}</div>,
  Select: ({ label, children, ...props }: any) => (
    <div>
      <label>{label}</label>
      <select {...props}>{children}</select>
    </div>
  ),
  DatePicker: ({ label, ...props }: any) => (
    <div>
      <label>{label}</label>
      <input type="date" {...props} />
    </div>
  ),
})); 