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
import { useScheduleInterview } from '../hooks/useInterviews';
import { InterviewType } from '../types/interview.types';
import { AppAlert } from '../../../components/feedback/AppAlert';

interface ScheduleInterviewModalProps {
  open: boolean;
  onClose: () => void;
  applicationId: string;
  candidateName: string;
}

export function ScheduleInterviewModal({ open, onClose, applicationId, candidateName }: ScheduleInterviewModalProps) {
  const [type, setType] = useState<InterviewType>('VIDEO');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [locationOrLink, setLocationOrLink] = useState('https://meet.google.com/abc-defg-hij');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scheduleMutation = useScheduleInterview();

  const handleSubmit = async () => {
    if (!scheduledAt) {
      setErrorMessage('Please select an interview date and time.');
      return;
    }

    setErrorMessage(null);
    try {
      const dateIso = new Date(scheduledAt).toISOString();
      await scheduleMutation.mutateAsync({
        applicationId,
        type,
        scheduledAt: dateIso,
        durationMinutes: Number(durationMinutes),
        locationOrLink,
        notes,
      });
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setErrorMessage(axiosErr.response?.data?.message || 'Failed to schedule interview');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={700}>Schedule Interview — {candidateName}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {errorMessage && <AppAlert severity="error">{errorMessage}</AppAlert>}

          <TextField
            select
            label="Interview Type"
            value={type}
            onChange={(e) => setType(e.target.value as InterviewType)}
            fullWidth
          >
            <MenuItem value="PHONE">Phone Screening</MenuItem>
            <MenuItem value="VIDEO">Video Call</MenuItem>
            <MenuItem value="TECHNICAL">Technical Interview</MenuItem>

            <MenuItem value="HR">HR Interview</MenuItem>
            <MenuItem value="PANEL">Panel Interview</MenuItem>
            <MenuItem value="FINAL">Final Interview</MenuItem>
            <MenuItem value="ONSITE">On-site Interview</MenuItem>
          </TextField>

          <TextField
            label="Date & Time"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="Duration (Minutes)"
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            fullWidth
          />

          <TextField
            label="Meeting Link / Location"
            value={locationOrLink}
            onChange={(e) => setLocationOrLink(e.target.value)}
            fullWidth
          />

          <TextField
            label="Notes / Instructions for Candidate"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
          disabled={scheduleMutation.isPending}
          startIcon={scheduleMutation.isPending ? <CircularProgress size={18} /> : undefined}
        >
          {scheduleMutation.isPending ? 'Scheduling...' : 'Confirm Schedule'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
