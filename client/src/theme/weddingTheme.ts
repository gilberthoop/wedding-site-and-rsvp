import { createTheme, alpha } from '@mui/material/styles';

// ── Palette tokens ────────────────────────────────────
export const palette = {
  ivory:      '#F8F6EE',
  porcelain:  '#F5ECD7',
  cream:      '#FFF3D4',
  nude:       '#E8C4A0',
  blushNude:  '#C9A090',
  beige:      '#D4A574',
  tan:        '#B8864E',
  hazelnut:   '#7B4A2D',
  mocha:      '#5C3D2E',
  chocolate:  '#3D1C0D',
  dove:       '#8B8589',
  pistachio:  '#A8C5A0',
} as const;

// ── Custom MUI theme ──────────────────────────────────
export const weddingTheme = createTheme({
  palette: {
    primary: {
      main:        palette.hazelnut,
      light:       palette.tan,
      dark:        palette.mocha,
      contrastText: palette.ivory,
    },
    secondary: {
      main:        palette.tan,
      light:       palette.beige,
      dark:        palette.hazelnut,
      contrastText: palette.ivory,
    },
    background: {
      default: palette.ivory,
      paper:   palette.porcelain,
    },
    text: {
      primary:   palette.chocolate,
      secondary: palette.mocha,
      disabled:  palette.dove,
    },
    success: {
      main: palette.pistachio,
    },
    divider: alpha(palette.beige, 0.4),
  },

  typography: {
    fontFamily: '"Jost", system-ui, sans-serif',
    // Display / script headings — applied via sx={{ fontFamily: 'display' }}
    h1: {
      fontFamily: '"Great Vibes", cursive',
      fontWeight: 400,
      lineHeight: 1.15,
      color: palette.chocolate,
    },
    h2: {
      fontFamily: '"Great Vibes", cursive',
      fontWeight: 400,
      lineHeight: 1.2,
      color: palette.chocolate,
    },
    h3: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 500,
      lineHeight: 1.3,
      color: palette.chocolate,
    },
    h4: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 500,
      color: palette.mocha,
    },
    h5: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 400,
      color: palette.mocha,
    },
    h6: {
      fontFamily: '"Jost", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      fontSize: '0.72rem',
      color: palette.tan,
    },
    subtitle1: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontSize: '1.1rem',
      fontStyle: 'italic',
      color: palette.mocha,
    },
    subtitle2: {
      fontFamily: '"Jost", sans-serif',
      fontSize: '0.75rem',
      fontWeight: 500,
      letterSpacing: '0.14em',
      textTransform: 'uppercase' as const,
      color: palette.tan,
    },
    body1: {
      fontSize: '0.95rem',
      color: palette.mocha,
      lineHeight: 1.75,
    },
    body2: {
      fontSize: '0.85rem',
      color: palette.dove,
      lineHeight: 1.65,
    },
    caption: {
      fontSize: '0.7rem',
      letterSpacing: '0.12em',
      textTransform: 'uppercase' as const,
      color: palette.dove,
    },
    button: {
      fontFamily: '"Jost", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.14em',
      textTransform: 'uppercase' as const,
    },
  },

  shape: {
    borderRadius: 12,
  },

  shadows: [
    'none',
    '0 2px 8px rgba(61,28,13,0.06)',
    '0 4px 16px rgba(61,28,13,0.08)',
    '0 6px 20px rgba(61,28,13,0.09)',
    '0 8px 28px rgba(61,28,13,0.10)',
    '0 12px 36px rgba(61,28,13,0.11)',
    '0 16px 48px rgba(61,28,13,0.13)',
    '0 20px 56px rgba(61,28,13,0.14)',
    '0 24px 64px rgba(61,28,13,0.15)',
    '0 28px 72px rgba(61,28,13,0.16)',
    '0 32px 80px rgba(61,28,13,0.17)',
    '0 36px 88px rgba(61,28,13,0.18)',
    '0 40px 96px rgba(61,28,13,0.19)',
    '0 44px 104px rgba(61,28,13,0.20)',
    '0 48px 112px rgba(61,28,13,0.20)',
    '0 52px 120px rgba(61,28,13,0.21)',
    '0 56px 128px rgba(61,28,13,0.21)',
    '0 60px 136px rgba(61,28,13,0.22)',
    '0 64px 144px rgba(61,28,13,0.22)',
    '0 68px 152px rgba(61,28,13,0.23)',
    '0 72px 160px rgba(61,28,13,0.23)',
    '0 76px 168px rgba(61,28,13,0.24)',
    '0 80px 176px rgba(61,28,13,0.24)',
    '0 84px 184px rgba(61,28,13,0.25)',
    '0 88px 192px rgba(61,28,13,0.25)',
  ] as unknown as import('@mui/material').Shadows,

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          padding: '0.7rem 2rem',
          fontSize: '0.75rem',
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 6px 24px rgba(123,74,45,0.25)' },
        },
        contained: {
          '&:hover': { transform: 'translateY(-2px)' },
          transition: 'all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': { borderWidth: '1.5px' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: `1px solid ${alpha(palette.beige, 0.2)}`,
          boxShadow: '0 8px 40px rgba(61,28,13,0.08)',
          transition: 'transform 0.35s ease, box-shadow 0.35s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 16px 56px rgba(61,28,13,0.14)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 50,
            backgroundColor: palette.ivory,
            '& fieldset': { borderColor: alpha(palette.beige, 0.6), borderWidth: '1.5px' },
            '&:hover fieldset': { borderColor: palette.tan },
            '&.Mui-focused fieldset': { borderColor: palette.hazelnut },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          fontSize: '0.68rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Great+Vibes&family=Jost:wght@300;400;500&display=swap');

        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        img  { display: block; max-width: 100%; }
        a    { text-decoration: none; }

        @keyframes scrollBounce {
          0%, 100% { transform: rotate(45deg) translateY(0); opacity: 0.7; }
          50%       { transform: rotate(45deg) translateY(5px); opacity: 0.2; }
        }
        @keyframes petalFall {
          0%   { transform: translateY(0) rotate(0deg) translateX(0); opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(110vh) rotate(720deg) translateX(60px); opacity: 0; }
        }
        @keyframes spin {
          0%   { transform: rotate(0deg);   }
          45%  { transform: rotate(0deg);   }
          50%  { transform: rotate(180deg); }
          95%  { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes flip {
          0%   { transform: scaleY(1);    }
          50%  { transform: scaleY(1.08); }
          100% { transform: scaleY(1);    }
        }
      `,
    },
  },
});
