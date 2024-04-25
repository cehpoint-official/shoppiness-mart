/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        slab: ["Roboto Slab", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    // false: only light + dark | true: all themes | array: specific themes like this ["light"]
    darkTheme: "Light",
  },
};
