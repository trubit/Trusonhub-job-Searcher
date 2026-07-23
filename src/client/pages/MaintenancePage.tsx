import { Typography, Paper, Stack } from '@mui/material';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import { SEO } from '../components/seo/SEO';

export function MaintenancePage() {
  return (
    <>
      <SEO title="System Maintenance | Talentra" />

      <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '24px', maxWidth: 540, mx: 'auto' }}>
        <BuildCircleIcon color="primary" sx={{ fontSize: 72, mb: 2 }} />

        <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
          Under Scheduled Maintenance
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
          We are upgrading our enterprise infrastructure to serve you better. We will be back online shortly!
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="center">
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Estimated Downtime: ~15 minutes
          </Typography>
        </Stack>
      </Paper>
    </>
  );
}
