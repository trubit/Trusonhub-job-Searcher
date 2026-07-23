import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Paper, Typography, Stack, Button, Divider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { AppInput } from '../../../components/ui/AppInput';
import { AppAlert } from '../../../components/feedback/AppAlert';
import { SEO } from '../../../components/seo/SEO';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../store/useAuthStore';
import { loginSchema, LoginFormData } from '../validation/auth.validation';

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage(null);
      const res = await authApi.login(data);
      setAuth(res.data.user, res.data.accessToken);
      navigate('/');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrorMessage(msg);
    }
  };

  return (
    <>
      <SEO title="Log In — Talentra" />

      <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <Stack spacing={3} textAlign="center" alignItems="center" sx={{ mb: 4 }}>
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
            <LockOutlinedIcon />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Log in to access your account and career portal
            </Typography>
          </Box>
        </Stack>

        {errorMessage && (
          <AppAlert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </AppAlert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <AppInput
              label="Email Address or Username"
              type="text"
              fullWidth
              error={!!errors.emailOrUsername}
              helperText={errors.emailOrUsername?.message}
              {...register('emailOrUsername')}
            />

            <AppInput
              label="Password"
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password')}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/auth/forgot-password" style={{ textDecoration: 'none' }}>
                <Typography variant="caption" color="primary.main" fontWeight={600}>
                  Forgot Password?
                </Typography>
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isSubmitting}
              sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700 }}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="caption" color="text.secondary">
            DON'T HAVE AN ACCOUNT?
          </Typography>
        </Divider>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button
            component={Link}
            to="/auth/register/job-seeker"
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ borderRadius: '10px' }}
          >
            Job Seeker Signup
          </Button>
          <Button
            component={Link}
            to="/auth/register/employer"
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ borderRadius: '10px' }}
          >
            Employer Signup
          </Button>
        </Stack>
      </Paper>
    </>
  );
}
