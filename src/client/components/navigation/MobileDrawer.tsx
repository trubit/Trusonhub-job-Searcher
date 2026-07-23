import { Link, useNavigate } from 'react-router-dom';
import { Drawer, Box, Stack, Typography, IconButton, Button, Divider, Avatar, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BusinessIcon from '@mui/icons-material/Business';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ShieldIcon from '@mui/icons-material/Shield';
import { NavLink } from './NavLink';
import { Logo } from './Logo';
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

  const handleNav = (path: string) => {
    onClose();
    navigate(path);
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
        <Logo size="small" />
        <IconButton onClick={onClose} aria-label="Close menu">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Authenticated user identity block */}
      {isAuthenticated && user && (
        <Box sx={{ mb: 3, p: 2, borderRadius: '12px', bgcolor: 'action.hover' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <Avatar
              sx={{
                bgcolor:
                  user.role === 'EMPLOYER'
                    ? 'secondary.main'
                    : user.role === 'ADMIN'
                    ? 'error.main'
                    : 'primary.main',
                fontWeight: 700,
              }}
            >
              {user.firstName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {user.email}
              </Typography>
            </Box>
          </Stack>
          <Chip
            label={
              user.role === 'JOB_SEEKER'
                ? '🎯 Job Seeker'
                : user.role === 'EMPLOYER'
                ? '🏢 Employer'
                : '🛡️ Admin'
            }
            size="small"
            color={user.role === 'JOB_SEEKER' ? 'primary' : user.role === 'EMPLOYER' ? 'secondary' : 'error'}
            sx={{ fontWeight: 700, fontSize: '0.7rem' }}
          />
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Public nav links */}
      <Stack spacing={1} sx={{ mb: 3 }}>
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} onClick={onClose}>
            {item.label}
          </NavLink>
        ))}
      </Stack>

      {/* Role-specific quick links */}
      {isAuthenticated && user && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            My Account
          </Typography>
          <Stack spacing={1} sx={{ mb: 3 }}>
            {/* JOB SEEKER quick links */}
            {user.role === 'JOB_SEEKER' && (
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AccountCircleIcon />}
                  onClick={() => handleNav('/profile/me')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  My Profile & Dashboard
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<BookmarkIcon />}
                  onClick={() => handleNav('/bookmarks')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Saved Jobs
                </Button>
              </>
            )}

            {/* EMPLOYER quick links */}
            {(user.role === 'EMPLOYER' || user.role === 'ADMIN') && (
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  startIcon={<BusinessIcon />}
                  onClick={() => handleNav('/company/dashboard')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Company Dashboard
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  startIcon={<AddCircleIcon />}
                  onClick={() => handleNav('/jobs/new')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Post a New Job
                </Button>
              </>
            )}

            {/* Admin extra link */}
            {user.email.toLowerCase() === 'trustezika831@gmail.com' && (
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<ShieldIcon />}
                onClick={() => handleNav('/admin/dashboard')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Admin Dashboard
              </Button>
            )}
          </Stack>
        </>
      )}

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
