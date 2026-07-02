import { Button, ButtonProps, CircularProgress } from '@mui/material';

export interface AppButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outlined' | 'ghost' | 'success' | 'danger';
  isLoading?: boolean;
}

export function AppButton({
  variant = 'primary',
  isLoading = false,
  children,
  disabled,
  sx,
  ...props
}: AppButtonProps) {
  let muiVariant: ButtonProps['variant'] = 'contained';
  let colorProp: ButtonProps['color'] = 'primary';
  const customSx = {};

  switch (variant) {
    case 'primary':
      muiVariant = 'contained';
      colorProp = 'primary';
      break;
    case 'secondary':
      muiVariant = 'contained';
      colorProp = 'secondary';
      break;
    case 'outlined':
      muiVariant = 'outlined';
      colorProp = 'primary';
      break;
    case 'ghost':
      muiVariant = 'text';
      colorProp = 'inherit';
      break;
    case 'success':
      muiVariant = 'contained';
      colorProp = 'success';
      break;
    case 'danger':
      muiVariant = 'contained';
      colorProp = 'error';
      break;
  }

  return (
    <Button
      variant={muiVariant}
      color={colorProp}
      disabled={disabled || isLoading}
      sx={{
        position: 'relative',
        ...customSx,
        ...sx,
      }}
      {...props}
    >
      {isLoading ? (
        <>
          <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
          <span style={{ opacity: 0.8 }}>Loading...</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
