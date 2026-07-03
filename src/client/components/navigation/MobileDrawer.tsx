import { Link, useNavigate } from 'react-router-dom';
import { Drawer, Box, Stack, Typography, IconButton, Button, Divider, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import WorkIcon from '@mui/icons-material/Work';
import LogoutIcon from '@mui/icons-material/Logout';
import { NavLink } from './NavLink';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { authApi } from '../../features/auth/services/authApi';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  navItems: Array<{ label: string; path: string }>;
}

export function MobileDrawer({ open, onClose, navItems }: MobileDrawerProps) {
  const navigate = useNavigate();
  const { toggleTheme, getEffectiveMode } = useThemeStore();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const isDark = getEffectiveMode() === 'dark';

  const handleLogout = async () => {
    onClose();
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      clearAuth();
      navigate('/auth/login');
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '85vw', sm: 320 }, p: 3 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <WorkIcon sx={{ fontSize: 18 }} />
          </Box>
          <Typography variant="h6" fontWeight={700}>
            TrusonHub
          </Typography>
        </Stack>
        <IconButton onClick={onClose} aria-label="Close menu">
          <CloseIcon />
        </IconButton>
      </Box>

      {isAuthenticated && user && (
        <Box sx={{ mb: 3, p: 2, borderRadius: '12px', bgcolor: 'action.hover' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700 }}>
              {user.firstName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {user.role}
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={1} sx={{ mb: 4 }}>
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} onClick={onClose}>
            {item.label}
          </NavLink>
        ))}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={2}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={isDark ? <LightModeIcon /> : <DarkModeIcon />}
          onClick={toggleTheme}
        >
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </Button>

        {isAuthenticated ? (
          <Button
            fullWidth
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        ) : (
          <>
            <Button
              component={Link}
              to="/auth/login"
              onClick={onClose}
              fullWidth
              variant="outlined"
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/auth/register/job-seeker"
              onClick={onClose}
              fullWidth
              variant="contained"
              color="primary"
            >
              Register
            </Button>
          </>
        )}
      </Stack>
    </Drawer>
  );
}
