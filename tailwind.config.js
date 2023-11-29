/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

const pen = colors.zinc['900']

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        // sm: '480px',
        // md: '600px',
        // mlg: '1024px',
        // lg: '1240px',
        // xl: '1600px',
        mouse: { raw: '(hover:hover)' }
      },
      colors: {
        'green-neon': '#03FF00',
        grau: {
          200: '#D9D9D9',
          400: '#B1B1B1',
        }
      },
      fontFamily: {
        // 'comic': '"Comic Sans MS", "Comic Sans", cursive',
        // 'comic': '"Comic Sans", "Comic Sans MS", "Chalkboard", "ChalkboardSE-Regular", sans-serif',
        'code': '"ZK-Spectrum", monospace',
      },
      fontSize: {
        base: '13px',
      },
      borderWidth: {
        DEFAULT: '1.75px', // match 16px font weight
      },
      borderColor: {
        DEFAULT: pen,
      },
      width: {
        'full+10': 'calc(100% + 3rem)',
      },
      gap: {
        inherit: 'inherit',
      },
      boxShadow: {
        'hard': '6px 6px 0 black',
      },
      animation: {
        'blink': 'blink 250ms infinite linear',
      },
      keyframes: {
        'blink': {
          '0%, 50%': { opacity:0 },
          '51%, 100%': { opacity:1 },
        }
      }
    },
  },
  plugins: [],
}