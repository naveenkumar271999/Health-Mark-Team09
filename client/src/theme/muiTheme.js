// muiTheme.js
import { createTheme } from '@mui/material/styles';
import { styled } from '@mui/system';

// Define your custom colors
const colors = {
  primary: '#FC5185',
  title: '#101010',
  subtitle: '#373D3F',
  alert: '#F32626',
  success: '#519330',
  warning: '#F59A31',
  purple: '#4A3093',
  greenblue: '#27AAC7',
  light: '#FFFFFF',
  lightgray: '#C9C9C9',
};

// Create a Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    success: {
      main: colors.success,
    },
    warning: {
      main: colors.warning,
    },
    error: {
      main: colors.alert,
    },
    title: {
      main: colors.title,
    },
    subtitle: {
      main: colors.subtitle,
    },
    alert: {
      main: colors.alert,
    },
    purple: {
      main: colors.purple,
    },
    greenblue: {
      main: colors.greenblue,
    },
    light: {
      main: colors.light,
    },
    lightgray: {
      main: colors.lightgray,
    },
  },
  typography: {
    fontSize: 12,
    fontFamily: ['Manrope', 'sans-serif'].join(','),
    h1: {
      fontFamily: 'Manrope, sans-serif',
      fontWeight: '600',
    },
    h2: {
      fontFamily: 'Krona One, sans-serif',
      fontWeight: '600',
    },
    h3: {
      fontFamily: 'Manrope, sans-serif',
      fontWeight: '600',
    },
    h4: {
      fontFamily: 'Manrope, sans-serif',
      fontWeight: '600',
    },
    h5: {
      fontFamily: 'Manrope, sans-serif',
      fontWeight: '600',
    },
    h6: {
      fontFamily: 'Manrope, sans-serif',
      fontWeight: '600',
    },
    primary: ['Manrope', 'sans-serif'].join(','),
    secondary: ['Krona One', 'sans-serif'].join(','),
  },
});

// Create global CSS variables
const GlobalStyle = styled('style')`
  :root {
    --primary-color: ${colors.primary};
    --title-color: ${colors.title};
    --subtitle-color: ${colors.subtitle};
    --alert-color: ${colors.alert};
    --success-color: ${colors.success};
    --warning-color: ${colors.warning};
    --purple-color: ${colors.purple};
    --greenblue-color: ${colors.greenblue};
  }
`;

export { theme, GlobalStyle };
