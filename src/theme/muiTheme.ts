import { createTheme, ThemeOptions } from '@mui/material/styles';
import { useLanguage } from '../contexts/LanguageContext';

// Custom color palette matching your existing design system
const colorPalette = {
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3', // Main primary
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
  surface: {
    main: '#ffffff',
    container: '#f5f5f5',
    containerLow: '#fafafa',
    bright: '#ffffff',
  },
  outline: {
    main: '#e0e0e0',
    variant: '#bdbdbd',
  },
  error: {
    main: '#f44336',
    light: '#ffebee',
  },
  success: {
    main: '#4caf50',
    light: '#e8f5e8',
  },
  warning: {
    main: '#ff9800',
    light: '#fff3e0',
  },
  info: {
    main: '#2196f3',
    light: '#e3f2fd',
  },
};

// Create MUI theme with RTL support
export const createMUITheme = (isRTL: boolean): ThemeOptions => ({
  direction: isRTL ? 'rtl' : 'ltr',
  palette: {
    primary: {
      main: colorPalette.primary[600],
      light: colorPalette.primary[300],
      dark: colorPalette.primary[800],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colorPalette.surface.container,
      light: colorPalette.surface.containerLow,
      dark: colorPalette.outline.variant,
      contrastText: '#000000',
    },
    error: {
      main: colorPalette.error.main,
      light: colorPalette.error.light,
    },
    success: {
      main: colorPalette.success.main,
      light: colorPalette.success.light,
    },
    warning: {
      main: colorPalette.warning.main,
      light: colorPalette.warning.light,
    },
    info: {
      main: colorPalette.info.main,
      light: colorPalette.info.light,
    },
    background: {
      default: '#ffffff',
      paper: colorPalette.surface.main,
    },
    text: {
      primary: '#000000',
      secondary: '#757575',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    divider: colorPalette.outline.main,
  },
  typography: {
    fontFamily: isRTL 
      ? '"Cairo", "Roboto", "Helvetica", "Arial", sans-serif'
      : '"Roboto", "Helvetica", "Arial", sans-serif',
    // Map your existing typography scale to MUI
    h1: {
      fontSize: '3.5rem', // display-large
      fontWeight: 400,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.875rem', // display-medium
      fontWeight: 400,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '2.25rem', // display-small
      fontWeight: 400,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '2rem', // headline-large
      fontWeight: 400,
      lineHeight: 1.3,
    },
    h5: {
      fontSize: '1.5rem', // headline-medium
      fontWeight: 400,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.25rem', // headline-small
      fontWeight: 500,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1.125rem', // title-large
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '1rem', // title-medium
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem', // body-large
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem', // body-medium
      fontWeight: 400,
      lineHeight: 1.4,
    },
    button: {
      fontSize: '0.875rem', // label-medium
      fontWeight: 500,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem', // body-small
      fontWeight: 400,
      lineHeight: 1.3,
    },
    overline: {
      fontSize: '0.625rem', // overline
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      lineHeight: 1.2,
    },
  },
  shape: {
    borderRadius: 12, // Matching your rounded-xl
  },
  spacing: 8, // 8px base unit
  components: {
    // Customize MUI Button to match your existing design
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 500,
          transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:focus': {
            outline: '2px solid',
            outlineOffset: '2px',
          },
        },
        sizeLarge: {
          height: 48,
          minWidth: 96,
          padding: '0 24px',
        },
        sizeMedium: {
          height: 40,
          minWidth: 80,
          padding: '0 16px',
        },
        sizeSmall: {
          height: 32,
          minWidth: 64,
          padding: '0 12px',
        },
      },
    },
    // Customize MUI TextField to match your existing design
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4, // rounded-xs equivalent
            transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#757575',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: '2px',
              borderColor: colorPalette.primary[600],
            },
          },
        },
      },
    },
    // Customize other components as needed
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        },
      },
    },
  },
});

// Hook to use the theme with current language context
export const useMUITheme = () => {
  const { isRTL } = useLanguage();
  return createTheme(createMUITheme(isRTL));
}; 