/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8B6B4A",   // bear brown
        accent:  "#D4AF37",   // gold
        sand:    "#F7EFE6",   // warm background
        bark:    "#5C4633",   // dark brown for text
      },
    },
  },
  plugins: [],
};