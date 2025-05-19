/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/app/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
      // add any other folders where you use Tailwind classes
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };