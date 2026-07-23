import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Paper, Typography, Stack, Button } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { AppInput } from '../../../components/ui/AppInput';
import { AppAlert } from '../../../components/feedback/AppAlert';
import { SEO } from '../../../components/seo/SEO';
import { authApi } from '../services/authApi';
import { resetPasswordSchema, ResetPasswordFormData } from '../validation/auth.validation';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setErrorMessage('Reset token missing or invalid link.');
      return;
    }

    try {
      setErrorMessage(null);
      await authApi.resetPassword(token, data);
      setIsSuccess(true);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message || 'Failed to reset password. Token may have expired.';
      setErrorMessage(msg);
    }
  };

  return (
    <>
      <SEO title="Set New Password — Talentra" />

      <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <Stack spacing={2} textAlign="center" alignItems="center" sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              bgcolor: 'primary.main',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockResetIcon />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
              Set New Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter and confirm your new password below
            </Typography>
          </Box>
        </Stack>

        {errorMessage && (
          <AppAlert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </AppAlert>
        )}

        {isSuccess ? (
          <Stack spacing={3}>
            <AppAlert severity="success" title="Password Updated">
              Your password has been successfully reset. You may now log in with your new credentials.
            </AppAlert>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => navigate('/auth/login')}
              sx={{ borderRadius: '12px', py: 1.5, fontWeight: 700 }}
            >
              Sign In Now
            </Button>
          </Stack>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <AppInput
                label="New Password"
                type="password"
                fullWidth
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                {...register('newPassword')}
              />

              <AppInput
                label="Confirm New Password"
                type="password"
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isSubmitting || !token}
                sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700 }}
              >
                {isSubmitting ? 'Updating Password...' : 'Reset Password'}
              </Button>
            </Stack>
          </form>
        )}

        <Box textAlign="center" sx={{ mt: 3 }}>
          <Link to="/auth/login" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              ← Back to Sign In
            </Typography>
          </Link>
        </Box>
      </Paper>
    </>
  );
}
