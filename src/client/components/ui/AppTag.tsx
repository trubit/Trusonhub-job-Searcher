import { Box, Typography } from '@mui/material';

export interface AppTagProps {
  label: string;
  onClick?: () => void;
  selected?: boolean;
}

export function AppTag({ label, onClick, selected = false }: AppTagProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1.5,
        py: 0.5,
        borderRadius: '16px',
        border: '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected ? 'primary.main' : 'transparent',
        color: selected ? '#fff' : 'text.secondary',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        '&:hover': onClick
          ? {
              borderColor: 'primary.main',
              color: selected ? '#fff' : 'primary.main',
            }
          : undefined,
      }}
    >
      <Typography variant="caption" fontWeight={600}>
        {label}
      </Typography>
    </Box>
  );
}
