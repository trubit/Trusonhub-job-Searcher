import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Paper, Typography, Stack, Button, Grid } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import { AppInput } from '../../../components/ui/AppInput';
import { AppAlert } from '../../../components/feedback/AppAlert';
import { SEO } from '../../../components/seo/SEO';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../store/useAuthStore';
import { registerEmployerSchema, RegisterEmployerFormData } from '../validation/auth.validation';

export function RegisterEmployerPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterEmployerFormData>({
    resolver: zodResolver(registerEmployerSchema),
  });

  const onSubmit = async (data: RegisterEmployerFormData) => {
    try {
      setErrorMessage(null);
      const res = await authApi.registerEmployer(data);
      setAuth(res.data.user, res.data.accessToken);
      navigate('/');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message || 'Employer registration failed. Please try again.';
      setErrorMessage(msg);
    }
  };

  return (
    <>
      <SEO title="Employer Registration — TrusonHub" />

      <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <Stack spacing={2} textAlign="center" alignItems="center" sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              bgcolor: 'secondary.main',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BusinessIcon />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
              Employer Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Post jobs and hire world-class talent on TrusonHub
            </Typography>
          </Box>
        </Stack>

        {errorMessage && (
          <AppAlert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </AppAlert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <AppInput
                label="Company Name"
                fullWidth
                error={!!errors.companyName}
                helperText={errors.companyName?.message}
                {...register('companyName')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AppInput
                label="First Name"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                {...register('firstName')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AppInput
                label="Last Name"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                {...register('lastName')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AppInput
                label="Username"
                fullWidth
                error={!!errors.username}
                helperText={errors.username?.message}
                {...register('username')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AppInput
                label="Work Email Address"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AppInput
                label="Password"
                type="password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AppInput
                label="Confirm Password"
                type="password"
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700, mt: 1 }}
              >
                {isSubmitting ? 'Creating Employer Account...' : 'Register as Employer'}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Box textAlign="center" sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link to="/auth/login" style={{ textDecoration: 'none' }}>
              <Typography component="span" color="primary.main" fontWeight={700}>
                Sign In
              </Typography>
            </Link>
          </Typography>
        </Box>
      </Paper>
    </>
  );
}
