# 🚀 Migration Setup Guide

## Step 1: Install @4saletech/web-design-system

```bash
# Remove current MUI dependencies
npm uninstall @mui/material @mui/icons-material @emotion/react @emotion/styled

# Install 4Sale Design System
npm install @4saletech/web-design-system

# Install peer dependencies (if not already installed)
npm install react react-dom tailwindcss
```

## Step 2: Update Tailwind Configuration

Replace `tailwind.config.js` with:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@4saletech/web-design-system/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "sakrPro",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        primary: {
          DEFAULT: "#1D8EFF",
          50: "#eff8ff",
          100: "#d1e9ff",
          200: "#b2ddff",
          300: "#84caff",
          400: "#53b1fd",
          500: "#1D8EFF",
          600: "#1570ef",
          700: "#175cd3",
          800: "#1849a9",
          900: "#194185",
          950: "#102a56"
        },
        secondary: {
          DEFAULT: "#0C86AE",
          50: "#ccfbf1",
          100: "#99f6e4",
          200: "#5eead4",
          300: "#2dd4bf",
          400: "#14b8a6",
          500: "#0C86AE",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          950: "#083344"
        },
      },
    },
  },
  plugins: [],
}
```

## Step 3: Update App.tsx Root Setup

```tsx
// frontend/src/App.tsx
import React from 'react';
import '@4saletech/web-design-system/dist/style.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import './i18n';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sakr">
          <Routes>
            {/* Your routes */}
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
```

## Step 4: Remove MUI Theme Files

Delete these files:
- `src/theme/muiTheme.ts`
- Any MUI-specific theme configurations

## Step 5: Create 4Sale Design System Wrapper

Create `src/design_system_4sale/index.ts`:

```tsx
// Re-export 4Sale components with same API as current design system
export { 
  Button, 
  Input, 
  Card, 
  Badge, 
  Alert,
  Checkbox,
  Radio,
  Switch,
  Select,
  Slider,
  Textarea,
  Navigation,
  Tabs,
  Breadcrumbs,
  Pagination,
  Sidebar,
  Toast,
  Progress,
  Accordion,
  Modal,
  Tooltip,
  Popover,
  DropdownMenu
} from '@4saletech/web-design-system';

// Create compatibility layer for custom components
export * from './compatibility';
``` 