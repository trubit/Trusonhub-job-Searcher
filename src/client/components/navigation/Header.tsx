import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Chip,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SecurityIcon from '@mui/icons-material/Security';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShieldIcon from '@mui/icons-material/Shield';
import BusinessIcon from '@mui/icons-material/Business';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { NavLink } from './NavLink';
import { MobileDrawer } from './MobileDrawer';
import { Logo } from './Logo';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { authApi } from '../../features/auth/services/authApi';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Jobs', path: '/jobs' },
  { label: 'Companies', path: '/companies' },
  { label: 'Career Resources', path: '/career-resources' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export function Header() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { toggleTheme, getEffectiveMode } = useThemeStore();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const isDark = getEffectiveMode() === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    (document.activeElement as HTMLElement)?.blur();
    setAnchorEl(null);
  };

  const handleNavigateToSessions = () => {
    handleCloseMenu();
    navigate('/auth/sessions');
  };

  const handleLogout = async () => {
    handleCloseMenu();
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
    <AppBar
      position="sticky"
      color="default"
      elevation={isScrolled ? 2 : 0}
      sx={{
        bgcolor: isScrolled ? 'background.paper' : 'transparent',
        borderBottom: '1px solid',
        borderColor: isScrolled ? 'divider' : 'transparent',
        transition: 'all 0.2s ease-in-out',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 72, justifyContent: 'space-between' }}>
          {/* Logo */}
          <Logo size="medium" />

          {/* Desktop Navigation Links */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.path} to={item.path}>
                {item.label}
              </NavLink>
            ))}
          </Stack>

          {/* Right Action Controls */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Theme Toggle */}
            <IconButton id="toggle-theme-btn" onClick={toggleTheme} color="inherit" aria-label="Toggle Theme Mode">
              {isDark ? <LightModeIcon fontSize="medium" /> : <DarkModeIcon fontSize="medium" />}
            </IconButton>

            {isAuthenticated && user ? (
              <>
                <IconButton onClick={handleOpenMenu} sx={{ p: 0.5 }} aria-label="User Account Menu">
                  <Avatar src={user.avatarUrl} alt={user.firstName} sx={{ width: 40, height: 40, bgcolor: user.role === 'EMPLOYER' ? 'secondary.main' : user.role === 'ADMIN' ? 'error.main' : 'primary.main', fontWeight: 700 }}>
                    {user.firstName.charAt(0)}
                  </Avatar>
                </IconButton>

                <Menu
                  disableRestoreFocus
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  PaperProps={{
                    sx: { minWidth: 220, borderRadius: '12px', mt: 1, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' },
                  }}
                >
                  {/* User identity header */}
                  <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.75 }}>
                      {user.email}
                    </Typography>
                    <Chip
                      label={user.role === 'JOB_SEEKER' ? '🎯 Job Seeker' : user.role === 'EMPLOYER' ? '🏢 Employer' : '🛡️ Admin'}
                      size="small"
                      color={user.role === 'JOB_SEEKER' ? 'primary' : user.role === 'EMPLOYER' ? 'secondary' : 'error'}
                      sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                    />
                  </Box>

                  {/* JOB SEEKER menu items */}
                  {user.role === 'JOB_SEEKER' && [
                    <MenuItem key="nav-profile" onClick={() => { handleCloseMenu(); navigate('/profile/me'); }} sx={{ py: 1.5 }}>
                      <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
                      My Profile & Dashboard
                    </MenuItem>,
                    <MenuItem key="nav-applications" onClick={() => { handleCloseMenu(); navigate('/applications/me'); }} sx={{ py: 1.5 }}>
                      <ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>
                      My Applications
                    </MenuItem>,
                    <MenuItem key="nav-bookmarks" onClick={() => { handleCloseMenu(); navigate('/bookmarks'); }} sx={{ py: 1.5 }}>
                      <ListItemIcon><BookmarkIcon fontSize="small" /></ListItemIcon>
                      Saved Jobs
                    </MenuItem>,
                  ]}

                  {/* EMPLOYER menu items */}
                  {(user.role === 'EMPLOYER' || user.role === 'ADMIN') && [
                    <MenuItem key="nav-ats" onClick={() => { handleCloseMenu(); navigate('/employer/ats'); }} sx={{ py: 1.5 }}>
                      <ListItemIcon><BusinessIcon fontSize="small" color="secondary" /></ListItemIcon>
                      ATS Recruitment Workspace
                    </MenuItem>,
                    <MenuItem key="nav-dashboard" onClick={() => { handleCloseMenu(); navigate('/company/dashboard'); }} sx={{ py: 1.5 }}>
                      <ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>
                      Company Dashboard
                    </MenuItem>,
                    <MenuItem key="nav-post-job" onClick={() => { handleCloseMenu(); navigate('/jobs/new'); }} sx={{ py: 1.5 }}>
                      <ListItemIcon><AddCircleIcon fontSize="small" /></ListItemIcon>
                      Post a New Job
                    </MenuItem>,
                  ]}

                  {/* ADMIN extra link */}
                  {user.email.toLowerCase() === 'trustezika831@gmail.com' && (
                    <MenuItem key="nav-admin" onClick={() => { handleCloseMenu(); navigate('/admin/dashboard'); }} sx={{ py: 1.5, color: 'error.main', fontWeight: 700 }}>
                      <ListItemIcon><ShieldIcon fontSize="small" color="error" /></ListItemIcon>
                      Admin Dashboard
                    </MenuItem>
                  )}

                  <Divider />

                  {/* Common items */}
                  <MenuItem onClick={handleNavigateToSessions} sx={{ py: 1.5 }}>
                    <ListItemIcon><SecurityIcon fontSize="small" /></ListItemIcon>
                    Active Sessions
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1.5 }}>
                    <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button component={Link} to="/auth/login" variant="text" size="medium">
                  Login
                </Button>
                <Button id="get-started-btn" component={Link} to="/auth/register/job-seeker" variant="contained" color="primary" size="medium">
                  Register
                </Button>
              </>
            )}
          </Stack>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <IconButton onClick={() => setMobileOpen(true)} aria-label="Open Mobile Menu">
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={NAV_ITEMS}
      />
    </AppBar>
  );
}
