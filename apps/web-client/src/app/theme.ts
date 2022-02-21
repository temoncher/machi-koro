import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {

  interface Palette {
    brandPurple: Palette['primary'];
    brandRed: Palette['primary'];
    brandBlue: Palette['primary'];
    brandGreen: Palette['primary'];
    brandYellow: Palette['primary'];
  }
  interface PaletteOptions {
    brandPurple: PaletteOptions['primary'];
    brandRed: PaletteOptions['primary'];
    brandBlue: PaletteOptions['primary'];
    brandGreen: PaletteOptions['primary'];
    brandYellow: PaletteOptions['primary'];
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: ['dosis', 'lithos'].join(','),
  },
  palette: {
    brandPurple: {
      light: '#ae81ae',
      main: '#7a2d83',
      dark: '#5b245e',
    },
    brandRed: {
      light: '#c77f80',
      main: '#9e1e2b',
      dark: '#8e1d2f',
    },
    brandBlue: {
      light: '#7baed4',
      main: '#136ba5',
      dark: '#0965a3',
    },
    brandGreen: {
      light: '#9ab36c',
      main: '#427830',
      dark: '#0e6737',
    },
    brandYellow: {
      light: '#f8e48e',
      main: '#daa26f',
      dark: '#ae5522',
    },
  },
});
