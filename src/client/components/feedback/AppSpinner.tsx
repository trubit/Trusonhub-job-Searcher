import { Box, CircularProgress, Typography } from '@mui/material';

export interface AppSpinnerProps {
  label?: string;
  size?: number;
  fullPage?: boolean;
}

export function AppSpinner({ label, size = 40, fullPage = false }: AppSpinnerProps) {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 4,
      }}
    >
      <CircularProgress size={size} color="primary" />
      {label && (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
      )}
    </Box>
  );

  if (fullPage) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
}
