/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Inter", "sans-serif"],
      },
      colors: {
        text: "#f2f0f3",
        background: "#0e0c0f",
        primary: "#b6abbe",
        secondary: "#5d484b",
        accent: "#99827b",
      },
      borderWidth: {
        1: "1px",
      },
    },
  },
  variants: {},
  plugins: [],
};
