/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    },
  },
  daisyui: {
    themes: [{
      winter:{...require("daisyui/src/theming/themes")["winter"],
      accent1: "#c148ac",
    
    },sunset:{...require("daisyui/src/theming/themes")["sunset"],
    accent1: "#9878d9",  
  }
  }],
  },
  plugins: [require('daisyui'),],
}

