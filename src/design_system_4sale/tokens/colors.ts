export const colors = {
  // Primary Brand Colors (4Sale) - Blue based
  primary: {
    25: '#f5faff',
    50: '#eff8ff',
    100: '#d1e9ff',
    200: '#b2ddff',
    300: '#84caff',
    400: '#53b1fd',
    500: '#1D8EFF', // Main primary from Figma
    600: '#1570ef',
    700: '#175cd3',
    800: '#1849a9',
    900: '#194185',
    950: '#102a56'
  },
  
  // Secondary Colors (Q8car) - Teal based
  secondary: {
    25: '#f0fdfa',
    50: '#ccfbf1',
    100: '#99f6e4',
    200: '#5eead4',
    300: '#2dd4bf',
    400: '#14b8a6',
    500: '#0C86AE', // Q8car primary from Figma
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    950: '#083344'
  },

  // Semantic Colors
  success: {
    25: '#f6fef9',
    50: '#ecfdf3',
    100: '#d1fadf',
    200: '#a6f4c5',
    300: '#6ce9a6',
    400: '#32d583',
    500: '#10B981', // Success color from Figma
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22'
  },

  warning: {
    25: '#fffcf5',
    50: '#fffaeb',
    100: '#fef0c7',
    200: '#fedf89',
    300: '#fec84b',
    400: '#fdb022',
    500: '#FFC107', // Warning/Secondary color from Figma
    600: '#dc6803',
    700: '#b54708',
    800: '#93370d',
    900: '#7a2e0e',
    950: '#4e1d09'
  },

  error: {
    25: '#fffbfa',
    50: '#fef3f2',
    100: '#fee4e2',
    200: '#fecdca',
    300: '#fda29b',
    400: '#f97066',
    500: '#E53D3D', // Error color from Figma
    600: '#d92d20',
    700: '#b42318',
    800: '#912018',
    900: '#7a271a',
    950: '#55160c'
  },

  info: {
    25: '#f5faff',
    50: '#eff8ff',
    100: '#d1e9ff',
    200: '#b2ddff',
    300: '#84caff',
    400: '#53b1fd',
    500: '#2e90fa',
    600: '#1570ef',
    700: '#175cd3',
    800: '#1849a9',
    900: '#194185',
    950: '#102a56'
  },

  // Energy/Orange Colors from Figma
  energy: {
    25: '#fffcf5',
    50: '#fffaeb',
    100: '#fef0c7',
    200: '#fedf89',
    300: '#fec84b',
    400: '#fdb022',
    500: '#FB8C00', // Energy/Orange color from Figma
    600: '#dc6803',
    700: '#b54708',
    800: '#93370d',
    900: '#7a2e0e',
    950: '#4e1d09'
  },

  // Neutral/Gray Scale from Figma
  neutral: {
    25: '#fcfcfd',
    50: '#f5f6f7', // Main BG from Figma
    100: '#EBEDF0', // Divider Color, Secondary Button from Figma
    200: '#DCDFE3', // Web Stroke Color, Placeholder img from Figma
    300: '#d0d5dd',
    400: '#A6AEBB', // Placeholder text from Figma
    500: '#667085',
    600: '#6B788E', // Secondary text from Figma
    700: '#344054',
    800: '#1d2939',
    900: '#092B4C', // Main Text from Figma
    950: '#0c111d'
  },

  // Special Colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  current: 'currentColor',

  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#f5f6f7', // Using Figma's main BG
    tertiary: '#f2f4f7',
    overlay: 'rgba(9, 43, 76, 0.7)', // Using Figma's main text color for overlay
    disabled: '#f5f6f7'
  },

  // Border Colors
  border: {
    primary: '#DCDFE3', // Using Figma's web stroke color
    secondary: '#EBEDF0', // Using Figma's divider color
    tertiary: '#f2f4f7',
    error: '#fecdca',
    disabled: '#EBEDF0'
  },

  // Text Colors
  text: {
    primary: '#092B4C', // Main Text from Figma
    secondary: '#344054',
    tertiary: '#475467',
    quaternary: '#6B788E', // Secondary text from Figma
    white: '#ffffff',
    disabled: '#A6AEBB', // Placeholder text from Figma
    placeholder: '#A6AEBB', // Placeholder text from Figma
    inverse: '#ffffff'
  }
} as const;

// Color utilities
export const getColorValue = (colorPath: string): string => {
  const keys = colorPath.split('.');
  let value: any = colors;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      throw new Error(`Color path "${colorPath}" not found`);
    }
  }
  
  return value;
};

// Color contrast utilities
export const getContrastColor = (backgroundColor: string): string => {
  // Simple contrast calculation - in production, use a proper color library
  const isLight = backgroundColor.includes('25') || backgroundColor.includes('50') || backgroundColor.includes('100');
  return isLight ? colors.text.primary : colors.text.white;
};

// Color opacity utilities
export const withOpacity = (color: string, opacity: number): string => {
  if (color.startsWith('#')) {
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return `${color}${alpha}`;
  }
  return `${color}${Math.round(opacity * 100)}`;
};

export type ColorToken = keyof typeof colors;
export type ColorShade = 25 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
export type SemanticColor = 'success' | 'warning' | 'error' | 'info' | 'energy';
export type NeutralShade = keyof typeof colors.neutral; 