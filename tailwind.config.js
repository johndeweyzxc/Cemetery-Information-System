/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx,html,css}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['"Inter"', "sans-serif"],
      }
    },
  },
  plugins: [],
}

