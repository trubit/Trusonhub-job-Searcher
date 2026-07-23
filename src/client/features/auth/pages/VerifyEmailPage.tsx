import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Box, Paper, Typography, Stack, Button, CircularProgress } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { AppAlert } from '../../../components/feedback/AppAlert';
import { SEO } from '../../../components/seo/SEO';
import { authApi } from '../services/authApi';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setErrorMessage('Verification token missing or link is invalid.');
      return;
    }

    authApi
      .verifyEmail(token)
      .then(() => {
        setIsSuccess(true);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        const msg = axiosErr.response?.data?.message || 'Verification link is invalid or has expired.';
        setErrorMessage(msg);
        setIsLoading(false);
      });
  }, [token]);

  return (
    <>
      <SEO title="Verify Email Address — Talentra" />

      <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        {isLoading ? (
          <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
            <CircularProgress size={48} color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Verifying your email address...
            </Typography>
          </Stack>
        ) : isSuccess ? (
          <Stack spacing={3} alignItems="center">
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                bgcolor: 'success.main',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MarkEmailReadIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h4" fontWeight={800}>
              Email Verified!
            </Typography>
            <AppAlert severity="success" sx={{ width: '100%' }}>
              Your email address has been verified successfully. Your account is fully active.
            </AppAlert>
            <Button component={Link} to="/auth/login" variant="contained" color="primary" fullWidth sx={{ borderRadius: '12px', py: 1.5, fontWeight: 700 }}>
              Continue to Login
            </Button>
          </Stack>
        ) : (
          <Stack spacing={3} alignItems="center">
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                bgcolor: 'error.main',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h4" fontWeight={800}>
              Verification Failed
            </Typography>
            <AppAlert severity="error" sx={{ width: '100%' }}>
              {errorMessage}
            </AppAlert>
            <Button component={Link} to="/auth/login" variant="outlined" color="primary" fullWidth sx={{ borderRadius: '12px', py: 1.5 }}>
              Return to Login
            </Button>
          </Stack>
        )}
      </Paper>
    </>
  );
}
