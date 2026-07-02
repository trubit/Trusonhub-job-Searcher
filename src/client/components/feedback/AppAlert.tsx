import { Alert, AlertTitle, AlertProps } from '@mui/material';

export interface AppAlertProps extends AlertProps {
  title?: string;
}

export function AppAlert({ title, severity = 'info', children, sx, ...props }: AppAlertProps) {
  return (
    <Alert
      severity={severity}
      sx={{
        borderRadius: '10px',
        fontWeight: 500,
        ...sx,
      }}
      {...props}
    >
      {title && <AlertTitle fontWeight={700}>{title}</AlertTitle>}
      {children}
    </Alert>
  );
}
