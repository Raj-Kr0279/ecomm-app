/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,jsx,ts,tsx}',
      './components/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: '#16a34a', // Green-600
          secondary: '#1e40af', // Blue-800
          textPrimary: '#1f2937', // Gray-800
          textSecondary: '#6b7280', // Gray-500
          bgPrimary: '#f9fafb', // Gray-50
        },
        fontFamily: {
          primary: ['Inter', 'sans-serif'],
          secondary: ['Poppins', 'sans-serif'],
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
        },
      },
    },
    plugins: [],
  };