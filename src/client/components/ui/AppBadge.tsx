import { Chip, ChipProps } from '@mui/material';

export interface AppBadgeProps extends Omit<ChipProps, 'color'> {
  variantStyle?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export function AppBadge({
  variantStyle = 'primary',
  label,
  size = 'small',
  sx,
  ...props
}: AppBadgeProps) {
  let colorProp: ChipProps['color'] = 'primary';
  const variantProp: ChipProps['variant'] = 'filled';

  if (variantStyle === 'neutral') {
    colorProp = 'default';
  } else {
    colorProp = variantStyle as ChipProps['color'];
  }

  return (
    <Chip
      label={label}
      color={colorProp}
      variant={variantProp}
      size={size}
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
        borderRadius: '6px',
        ...sx,
      }}
      {...props}
    />
  );
}
