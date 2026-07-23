/**
 * Full 50–900 design token palette system for Talentra.
 * Includes complete scales for Primary, Secondary, Success, Warning, Error, Info, Neutral,
 * plus Surface, Border, and Background tokens for both Light and Dark modes.
 */

export const colorTokens = {
  // Primary (Brand Blue)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // Secondary (Purple Accent)
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },
  // Success (Green)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  // Warning (Amber)
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  // Error (Red)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  // Info (Cyan/Sky)
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  // Neutral (Slate / Dark Surfaces)
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
} as const;

export const darkPalette = {
  mode: 'dark' as const,
  primary: {
    light: colorTokens.primary[400],
    main: colorTokens.primary[500],
    dark: colorTokens.primary[600],
    contrastText: '#ffffff',
  },
  secondary: {
    light: colorTokens.secondary[400],
    main: colorTokens.secondary[500],
    dark: colorTokens.secondary[600],
    contrastText: '#ffffff',
  },
  success: {
    light: colorTokens.success[300],
    main: colorTokens.success[500],
    dark: colorTokens.success[700],
    contrastText: '#ffffff',
  },
  warning: {
    light: colorTokens.warning[300],
    main: colorTokens.warning[500],
    dark: colorTokens.warning[700],
    contrastText: '#ffffff',
  },
  error: {
    light: colorTokens.error[300],
    main: colorTokens.error[500],
    dark: colorTokens.error[700],
    contrastText: '#ffffff',
  },
  info: {
    light: colorTokens.info[300],
    main: colorTokens.info[500],
    dark: colorTokens.info[700],
    contrastText: '#ffffff',
  },
  background: {
    default: colorTokens.neutral[900], // #0f172a
    paper: colorTokens.neutral[800],   // #1e293b
    surface: '#172033',
  },
  text: {
    primary: colorTokens.neutral[50],
    secondary: colorTokens.neutral[400],
    disabled: colorTokens.neutral[600],
  },
  border: {
    default: colorTokens.neutral[700],
    subtle: 'rgba(255, 255, 255, 0.08)',
  },
  divider: colorTokens.neutral[700],
};

export const lightPalette = {
  mode: 'light' as const,
  primary: {
    light: colorTokens.primary[400],
    main: colorTokens.primary[600],
    dark: colorTokens.primary[700],
    contrastText: '#ffffff',
  },
  secondary: {
    light: colorTokens.secondary[400],
    main: colorTokens.secondary[600],
    dark: colorTokens.secondary[700],
    contrastText: '#ffffff',
  },
  success: {
    light: colorTokens.success[400],
    main: colorTokens.success[600],
    dark: colorTokens.success[800],
    contrastText: '#ffffff',
  },
  warning: {
    light: colorTokens.warning[400],
    main: colorTokens.warning[600],
    dark: colorTokens.warning[800],
    contrastText: '#ffffff',
  },
  error: {
    light: colorTokens.error[400],
    main: colorTokens.error[600],
    dark: colorTokens.error[800],
    contrastText: '#ffffff',
  },
  info: {
    light: colorTokens.info[400],
    main: colorTokens.info[600],
    dark: colorTokens.info[800],
    contrastText: '#ffffff',
  },
  background: {
    default: colorTokens.neutral[50],  // #f8fafc
    paper: '#ffffff',
    surface: colorTokens.neutral[100],
  },
  text: {
    primary: colorTokens.neutral[900],
    secondary: colorTokens.neutral[600],
    disabled: colorTokens.neutral[400],
  },
  border: {
    default: colorTokens.neutral[200],
    subtle: 'rgba(0, 0, 0, 0.06)',
  },
  divider: colorTokens.neutral[200],
};
