/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      ...colors,
      black: "#5c584f",
      white: "#fffcf6",
      primary: "#1ac0c6",
      accent: "#1f306e",
      secondary: "#bb38fe",
      tertiary: "#ffb70f",
      quaternary: "#e74645",
    },
    extend: {},
  },
  plugins: [],
};
