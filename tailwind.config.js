/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '3rem',
        md: '5rem',
        lg: '7rem',
        xl: '9rem',
        '2xl': '11rem',
      },
    },
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
