/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      gridTemplateRows: {
        "[auto,auto,1fr]": "auto auto 1fr",
      },
      fontFamily: {
        comic: ['"Bangers"', 'cursive'],
        body: ['"Fredoka"', 'sans-serif'],
      },
      boxShadow: {
        comic: '4px 4px 0px 0px rgba(0,0,0,0.85)',
        'comic-lg': '6px 6px 0px 0px rgba(0,0,0,0.85)',
        'comic-white': '4px 4px 0px 0px rgba(255,255,255,0.7)',
        'comic-white-lg': '6px 6px 0px 0px rgba(255,255,255,0.7)',
      },
    },
  },
  daisyui: {
    themes: ["lofi", "dark"],
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("daisyui"),
  ],
};
