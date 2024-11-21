/** @type {import('tailwindcss').Config} */
export default {
  daisyui: { themes: ["dark"] },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#005C4B",
      }
    },
  },
  plugins: [require("daisyui")],
}

