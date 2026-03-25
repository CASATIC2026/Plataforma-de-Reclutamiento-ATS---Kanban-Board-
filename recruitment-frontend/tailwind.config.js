/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors - New TalentBridge palette
        navy: {
          DEFAULT: '#131931',
          light: '#1a2040',
          lighter: '#2E4055',
        },
        accent: {
          DEFAULT: '#CD7B4F',
          light: '#b5673d',
          bg: '#FFF1EB',
        },
        teal: {
          DEFAULT: '#1F9DB9',
          light: '#F0F9FC',
        },
        green: {
          DEFAULT: '#319E85',
          light: '#E8F5F0',
        },
        gray: {
          50: '#FFF5F5',
          100: '#F9F9F9',
          200: '#F4F4F4',
          300: '#E8E8E8',
          400: '#D2D1D1',
          500: '#7A8C98',
          600: '#464646',
          700: '#333333',
          800: '#1a1a1a',
          900: '#000000',
        },
      },
      fontFamily: {
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'body': ['DM Sans', 'sans-serif'],
        'maven': ['Maven Pro', 'sans-serif'],
        'kaiser': ['Kaisei Decol', 'serif'],
        'jersey': ['Jersey 25', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
