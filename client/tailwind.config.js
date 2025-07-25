/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#4F46E5', // indigo
        accent: '#FCD34D', // amber
        textDark: '#1F2937', // dark gray
        bgLight: '#F3F4F6', // light gray
      },
    },
  },
  plugins: [],
}