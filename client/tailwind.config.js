/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "light-white": "#ffffff2b",
        "dark-grey": "#202123",
        "light-grey": "#353740",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    //"cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"
    themes: ["light", "dark"],
    darkTheme: "dark"
  },
}