export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1E6FBF', light: '#2980D9', dark: '#155A99' },
        orange: { DEFAULT: '#F47920', light: '#F5923A', dark: '#D4671A' },
        sidebar: { bg: '#0F1C2E', text: '#CBD5E1' },
      },
      fontFamily: {
        arabic: ['Noto Sans Arabic', 'sans-serif'],
        english: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
