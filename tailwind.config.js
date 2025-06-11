/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@4saletech/web-design-system/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['SS Sakr Soft', 'Inter', 'system-ui', 'sans-serif'],
      sakrPro: ['SS Sakr Soft', 'Inter', 'system-ui', 'sans-serif'],
    },
    extend: {
      // CSS Variables for 4Sale Design System
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
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
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        
        // Surface colors for backward compatibility
        surface: {
          'dim': '#131825',
          'bright': '#FFFFFF',
          'container-lowest': '#F5F6F7',
          'container-low': '#F7F8FA',
          'container': '#DCDFE3',
          'container-high': '#262A36',
          'container-highest': '#2F343F',
        },
        
        // On-surface colors for backward compatibility
        'on-surface': {
          DEFAULT: '#021442',
          variant: '#6B788E',
          muted: '#5F626B',
        },
        
        // Outline colors for backward compatibility
        outline: {
          DEFAULT: '#DCDFE3',
          variant: '#6B788E',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // Material Design 3 border radius
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
      },
      
      // Typography scale
      fontSize: {
        'display-large': ['48px', { lineHeight: '56px', letterSpacing: '-0.48px', fontWeight: '700' }],
        'display-medium': ['36px', { lineHeight: '44px', letterSpacing: '-0.32px', fontWeight: '700' }],
        'display-small': ['30px', { lineHeight: '40px', letterSpacing: '-0.24px', fontWeight: '700' }],
        'headline-large': ['24px', { lineHeight: '32px', letterSpacing: '-0.16px', fontWeight: '700' }],
        'headline-medium': ['20px', { lineHeight: '28px', letterSpacing: '-0.08px', fontWeight: '700' }],
        'headline-small': ['18px', { lineHeight: '26px', letterSpacing: '-0.08px', fontWeight: '700' }],
        'title-large': ['16px', { lineHeight: '24px', letterSpacing: '0px', fontWeight: '700' }],
        'title-medium': ['14px', { lineHeight: '20px', letterSpacing: '0px', fontWeight: '700' }],
        'title-small': ['12px', { lineHeight: '16px', letterSpacing: '0px', fontWeight: '700' }],
        'body-large': ['24px', { lineHeight: '32px', letterSpacing: '0px', fontWeight: '400' }],
        'body-medium': ['20px', { lineHeight: '28px', letterSpacing: '0px', fontWeight: '400' }],
        'body-small': ['18px', { lineHeight: '26px', letterSpacing: '0px', fontWeight: '400' }],
        'body-xs': ['16px', { lineHeight: '24px', letterSpacing: '0px', fontWeight: '400' }],
        'body-2xs': ['14px', { lineHeight: '20px', letterSpacing: '0px', fontWeight: '400' }],
        'body-3xs': ['12px', { lineHeight: '16px', letterSpacing: '0px', fontWeight: '400' }],
        'label-large': ['16px', { lineHeight: '24px', letterSpacing: '0px', fontWeight: '500' }],
        'label-medium': ['14px', { lineHeight: '20px', letterSpacing: '0px', fontWeight: '500' }],
        'label-small': ['12px', { lineHeight: '16px', letterSpacing: '0px', fontWeight: '500' }],
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
      
      // Animation and transitions
      transitionDuration: {
        '250': '250ms',
        '300': '300ms',
      },
      
      // State layers opacity
      opacity: {
        '8': '0.08',
        '12': '0.12',
        '16': '0.16',
        '38': '0.38',
      },
    },
  },
  plugins: [],
}

