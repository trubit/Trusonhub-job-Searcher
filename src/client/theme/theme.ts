import { createTheme, responsiveFontSizes, Theme } from '@mui/material/styles';
import { darkPalette, lightPalette } from './palette';
import { typography } from './typography';
import { spacingConfig } from './spacing';
import { lightShadows, darkShadows } from './shadows';
import { radius } from './radius';

export type ThemeMode = 'light' | 'dark' | 'system';

function buildTheme(mode: 'light' | 'dark'): Theme {
  const palette = mode === 'dark' ? darkPalette : lightPalette;
  const shadowTokens = mode === 'dark' ? darkShadows : lightShadows;

  const baseTheme = createTheme({
    palette,
    typography,
    spacing: spacingConfig,

    shape: {
      borderRadius: parseInt(radius.md, 10),
    },

    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },

    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: radius.md,
            padding: '10px 24px',
            fontWeight: 600,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 'none',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: shadowTokens.sm,
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          containedPrimary: {
            '&:hover': {
              boxShadow: shadowTokens.brand,
            },
          },
          containedSecondary: {
            '&:hover': {
              boxShadow: shadowTokens.accent,
            },
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            boxShadow: shadowTokens.md,
            backgroundImage: 'none',
            border: `1px solid ${palette.border.subtle}`,
            transition: 'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
            '&:hover': {
              boxShadow: shadowTokens.lg,
              borderColor: palette.border.default,
            },
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },

      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'medium',
        },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: radius.md,
              transition: 'all 0.2s ease',
              '&.Mui-focused': {
                boxShadow: `0 0 0 3px ${mode === 'dark' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(37, 99, 235, 0.15)'}`,
              },
            },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: radius.sm,
            fontWeight: 500,
          },
        },
      },

      MuiAppBar: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backdropFilter: 'blur(20px)',
            backgroundColor: mode === 'dark'
              ? 'rgba(15, 23, 42, 0.85)'
              : 'rgba(248, 250, 252, 0.85)',
            borderBottom: `1px solid ${palette.border.subtle}`,
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? palette.background.default : palette.background.paper,
            borderLeft: `1px solid ${palette.border.subtle}`,
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: radius.xl,
            boxShadow: shadowTokens['2xl'],
            border: `1px solid ${palette.border.subtle}`,
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: radius.xs,
            fontSize: '0.75rem',
            fontWeight: 500,
          },
        },
      },

      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box',
          },
          html: {
            scrollBehavior: 'smooth',
          },
          body: {
            overflowX: 'hidden',
          },
          '::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '::-webkit-scrollbar-thumb': {
            background: mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
            borderRadius: '3px',
          },
          '::-webkit-scrollbar-thumb:hover': {
            background: mode === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
          },
        },
      },
    },
  });

  return responsiveFontSizes(baseTheme);
}

export const darkTheme = buildTheme('dark');
export const lightTheme = buildTheme('light');
