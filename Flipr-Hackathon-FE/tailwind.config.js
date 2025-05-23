/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f9f0',
          100: '#ccf4e0',
          200: '#99e9c2',
          300: '#66dea3',
          400: '#33d385',
          500: '#25D366', // WhatsApp green
          600: '#1eab52',
          700: '#17833e',
          800: '#0f5829',
          900: '#082c15',
        },
        secondary: {
          50: '#e6ebf2',
          100: '#ccd8e5',
          200: '#99b0ca',
          300: '#6689b0',
          400: '#336195',
          500: '#003A7A',
          600: '#002e62',
          700: '#00234a',
          800: '#001731',
          900: '#000c19',
        },
        neutral: {
          50: '#f8f9fa',
          100: '#f0f2f5',
          200: '#e4e6eb',
          300: '#dddfe2',
          400: '#ced0d4',
          500: '#bec3c9',
          600: '#8d949e',
          700: '#606770',
          800: '#444950',
          900: '#1c1e21',
        },
        success: {
          500: '#10B981',
        },
        warning: {
          500: '#F59E0B',
        },
        error: {
          500: '#EF4444',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateX(10px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  plugins: [],
}