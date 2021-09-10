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
        lithos: ['lithos', 'sans-serif'],
      },
      container: {
        padding: '2rem',
      },
      colors: {
        primary: {
          light: '#AEE4EA',
          DEFAULT: '#71CED9',
          dark: '#2D9CA8'
        },
        secondary: {
          light: '#049DBF',
          DEFAULT: '#03738C',
          dark: '#025A6E'
        },
        tertiary: {
          light: '#F6F2B9',
          DEFAULT: '#F2EC94',
          dark: '#E5D930'
        },
        "brand-purple": {
          light: '#ae81ae',
          DEFAULT: '#7a2d83',
          dark: '#5b245e'
        },
        "brand-red": {
          light: '#c77f80',
          DEFAULT: '#9e1e2b',
          dark: '#8e1d2f'
        },
        "brand-blue": {
          light: '#7baed4',
          DEFAULT: '#136ba5',
          dark: '#0965a3'
        },
        "brand-green": {
          light: '#9ab36c',
          DEFAULT: '#427830',
          dark: '#0e6737'
        },
        "brand-yellow": {
          light: '#f8e48e',
          DEFAULT: '#daa26f',
          dark: '#ae5522'
        },
        "soft-yellow": {
          DEFAULT: '#eecc4e',
        },
        "vivid-orange": {
          DEFAULT: '#dd9e1b',
        },
        "nutmeg": {
          DEFAULT: "#7d4835",
        },
        "terracotta": {
          DEFAULT: "#bb714b",
        },
      },
      maxWidth: {
        '3/4': '75%',
        '11/12': '91.7%',
      },
      fontSize: {
        'xxs': ['.625rem', '.83rem'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
