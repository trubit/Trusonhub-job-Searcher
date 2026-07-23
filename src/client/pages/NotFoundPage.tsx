import { Link } from 'react-router-dom';
import { Box, Typography, Button, Stack } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import { SEO } from '../components/seo/SEO';

export function NotFoundPage() {
  return (
    <>
      <SEO title="404 — Page Not Found | Talentra" />

      <Box textAlign="center" sx={{ py: 6 }}>
        <Typography
          variant="h1"
          fontWeight={900}
          className="gradient-text"
          sx={{ fontSize: { xs: '6rem', md: '9rem' }, lineHeight: 1, mb: 2 }}
        >
          404
        </Typography>

        <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
          Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto', mb: 4 }}>
          The page you are looking for doesn't exist or has been moved to another URL.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button component={Link} to="/" variant="contained" color="primary" size="large" startIcon={<HomeIcon />}>
            Back to Home
          </Button>
          <Button component={Link} to="/jobs" variant="outlined" color="primary" size="large" startIcon={<SearchIcon />}>
            Browse Jobs
          </Button>
        </Stack>
      </Box>
    </>
  );
}
