/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          600: '#197a3a',
          700: '#155e30',
          800: '#0f4623',
        },
      },
      boxShadow: {
        card: '0 10px 30px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        xl: '16px',
      },
    },
  },
  plugins: [],
}

