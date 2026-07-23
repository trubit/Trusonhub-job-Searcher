import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Paper, Typography, Stack, Button } from '@mui/material';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import { AppInput } from '../../../components/ui/AppInput';
import { AppAlert } from '../../../components/feedback/AppAlert';
import { SEO } from '../../../components/seo/SEO';
import { authApi } from '../services/authApi';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../validation/auth.validation';

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authApi.forgotPassword(data);
      setSubmitted(true);
    } catch {
      setSubmitted(true); // Silent for security
    }
  };

  return (
    <>
      <SEO title="Forgot Password — Talentra" />

      <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <Stack spacing={2} textAlign="center" alignItems="center" sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              bgcolor: 'warning.main',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <KeyOutlinedIcon />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your email address and we'll send you a link to reset your password
            </Typography>
          </Box>
        </Stack>

        {submitted ? (
          <Stack spacing={3}>
            <AppAlert severity="success" title="Check Your Email">
              If an account exists with that email address, we have sent a password reset link. Please check your inbox and spam folder.
            </AppAlert>
            <Button component={Link} to="/auth/login" variant="outlined" color="primary" fullWidth sx={{ borderRadius: '12px' }}>
              Return to Login
            </Button>
          </Stack>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <AppInput
                label="Email Address"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email')}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isSubmitting}
                sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700 }}
              >
                {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
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
