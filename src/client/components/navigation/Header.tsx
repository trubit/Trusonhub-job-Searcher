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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import WorkIcon from '@mui/icons-material/Work';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SecurityIcon from '@mui/icons-material/Security';
import { NavLink } from './NavLink';
import { MobileDrawer } from './MobileDrawer';
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
    setAnchorEl(null);
  };

  const handleNavigateToProfile = () => {
    handleCloseMenu();
    if (user?.role === 'EMPLOYER' || user?.role === 'ADMIN') {
      navigate('/company/dashboard');
    } else {
      navigate('/profile/me');
    }
  };

  const handleNavigateToSessions = () => {
    handleCloseMenu();
    navigate('/profile/me');
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
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'text.primary' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '10px', bgcolor: 'primary.main', color: '#fff' }}>
              <WorkIcon fontSize="medium" />
            </Box>
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
              Truson<span style={{ color: '#1976d2' }}>Hub</span>
            </Typography>
          </Box>

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
            <IconButton onClick={toggleTheme} color="inherit" aria-label="Toggle Theme Mode">
              {isDark ? <LightModeIcon fontSize="medium" /> : <DarkModeIcon fontSize="medium" />}
            </IconButton>

            {isAuthenticated && user ? (
              <>
                <IconButton onClick={handleOpenMenu} sx={{ p: 0.5 }} aria-label="User Account Menu">
                  <Avatar src={user.avatarUrl} alt={user.firstName} sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontWeight: 700 }}>
                    {user.firstName.charAt(0)}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  PaperProps={{
                    sx: { minWidth: 200, borderRadius: '12px', mt: 1, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {user.email}
                    </Typography>
                  </Box>
                  <MenuItem onClick={handleNavigateToProfile} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    My Profile
                  </MenuItem>
                  <MenuItem onClick={handleNavigateToSessions} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                      <SecurityIcon fontSize="small" />
                    </ListItemIcon>
                    Active Sessions
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1.5 }}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button component={Link} to="/auth/login" variant="text" size="medium">
                  Login
                </Button>
                <Button component={Link} to="/auth/register/job-seeker" variant="contained" color="primary" size="medium">
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
