/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cyan: { DEFAULT: '#00D4FF' },
        gold: { DEFAULT: '#FFD700' },
        dark: { DEFAULT: '#0A1628', card: '#0F1E35', surface: '#162440' },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        ibm: ['IBM Plex Sans Arabic', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        pulse2: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
