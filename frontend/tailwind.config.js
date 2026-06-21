/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',
          purple: '#7C3AED',
          lightBlue: '#60A5FA',
          lightPurple: '#A78BFA',
        },
        dark: {
          bg: '#0B0F19',
          card: '#151C2C',
          border: '#232D42',
          text: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
