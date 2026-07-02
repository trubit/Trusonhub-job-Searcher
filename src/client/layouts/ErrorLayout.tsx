import { Outlet, Link } from 'react-router-dom';
import { Box, Container, Stack, Typography } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

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
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <WorkIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="h6" fontWeight={800}>
                TrusonHub
              </Typography>
            </Stack>
          </Link>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ my: 'auto', py: 6 }}>
        <Outlet />
      </Container>

      <Box component="footer" sx={{ pb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} TrusonHub Inc. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
