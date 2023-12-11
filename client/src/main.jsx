import React from 'react'
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme, GlobalStyle } from './theme/muiTheme.js';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import './index.css'
import store from '../context/store.js';
import App from './App.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store} >
      <ThemeProvider theme={theme}> {/* for material ui theming */}
        <CssBaseline />
        <GlobalStyle />
        <Toaster />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)
