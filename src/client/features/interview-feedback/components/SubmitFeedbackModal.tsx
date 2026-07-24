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
  Rating,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { useSubmitInterviewFeedback } from '../../interviews/hooks/useInterviews';
import { AppAlert } from '../../../components/feedback/AppAlert';

interface SubmitFeedbackModalProps {
  open: boolean;
  onClose: () => void;
  interviewId: string;
  candidateName: string;
}

export function SubmitFeedbackModal({ open, onClose, interviewId, candidateName }: SubmitFeedbackModalProps) {
  const [overallRating, setOverallRating] = useState<number>(4);
  const [recommendation, setRecommendation] = useState<
    'STRONG_HIRE' | 'RECOMMEND_HIRE' | 'NEUTRAL' | 'REJECT' | 'ANOTHER_INTERVIEW'
  >('RECOMMEND_HIRE');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [comments, setComments] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const feedbackMutation = useSubmitInterviewFeedback();

  const handleSubmit = async () => {
    setErrorMessage(null);
    try {
      await feedbackMutation.mutateAsync({
        id: interviewId,
        payload: {
          overallRating,
          recommendation,
          strengths,
          weaknesses,
          comments,
        },
      });
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setErrorMessage(axiosErr.response?.data?.message || 'Failed to submit scorecard feedback');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={700}>Interview Scorecard — {candidateName}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {errorMessage && <AppAlert severity="error">{errorMessage}</AppAlert>}

          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Overall Rating
            </Typography>
            <Rating
              value={overallRating}
              onChange={(_, val) => setOverallRating(val || 3)}
              precision={1}
              size="large"
            />
          </Box>

          <TextField
            select
            label="Recommendation"
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value as never)}
            fullWidth
          >
            <MenuItem value="STRONG_HIRE">Strong Hire ⭐⭐⭐⭐⭐</MenuItem>
            <MenuItem value="RECOMMEND_HIRE">Recommend Hire ⭐⭐⭐⭐</MenuItem>
            <MenuItem value="NEUTRAL">Neutral / Needs Review ⭐⭐⭐</MenuItem>
            <MenuItem value="ANOTHER_INTERVIEW">Request Another Interview 🔄</MenuItem>

            <MenuItem value="REJECT">Reject ❌</MenuItem>
          </TextField>

          <TextField
            label="Candidate Strengths"
            multiline
            rows={2}
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            fullWidth
          />

          <TextField
            label="Areas for Improvement / Weaknesses"
            multiline
            rows={2}
            value={weaknesses}
            onChange={(e) => setWeaknesses(e.target.value)}
            fullWidth
          />

          <TextField
            label="Private Notes & Comments"
            multiline
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
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
          disabled={feedbackMutation.isPending}
          startIcon={feedbackMutation.isPending ? <CircularProgress size={18} /> : undefined}
        >
          {feedbackMutation.isPending ? 'Submitting...' : 'Submit Scorecard'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
