/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
          './index.html',
          './pages/**/*.{js,ts,jsx,tsx}',
          './components/**/*.{js,ts,jsx,tsx}',
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
