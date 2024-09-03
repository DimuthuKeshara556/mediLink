/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Inter': ['Inter', 'sans-serif'],
      },
      colors:{
        primary:'#070E31',
        secondary:'#004080',
        lightblue:'#95D6F8',
        lightblueButton:'#0067FF',
        darkgray:'#868686',
        accent: '#F0F0F0',
        danger: '#E0245E',
      },

      animation: {
        blink: 'blink 1s infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}