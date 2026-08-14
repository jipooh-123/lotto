/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ball: {
          yellow: '#FBC400',
          blue: '#69C8F2',
          red: '#FF7272',
          gray: '#AAAAAA',
          green: '#B0D840'
        }
      }
    },
  },
  plugins: [],
}
