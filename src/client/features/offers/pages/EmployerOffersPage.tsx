import { Container, Typography, Box, Paper, Stack, Chip, Button, CircularProgress } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SendIcon from '@mui/icons-material/Send';
import { useMyOffers, useSendOffer } from '../hooks/useOffers';
import { SEO } from '../../../components/seo/SEO';
import { AppAlert } from '../../../components/feedback/AppAlert';

export function EmployerOffersPage() {
  const { data: offers, isLoading, error } = useMyOffers();
  const sendMutation = useSendOffer();

  const handleSend = async (id: string) => {
    await sendMutation.mutateAsync(id);
  };

  return (
    <>
      <SEO title="Employer Offers Dashboard — Talentra" />

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Job Offers Portal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage candidate offer letters, draft compensation packages, and track candidate acceptances.
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
              No Offers Created Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generate job offer letters directly from your Applicant Tracking System (ATS).
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {offers.map((offer) => {
              const candidateName = `${offer.candidate?.firstName} ${offer.candidate?.lastName}`;
              return (
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
                        {offer.positionTitle} — Candidate: {candidateName}
                      </Typography>
                      <Typography variant="h6" color="success.main" fontWeight={800} sx={{ mt: 0.5 }}>
                        Salary: {offer.currency} {offer.salary.toLocaleString()} / year
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Job: {offer.job?.title || 'Job Position'}
                      </Typography>
                    </Box>

                    {offer.status === 'DRAFT' && (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SendIcon />}
                        onClick={() => handleSend(offer._id)}
                        disabled={sendMutation.isPending}
                      >
                        Send Formal Offer
                      </Button>
                    )}
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Container>
    </>
  );
}
