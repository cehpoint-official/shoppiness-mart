/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        slab: ["Roboto Slab", "sans-serif"],
      },
      colors: {
        backColor: "rgba(255, 215, 5, 0.09)",
      },
    },
  },
};
