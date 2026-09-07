import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { weddingTheme } from './theme/weddingTheme';
import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <ThemeProvider theme={weddingTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
