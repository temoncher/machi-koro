const {
  createGlobPatternsForDependencies
} = require('@nrwl/react/tailwind');

module.exports = {
  purge: createGlobPatternsForDependencies(__dirname),
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        sans: ['dosis', 'sans-serif'],
        lithos: ['lithos', 'sans-serif']
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
