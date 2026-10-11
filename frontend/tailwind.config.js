/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f2f6f5",
          100: "#dde9e6",
          200: "#b7d2cc",
          300: "#8bb5ac",
          400: "#5c9186",
          500: "#3d746a",
          600: "#2c5b53",
          700: "#234a44",
          800: "#16302b",
          900: "#0f211d",
        },
        sand: {
          50: "#fbf8f3",
          100: "#f5efe3",
          200: "#e9dcc3",
          300: "#dcc79c",
          400: "#cdac6f",
          500: "#c98a2e",
          600: "#ad7325",
          700: "#8a5b1e",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
