/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black': '#000000',
        'red-primary': '#CC1D1D',
        'red-accent': '#E22D0D',
        'gray-light': '#DCDCDD',
        'gray-medium': '#666666',
        'gray-soft': '#F0F0F0',
        'white': '#FFFFFF',
        'beige': '#FFFBF3',
        'green': '#149E32',
      },
      screens: {
        'xxl': '1440px'
      },
    },
  },
  plugins: [],
}

