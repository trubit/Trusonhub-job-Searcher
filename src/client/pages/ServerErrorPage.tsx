import { Link } from 'react-router-dom';
import { Box, Typography, Button, Stack } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import { SEO } from '../components/seo/SEO';

export function ServerErrorPage() {
  return (
    <>
      <SEO title="500 — Server Error | Talentra" />

      <Box textAlign="center" sx={{ py: 6 }}>
        <Typography
          variant="h1"
          fontWeight={900}
          className="gradient-text"
          sx={{ fontSize: { xs: '6rem', md: '9rem' }, lineHeight: 1, mb: 2 }}
        >
          500
        </Typography>

        <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
          Internal Server Error
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto', mb: 4 }}>
          Something went wrong on our end. Our engineering team has been notified and is working on a fix.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="primary" size="large" startIcon={<RefreshIcon />} onClick={() => window.location.reload()}>
            Try Reloading
          </Button>
          <Button component={Link} to="/" variant="outlined" color="primary" size="large" startIcon={<HomeIcon />}>
            Back to Home
          </Button>
        </Stack>
      </Box>
    </>
  );
}
