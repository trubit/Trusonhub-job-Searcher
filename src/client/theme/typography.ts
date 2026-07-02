import type { ThemeOptions } from '@mui/material/styles';

type TypographyOptions = NonNullable<ThemeOptions['typography']>;

export const typographyScale = {
  displayXL: {
    fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
    fontWeight: 800,
    fontSize: '4.5rem',
    lineHeight: 1.1,
    letterSpacing: '-0.04em',
  },
  displayLarge: {
    fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
    fontWeight: 800,
    fontSize: '3.75rem',
    lineHeight: 1.12,
    letterSpacing: '-0.035em',
  },
  displayMedium: {
    fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
    fontWeight: 700,
    fontSize: '3rem',
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
  },
  heading1: {
    fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
    fontWeight: 800,
    fontSize: '2.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.025em',
  },
  heading2: {
    fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
    fontWeight: 700,
    fontSize: '2rem',
    lineHeight: 1.25,
    letterSpacing: '-0.02em',
  },
  heading3: {
    fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
    fontWeight: 700,
    fontSize: '1.75rem',
    lineHeight: 1.3,
    letterSpacing: '-0.015em',
  },
  heading4: {
    fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.35,
    letterSpacing: '-0.01em',
  },
  heading5: {
    fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.4,
  },
  heading6: {
    fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
    fontWeight: 600,
    fontSize: '1.125rem',
    lineHeight: 1.45,
  },
  bodyLarge: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '1.125rem',
    lineHeight: 1.6,
  },
  bodyMedium: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: 1.65,
  },
  bodySmall: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  caption: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '0.75rem',
    lineHeight: 1.5,
    letterSpacing: '0.02em',
  },
  label: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '0.75rem',
    lineHeight: 1.4,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },
  button: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: 1.4,
    letterSpacing: '0.02em',
    textTransform: 'none' as const,
  },
};

/**
 * MUI typography config matching MUI standard keys while exposing typographyScale.
 */
export const typography: TypographyOptions = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'sans-serif',
  ].join(','),

  h1: typographyScale.heading1,
  h2: typographyScale.heading2,
  h3: typographyScale.heading3,
  h4: typographyScale.heading4,
  h5: typographyScale.heading5,
  h6: typographyScale.heading6,
  subtitle1: {
    fontWeight: 500,
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  subtitle2: {
    fontWeight: 500,
    fontSize: '0.875rem',
    lineHeight: 1.55,
  },
  body1: typographyScale.bodyMedium,
  body2: typographyScale.bodySmall,
  caption: typographyScale.caption,
  overline: typographyScale.label,
  button: typographyScale.button,
};
