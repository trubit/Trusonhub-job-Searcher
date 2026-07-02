import { Drawer, Box, Stack, Typography, IconButton, Button, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import WorkIcon from '@mui/icons-material/Work';
import { NavLink } from './NavLink';
import { useThemeStore } from '../../store/themeStore';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  navItems: Array<{ label: string; path: string }>;
}

export function MobileDrawer({ open, onClose, navItems }: MobileDrawerProps) {
  const { toggleTheme, getEffectiveMode } = useThemeStore();
  const isDark = getEffectiveMode() === 'dark';

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
        <Button fullWidth variant="outlined">
          Login
        </Button>
        <Button fullWidth variant="contained" color="primary">
          Register
        </Button>
      </Stack>
    </Drawer>
  );
}
