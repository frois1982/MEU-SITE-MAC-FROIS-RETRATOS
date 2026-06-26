/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
      content: [
        './index.html',
        './**/*.{js,ts,jsx,tsx}',
      ],
      theme: {
    extend: {
      colors: {
        gold: {
          400: '#fbbf24',
                      500: '#f59e0b',
                      600: '#d97706',
                      700: '#b45309',
            }
      },
      fontFamily: {
        serif: ['Cinzel', 'serif'],
                  sans: ['Montserrat', 'sans-serif'],
          }
    }
  },
  plugins: [],
    }
