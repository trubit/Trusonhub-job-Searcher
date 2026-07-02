import { Link, useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useThemeStore } from '../../store/themeStore';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function NavLink({ to, children, onClick }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  const { getEffectiveMode } = useThemeStore();
  const isDark = getEffectiveMode() === 'dark';

  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        textDecoration: 'none',
        position: 'relative',
        padding: '6px 12px',
        borderRadius: '6px',
        transition: 'color 0.2s ease, background-color 0.2s ease',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: isActive ? 600 : 500,
          color: isActive
            ? 'primary.main'
            : isDark
            ? 'text.primary'
            : 'text.secondary',
          '&:hover': {
            color: 'primary.main',
          },
        }}
      >
        {children}
      </Typography>
    </Link>
  );
}
