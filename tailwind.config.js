/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['SS Sakr Soft', 'Inter', 'system-ui', 'sans-serif'],
    },
    extend: {
      // Material Design 3 Color System (extracted from Figma)
      colors: {
        // Primary colors
        primary: {
          50: '#E3F2FD',
          100: '#BBDEFB', 
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#1D8EFF', // Main primary from Figma
          600: '#0062FF', // Primary variant from Figma
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
          950: '#092B4C', // Dark primary from Figma
        },
        
        // Surface colors
        surface: {
          'dim': '#131825', // Dark surface from Figma
          'bright': '#FFFFFF', // White from Figma
          'container-lowest': '#F5F6F7', // Light gray from Figma
          'container-low': '#F7F8FA', // Container background from Figma
          'container': '#DCDFE3', // Divider color from Figma
          'container-high': '#262A36', // Medium dark from Figma
          'container-highest': '#2F343F', // Dark container from Figma
        },
        
        // On-surface colors
        'on-surface': {
          DEFAULT: '#021442', // Main text from Figma
          variant: '#6B788E', // Secondary text from Figma
          muted: '#5F626B', // Muted text from Figma
        },
        
        // Success/Error colors
        success: '#09BA50', // Success green from Figma
        error: '#DC3545',
        warning: '#FF9800',
        
        // Outline colors
        outline: {
          DEFAULT: '#DCDFE3', // Divider from Figma
          variant: '#6B788E',
        },
      },
      
      // Material Design 3 Typography Scale (extracted from Figma)
      fontSize: {
        // Display sizes
        'display-large': ['48px', { lineHeight: '56px', letterSpacing: '-0.48px', fontWeight: '700' }],
        'display-medium': ['36px', { lineHeight: '44px', letterSpacing: '-0.32px', fontWeight: '700' }],
        'display-small': ['30px', { lineHeight: '40px', letterSpacing: '-0.24px', fontWeight: '700' }],
        
        // Headline sizes
        'headline-large': ['24px', { lineHeight: '32px', letterSpacing: '-0.16px', fontWeight: '700' }],
        'headline-medium': ['20px', { lineHeight: '28px', letterSpacing: '-0.08px', fontWeight: '700' }],
        'headline-small': ['18px', { lineHeight: '26px', letterSpacing: '-0.08px', fontWeight: '700' }],
        
        // Title sizes
        'title-large': ['16px', { lineHeight: '24px', letterSpacing: '0px', fontWeight: '700' }],
        'title-medium': ['14px', { lineHeight: '20px', letterSpacing: '0px', fontWeight: '700' }],
        'title-small': ['12px', { lineHeight: '16px', letterSpacing: '0px', fontWeight: '700' }],
        
        // Body sizes
        'body-large': ['24px', { lineHeight: '32px', letterSpacing: '0px', fontWeight: '400' }],
        'body-medium': ['20px', { lineHeight: '28px', letterSpacing: '0px', fontWeight: '400' }],
        'body-small': ['18px', { lineHeight: '26px', letterSpacing: '0px', fontWeight: '400' }],
        'body-xs': ['16px', { lineHeight: '24px', letterSpacing: '0px', fontWeight: '400' }],
        'body-2xs': ['14px', { lineHeight: '20px', letterSpacing: '0px', fontWeight: '400' }],
        'body-3xs': ['12px', { lineHeight: '16px', letterSpacing: '0px', fontWeight: '400' }],
        
        // Label sizes (Medium weight variants)
        'label-large': ['16px', { lineHeight: '24px', letterSpacing: '0px', fontWeight: '500' }],
        'label-medium': ['14px', { lineHeight: '20px', letterSpacing: '0px', fontWeight: '500' }],
        'label-small': ['12px', { lineHeight: '16px', letterSpacing: '0px', fontWeight: '500' }],
        
        // Overline
        'overline': ['10px', { lineHeight: '14px', letterSpacing: '0px', fontWeight: '500' }],
      },
      
      // Material Design 3 Elevation/Shadows
      boxShadow: {
        'elevation-1': '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        'elevation-2': '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        'elevation-3': '0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
        'elevation-4': '0px 2px 3px 0px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)',
        'elevation-5': '0px 4px 4px 0px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
      },
      
      // Border radius scale
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
      },
      
      // Spacing scale (Material Design 3)
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
      },
      
      // Direction support
      direction: {
        'rtl': 'rtl',
        'ltr': 'ltr',
      },
      
      // Animation and transitions
      transitionDuration: {
        '250': '250ms',
        '300': '300ms',
      },
      
      // State layers opacity
      opacity: {
        '8': '0.08',  // Hover state
        '12': '0.12', // Focus state
        '16': '0.16', // Pressed state
        '38': '0.38', // Disabled state
      },
    },
  },
  plugins: [],
}

