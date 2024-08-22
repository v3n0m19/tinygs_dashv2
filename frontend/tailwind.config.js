/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green-100': '#d1fae5', // Light green
        'green-200': '#a7f3d0', // Slightly darker green
        'green-300': '#6ee7b7', // Medium green
        'green-500': '#10b981', // Dark green
      },
    },
  },
  daisyui: {
    themes: ["sunset"],
  },
  plugins: [require('daisyui'),],
}

