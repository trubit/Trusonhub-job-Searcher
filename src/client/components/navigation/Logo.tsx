import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  clickable?: boolean;
  colorMode?: 'default' | 'light' | 'dark';
}

export function Logo({ size = 'medium', showText = true, clickable = true, colorMode = 'default' }: LogoProps) {
  const iconSizes = {
    small: { box: 34, icon: 20, font: '1.15rem' },
    medium: { box: 42, icon: 26, font: '1.4rem' },
    large: { box: 50, icon: 32, font: '1.75rem' },
  };

  const currentSize = iconSizes[size];

  const logoContent = (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25, textDecoration: 'none' }}>
      {/* Talentra Dynamic Emblem */}
      <Box
        sx={{
          position: 'relative',
          width: currentSize.box,
          height: currentSize.box,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px) scale(1.04)',
            boxShadow: '0 6px 20px rgba(124, 58, 237, 0.45)',
          },
        }}
      >
        <svg width={currentSize.icon} height={currentSize.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main T shape */}
          <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V7C20 7.55228 19.5523 8 19 8H13.5V18.5C13.5 19.3284 12.8284 20 12 20C11.1716 20 10.5 19.3284 10.5 18.5V8H5C4.44772 8 4 7.55228 4 7V6Z" fill="white"/>
          {/* Talent Sparkle Diamond Star */}
          <path d="M17 11L18.2 13.8L21 15L18.2 16.2L17 19L15.8 16.2L13 15L15.8 13.8L17 11Z" fill="#FACC15"/>
        </svg>
      </Box>

      {/* Brand Text */}
      {showText && (
        <Typography
          variant="h6"
          fontWeight={900}
          sx={{
            fontSize: currentSize.font,
            letterSpacing: '-0.5px',
            color: colorMode === 'light' ? '#FFFFFF' : 'text.primary',
            display: 'flex',
            alignItems: 'center',
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
          }}
        >
          Talent
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              ml: '1px',
            }}
          >
            ra
          </Box>
        </Typography>
      )}
    </Box>
  );

  if (clickable) {
    return <Link to="/" style={{ textDecoration: 'none' }}>{logoContent}</Link>;
  }

  return logoContent;
}
