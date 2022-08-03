/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'theme-600': '#222336',
        'theme-400': '#414359',
        'theme-300': '#696c82',
        'highlight-1': '#32ba89',
        'highlight-2': '#355f7d',
      },
    },
  },
  plugins: [],
}
