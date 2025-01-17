/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        slab: ["Roboto Slab", "sans-serif"],
      },
      colors: {
        backgroundLightYellowColor: "rgba(255, 215, 5, 0.09)",
        parapgraphColor: "#777777",
        backgreenColor: "#EEFAF9",
      },
    },
  },
};
