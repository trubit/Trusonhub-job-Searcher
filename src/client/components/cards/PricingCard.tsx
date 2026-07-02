import { Card, CardContent, Box, Typography, Stack, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText?: string;
}

export function PricingCard({
  title,
  price,
  period = '/month',
  description,
  features,
  popular = false,
  ctaText = 'Get Started',
}: PricingCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: popular ? '2px solid' : undefined,
        borderColor: popular ? 'primary.main' : undefined,
        transform: popular ? { md: 'scale(1.03)' } : undefined,
        boxShadow: popular ? '0 12px 40px rgba(59, 130, 246, 0.2)' : undefined,
        overflow: 'hidden',
      }}
    >
      {popular && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'primary.main',
            color: '#fff',
            px: 1.25,
            py: 0.4,
            borderRadius: '10px',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Most Popular
        </Box>
      )}

      <CardContent sx={{ p: { xs: 3, sm: 4 }, flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 4, flexWrap: 'wrap' }}>
          <Typography variant="h3" fontWeight={800} color="primary.main" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}>
            {price}
          </Typography>
          {price !== 'Free' && price !== 'Custom' && (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              {period}
            </Typography>
          )}
        </Box>

        <Stack spacing={1.5} sx={{ mb: 4, flexGrow: 1 }}>
          {features.map((feature, idx) => (
            <Stack key={idx} direction="row" spacing={1.5} alignItems="flex-start">
              <CheckCircleOutlineIcon color="primary" sx={{ fontSize: 18, mt: 0.2, flexShrink: 0 }} />
              <Typography variant="body2" color="text.primary" sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                {feature}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Button
          fullWidth
          variant={popular ? 'contained' : 'outlined'}
          color="primary"
          size="large"
          sx={{ mt: 'auto' }}
        >
          {ctaText}
        </Button>
      </CardContent>
    </Card>
  );
}
