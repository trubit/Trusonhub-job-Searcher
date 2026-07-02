import { useTheme, useMediaQuery as useMuiMediaQuery, Breakpoint } from '@mui/material';

export function useMediaQuery(key: Breakpoint | number): boolean {
  const theme = useTheme();
  return useMuiMediaQuery(typeof key === 'number' ? `(min-width:${key}px)` : theme.breakpoints.up(key));
}
