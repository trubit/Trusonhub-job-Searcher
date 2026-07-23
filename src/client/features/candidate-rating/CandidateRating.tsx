import { Rating, Box, Typography } from '@mui/material';

interface CandidateRatingProps {
  rating: number;
  onRatingChange?: (newRating: number) => void;
  readOnly?: boolean;
}

export function CandidateRating({ rating, onRatingChange, readOnly = false }: CandidateRatingProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Rating
        value={rating}
        precision={1}
        readOnly={readOnly}
        onChange={(_e, newValue) => {
          if (newValue !== null && onRatingChange) {
            onRatingChange(newValue);
          }
        }}
      />
      <Typography variant="caption" color="text.secondary" fontWeight={700}>
        ({rating}/5)
      </Typography>
    </Box>
  );
}
