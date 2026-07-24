import { useState } from 'react';
import { Container, Typography, Box, Paper, Stack, Chip, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useMyOffers, useAcceptOffer, useDeclineOffer } from '../hooks/useOffers';
import { SEO } from '../../../components/seo/SEO';
import { AppAlert } from '../../../components/feedback/AppAlert';

export function CandidateOffersPage() {
  const { data: offers, isLoading, error } = useMyOffers();
  const acceptMutation = useAcceptOffer();
  const declineMutation = useDeclineOffer();

  const [declineOfferId, setDeclineOfferId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  const handleAccept = async (id: string) => {
    await acceptMutation.mutateAsync(id);
  };

  const handleDeclineConfirm = async () => {
    if (!declineOfferId) return;
    await declineMutation.mutateAsync({ id: declineOfferId, reason: declineReason });
    setDeclineOfferId(null);
    setDeclineReason('');
  };

  return (
    <>
      <SEO title="My Job Offers — Talentra" />

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            My Job Offers
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review formal job offers, terms, compensation packages, and accept or decline.
          </Typography>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <AppAlert severity="error">Failed to load job offers. Please try again.</AppAlert>
        ) : !offers || offers.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px' }}>
            <LocalOfferIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" fontWeight={700} gutterBottom>
              No Job Offers Received Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              When an employer extends a job offer to you, it will be listed here.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {offers.map((offer) => (
              <Paper key={offer._id} sx={{ p: 3.5, borderRadius: '20px', boxShadow: '0 6px 24px rgba(0,0,0,0.06)' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-start' }} spacing={2}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Chip
                        label={offer.status}
                        color={
                          offer.status === 'ACCEPTED'
                            ? 'success'
                            : offer.status === 'SENT'
                              ? 'primary'
                              : offer.status === 'DECLINED'
                                ? 'error'
                                : 'default'
                        }
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </Stack>
                    <Typography variant="h5" fontWeight={800}>
                      {offer.positionTitle}
                    </Typography>
                    <Typography variant="body1" color="primary.main" fontWeight={700} sx={{ mt: 0.5 }}>
                      Company: {offer.employer?.companyName || `${offer.employer?.firstName} ${offer.employer?.lastName}`}
                    </Typography>
                    <Typography variant="h6" color="success.main" fontWeight={800} sx={{ mt: 1 }}>
                      Salary: {offer.currency} {offer.salary.toLocaleString()} / year
                    </Typography>

                    {offer.benefits && offer.benefits.length > 0 && (
                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2, gap: 0.8 }}>
                        {offer.benefits.map((b, i) => (
                          <Chip key={i} label={b} variant="outlined" size="small" />
                        ))}
                      </Stack>
                    )}

                    {offer.terms && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                        Terms: "{offer.terms}"
                      </Typography>
                    )}
                  </Box>

                  {offer.status === 'SENT' && (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => setDeclineOfferId(offer._id)}
                      >
                        Decline
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleAccept(offer._id)}
                        disabled={acceptMutation.isPending}
                      >
                        Accept Offer
                      </Button>
                    </Stack>
                  )}
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}

        <Dialog open={!!declineOfferId} onClose={() => setDeclineOfferId(null)} maxWidth="xs" fullWidth>
          <DialogTitle fontWeight={700}>Decline Job Offer</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Optional: Provide a reason for declining this offer.
            </Typography>
            <TextField
              label="Reason for declining"
              multiline
              rows={3}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              fullWidth
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeclineOfferId(null)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleDeclineConfirm} variant="contained" color="error" disabled={declineMutation.isPending}>
              Confirm Decline
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
