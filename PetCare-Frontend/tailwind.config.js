/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],

  content: [
    "./App.{js,js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
  extend: {
    colors: {
      primary: "#7C5CFC",
      primaryDark: "#6948F5",
      secondary: "#9E8CFF",

      background: "#FAFAFC",

      card: "#FFFFFF",

      border: "#ECECEC",

      text: "#1E1E1E",

      textSecondary: "#777777",

      success: "#37C978",

      warning: "#FFB648",

      danger: "#FF6464",

      lightPurple: "#F2EEFF",
    },

    borderRadius: {
      xl: "18px",
      "2xl": "24px",
      "3xl": "32px",
    },
  },
},

  plugins: [],
};