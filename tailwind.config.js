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
        // Add other colors as needed
      },
    },
  },
  plugins: [],
}