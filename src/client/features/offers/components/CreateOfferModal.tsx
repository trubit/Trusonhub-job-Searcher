import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useCreateOffer } from '../hooks/useOffers';
import { AppAlert } from '../../../components/feedback/AppAlert';

interface CreateOfferModalProps {
  open: boolean;
  onClose: () => void;
  applicationId: string;
  candidateName: string;
  defaultPosition?: string;
}

export function CreateOfferModal({
  open,
  onClose,
  applicationId,
  candidateName,
  defaultPosition = 'Senior Software Engineer',
}: CreateOfferModalProps) {
  const [positionTitle, setPositionTitle] = useState(defaultPosition);
  const [salary, setSalary] = useState(125000);
  const [currency, setCurrency] = useState('USD');
  const [benefits, setBenefits] = useState('Health Insurance, 401(k) Matching, Unlimited PTO, Remote Stipend');
  const [startDate, setStartDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [terms, setTerms] = useState(
    'Employment is at-will. Standard 90-day probationary period applies. IP and confidentiality agreements required.'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createOfferMutation = useCreateOffer();

  const handleSubmit = async () => {
    if (!startDate || !expirationDate) {
      setErrorMessage('Please specify start date and offer expiration date.');
      return;
    }

    setErrorMessage(null);
    try {
      const benefitsArray = benefits
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean);

      await createOfferMutation.mutateAsync({
        applicationId,
        positionTitle,
        salary: Number(salary),
        currency,
        benefits: benefitsArray,
        startDate: new Date(startDate).toISOString(),
        expirationDate: new Date(expirationDate).toISOString(),
        terms,
      });
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setErrorMessage(axiosErr.response?.data?.message || 'Failed to generate job offer');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={700}>Generate Job Offer — {candidateName}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {errorMessage && <AppAlert severity="error">{errorMessage}</AppAlert>}

          <TextField
            label="Position Title"
            value={positionTitle}
            onChange={(e) => setPositionTitle(e.target.value)}
            fullWidth
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Base Salary"
              type="number"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              fullWidth
            />
            <TextField select label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} sx={{ minWidth: 120 }}>
              <MenuItem value="USD">USD ($)</MenuItem>
              <MenuItem value="EUR">EUR (€)</MenuItem>
              <MenuItem value="GBP">GBP (£)</MenuItem>

              <MenuItem value="CAD">CAD ($)</MenuItem>
            </TextField>
          </Stack>

          <TextField
            label="Key Benefits (comma separated)"
            multiline
            rows={2}
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            fullWidth
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Anticipated Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Offer Expiration Date"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>

          <TextField
            label="Offer Terms & Conditions"
            multiline
            rows={3}
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={createOfferMutation.isPending}
          startIcon={createOfferMutation.isPending ? <CircularProgress size={18} /> : undefined}
        >
          {createOfferMutation.isPending ? 'Generating...' : 'Save Draft Offer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
