import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export interface AppModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: 'confirmation' | 'information' | 'warning';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function AppModal({
  open,
  onClose,
  title,
  children,
  variant = 'information',
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: AppModalProps) {
  let icon = <InfoOutlinedIcon color="primary" sx={{ fontSize: 32 }} />;
  let confirmColor: 'primary' | 'error' | 'success' = 'primary';

  if (variant === 'warning') {
    icon = <WarningAmberIcon color="warning" sx={{ fontSize: 32 }} />;
    confirmColor = 'error';
  } else if (variant === 'confirmation') {
    icon = <CheckCircleOutlineIcon color="success" sx={{ fontSize: 32 }} />;
    confirmColor = 'success';
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ m: 0, p: 3, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {icon}
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
        </Box>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 1 }}>{children}</DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        {variant !== 'information' && (
          <Button variant="outlined" onClick={onClose} color="inherit">
            {cancelText}
          </Button>
        )}
        <Button
          variant="contained"
          color={confirmColor}
          onClick={() => {
            if (onConfirm) onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
