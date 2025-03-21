// tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,css}",
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1660px',
        // => @media (min-width: 1536px) { ... }
        'short': { 'raw': '(max-height: 600px)' },
      },
    },
  },
  plugins: [],
};