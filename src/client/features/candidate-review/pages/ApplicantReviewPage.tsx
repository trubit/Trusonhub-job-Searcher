import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Stack,
  Chip,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlagIcon from '@mui/icons-material/Flag';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EventIcon from '@mui/icons-material/Event';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useState } from 'react';
import { useAtsApplication, useUpdateAtsStatus, useUpdateAtsRating, useToggleAtsFlag } from '../../ats/hooks/useAts';
import { CandidateRating } from '../../candidate-rating/CandidateRating';
import { CandidateNotes } from '../../candidate-notes/CandidateNotes';
import { ScheduleInterviewModal } from '../../interviews/components/ScheduleInterviewModal';
import { CreateOfferModal } from '../../offers/components/CreateOfferModal';
import { SEO } from '../../../components/seo/SEO';

export function ApplicantReviewPage() {
  const { id } = useParams<{ id: string }>();
  const { data: application, isLoading } = useAtsApplication(id || '');

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  const updateStatusMutation = useUpdateAtsStatus();
  const updateRatingMutation = useUpdateAtsRating();
  const toggleFlagMutation = useToggleAtsFlag();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!application) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Application Not Found
        </Typography>
        <Button variant="contained" component={Link} to="/employer/ats">
          Back to ATS Dashboard
        </Button>
      </Container>
    );
  }

  const applicant = application.applicant as unknown as {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatarUrl?: string;
    phone?: string;
    location?: string;
    headline?: string;
  };

  const handleStageMove = (newStatus: string) => {
    if (!id) return;
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <SEO
        title={`Review Candidate: ${applicant?.firstName || ''} ${applicant?.lastName || ''} | Talentra`}
        description="Candidate profile review and ATS stage evaluation"
      />

      <Button startIcon={<ArrowBackIcon />} component={Link} to="/employer/ats" sx={{ mb: 3 }}>
        Back to ATS Pipeline
      </Button>

      {/* Header Bar */}
      <Paper sx={{ p: 4, borderRadius: '24px', mb: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Avatar src={applicant?.avatarUrl} sx={{ width: 72, height: 72, fontSize: '1.75rem', bgcolor: 'primary.main' }}>
                {applicant?.firstName?.[0]}
              </Avatar>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h4" fontWeight={800}>
                    {applicant?.firstName} {applicant?.lastName}
                  </Typography>
                  <IconButton
                    color={application.flagged ? 'error' : 'default'}
                    onClick={() => toggleFlagMutation.mutate({ id: application._id, flagged: !application.flagged })}
                  >
                    <FlagIcon />
                  </IconButton>
                </Stack>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                  {applicant?.headline || 'Candidate Professional'}
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Typography variant="caption" color="text.secondary">
                    📧 {applicant?.email}
                  </Typography>
                  {applicant?.phone && (
                    <Typography variant="caption" color="text.secondary">
                      📞 {applicant?.phone}
                    </Typography>
                  )}
                  {applicant?.location && (
                    <Typography variant="caption" color="text.secondary">
                      📍 {applicant?.location}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" fontWeight={700}>
                  Stage:
                </Typography>
                <Chip label={application.status.replace(/_/g, ' ')} color="primary" sx={{ fontWeight: 800 }} />
              </Stack>
              <CandidateRating
                rating={application.rating || 0}
                onRatingChange={(newRating) => updateRatingMutation.mutate({ id: application._id, rating: newRating })}
              />
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleStageMove('SHORTLISTED')}
                >
                  Shortlist
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="info"
                  startIcon={<EventIcon />}
                  onClick={() => setScheduleModalOpen(true)}
                >
                  Schedule Interview
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<LocalOfferIcon />}
                  onClick={() => setOfferModalOpen(true)}
                >
                  Generate Offer
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => handleStageMove('REJECTED')}
                >
                  Reject
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Review Grid */}
      <Grid container spacing={4}>
        {/* Left Column: Cover Letter & Resume */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={4}>
            {/* Resume Card */}
            <Paper sx={{ p: 4, borderRadius: '24px' }}>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Submitted Resume
              </Typography>
              <Divider sx={{ my: 2 }} />
              {application.resumeUrl ? (
                <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2, borderRadius: '12px', bgcolor: 'background.surface' }}>
                  <PictureAsPdfIcon color="error" sx={{ fontSize: 36 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Candidate Resume Document
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      PDF Document
                    </Typography>
                  </Box>
                  <Button variant="outlined" component="a" href={application.resumeUrl} target="_blank" download>
                    View / Download Resume
                  </Button>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No resume document attached.
                </Typography>
              )}
            </Paper>

            {/* Cover Letter Card */}
            <Paper sx={{ p: 4, borderRadius: '24px' }}>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Cover Letter
              </Typography>
              <Divider sx={{ my: 2 }} />
              {application.coverLetter ? (
                <Typography variant="body1" sx={{ whitespace: 'pre-wrap', lineHeight: 1.8 }}>
                  {application.coverLetter}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No cover letter provided.
                </Typography>
              )}
            </Paper>
          </Stack>
        </Grid>

        {/* Right Column: Internal Evaluation Notes */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 4, borderRadius: '24px' }}>
            <CandidateNotes applicationId={application._id} />
          </Paper>
        </Grid>
      </Grid>

      {scheduleModalOpen && (
        <ScheduleInterviewModal
          open={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          applicationId={application._id}
          candidateName={`${applicant?.firstName} ${applicant?.lastName}`}
        />
      )}

      {offerModalOpen && (
        <CreateOfferModal
          open={offerModalOpen}
          onClose={() => setOfferModalOpen(false)}
          applicationId={application._id}
          candidateName={`${applicant?.firstName} ${applicant?.lastName}`}
          defaultPosition={(application.job as unknown as { title?: string })?.title}
        />
      )}
    </Container>
  );
}
