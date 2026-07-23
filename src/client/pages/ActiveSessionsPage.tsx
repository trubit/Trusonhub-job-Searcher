import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Stack,
  Box,
  Button,
  Grid,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';
import ComputerIcon from '@mui/icons-material/Computer';
import DevicesIcon from '@mui/icons-material/Devices';
import { SEO } from '../components/seo/SEO';
import { authApi } from '../features/auth/services/authApi';
import { SessionInfo } from '../features/auth/types/auth.types';
import { useAuthStore } from '../features/auth/store/useAuthStore';

export function ActiveSessionsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await authApi.getActiveSessions();
      setSessions(data || []);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setErrorMessage(ax.response?.data?.message || 'Failed to fetch active sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevoke = async (sessionId: string) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      await authApi.revokeSession(sessionId);
      setSuccessMessage('Session revoked successfully.');
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch {
      setErrorMessage('Failed to revoke session. Please try again.');
    }
  };

  const handleRevokeAllOther = async () => {
    if (!window.confirm('Are you sure you want to log out of all other devices?')) return;
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      const otherSessions = sessions.filter((s) => !s.isCurrent);
      await Promise.all(otherSessions.map((s) => authApi.revokeSession(s.id)));
      setSuccessMessage('Logged out of all other sessions.');
      // Keep only current session
      setSessions((prev) => prev.filter((s) => s.isCurrent));
    } catch {
      setErrorMessage('Failed to revoke other sessions.');
    }
  };

  const handleBack = () => {
    if (user?.role === 'EMPLOYER' || user?.role === 'ADMIN') {
      navigate('/company/dashboard');
    } else {
      navigate('/profile/me');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <SEO title="Active Sessions & Security | Talentra" description="Manage active login sessions for your Talentra account." />

      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 4 }}>
        Back to Dashboard
      </Button>

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SecurityIcon color="primary" sx={{ fontSize: 36 }} />
            Active Security Sessions
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            These are the devices that have logged into your account. Terminate any sessions you don't recognize.
          </Typography>
        </Box>
        {sessions.length > 1 && (
          <Button variant="outlined" color="error" onClick={handleRevokeAllOther} sx={{ fontWeight: 700 }}>
            Sign Out All Other Devices
          </Button>
        )}
      </Stack>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
          {successMessage}
        </Alert>
      )}

      <Stack spacing={2.5}>
        {sessions.map((session) => (
          <Paper
            key={session.id}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: session.isCurrent ? 'primary.200' : 'divider',
              boxShadow: session.isCurrent ? '0 4px 20px rgba(59, 130, 246, 0.05)' : 'none',
              bgcolor: session.isCurrent ? 'background.surface' : 'background.paper',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 8 }}>
                <Stack direction="row" spacing={2.5} alignItems="center">
                  <Avatar sx={{ bgcolor: session.isCurrent ? 'primary.50' : 'action.hover', color: session.isCurrent ? 'primary.main' : 'text.secondary', width: 48, height: 48, borderRadius: '12px' }}>
                    {session.os.toLowerCase().includes('windows') || session.os.toLowerCase().includes('mac') ? <ComputerIcon /> : <DevicesIcon />}
                  </Avatar>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle1" fontWeight={800}>
                        {session.os} • {session.browser}
                      </Typography>
                      {session.isCurrent && (
                        <Chip label="Current Device" color="success" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      IP Address: <strong>{session.ipAddress}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                      Last active: {new Date(session.lastActivityAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Stack direction="row" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
                  {!session.isCurrent && (
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => handleRevoke(session.id)}
                      sx={{ fontWeight: 700 }}
                    >
                      Revoke Access
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}
