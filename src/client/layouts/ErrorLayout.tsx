import { Outlet } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import { Logo } from '../components/navigation/Logo';

export function ErrorLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Box component="header" sx={{ width: '100%', pt: 2 }}>
        <Container maxWidth="lg">
          <Logo size="medium" />
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ my: 'auto', py: 6 }}>
        <Outlet />
      </Container>

      <Box component="footer" sx={{ pb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Talentra Inc. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
