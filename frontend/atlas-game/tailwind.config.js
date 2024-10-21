/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          500: '#3B82F6',
          600: '#2563EB',
        },
        purple: {
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        green: {
          500: '#10B981',
          600: '#059669',
        },
      },
    },
  },
  plugins: [],
}