/** @type {import('tailwindcss').Config} */

export const content = ["./src/**/*.{html,js,ts,jsx,tsx}"];
export const theme = {
  extend: {
    keyframes: {
      "fade-in": {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
      "fade-out": {
        "0%": { opacity: "1" },
        "100%": { opacity: "0" },
      },
    },
    animation: {
      "fade-in": "fade-in 150ms ease-in-out",
      "fade-out": "fade-out 150ms ease-in-out",
    },
    fontFamily: {
      roboto: ["Inter", "sans-serif"],
    },
    colors: {
      text: "#f2f0f3",
      background: "#0e0c0f",
      primary: "#b6abbe",
      secondary: "#5d484b",
      accent: "#99827b",
      mod: "#9293ff",
      crafted: "#b2e6ff",
      fractured: "#b4a26b",
      crucible: "#ff7536",
    },
    borderWidth: {
      1: "1px",
    },
  },
};
export const variants = {};
export const plugins = [];
