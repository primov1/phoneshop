/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        noir: {
          50:  '#faf9f6',
          100: '#f0efe8',
          200: '#e0ddd4',
          800: '#272727',
          850: '#1e1e1e',
          900: '#131313',
          950: '#090909',
        },
        brand: {
          green:  '#4ade80',
          red:    '#f87171',
          amber:  '#fbbf24',
          blue:   '#93c5fd',
          purple: '#c084fc',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        DEFAULT: '10px',
        sm: '7px',
        xs: '5px',
      },
    },
  },
  plugins: [],
}
