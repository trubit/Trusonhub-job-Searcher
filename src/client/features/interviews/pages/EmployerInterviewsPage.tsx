import { useState } from 'react';
import { Container, Typography, Box, Paper, Stack, Chip, Button, CircularProgress } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useMyInterviews, useUpdateInterviewStatus } from '../hooks/useInterviews';
import { SubmitFeedbackModal } from '../../interview-feedback/components/SubmitFeedbackModal';
import { SEO } from '../../../components/seo/SEO';
import { AppAlert } from '../../../components/feedback/AppAlert';

export function EmployerInterviewsPage() {
  const { data: interviews, isLoading, error } = useMyInterviews();
  const updateStatusMutation = useUpdateInterviewStatus();

  const [feedbackInterview, setFeedbackInterview] = useState<{ id: string; candidateName: string } | null>(null);

  const handleMarkCompleted = async (id: string) => {
    await updateStatusMutation.mutateAsync({ id, status: 'COMPLETED' });
  };

  return (
    <>
      <SEO title="Employer Interview Portal — Talentra" />

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Interview Management Portal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage scheduled candidate interviews, conduct evaluation scorecards, and update recruitment status.
          </Typography>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <AppAlert severity="error">Failed to load employer interviews. Please try again.</AppAlert>
        ) : !interviews || interviews.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px' }}>
            <CalendarMonthIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" fontWeight={700} gutterBottom>
              No Scheduled Interviews Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Go to your ATS Candidates Pipeline to schedule interviews with top talent.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {interviews.map((interview) => {
              const candidateName = `${interview.candidate?.firstName} ${interview.candidate?.lastName}`;
              return (
                <Paper key={interview._id} sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={2}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Chip label={interview.type} color="primary" size="small" sx={{ fontWeight: 700 }} />
                        <Chip
                          label={interview.status}
                          color={
                            interview.status === 'COMPLETED'
                              ? 'success'
                              : interview.status === 'CANCELLED'
                                ? 'error'
                                : 'info'
                          }
                          size="small"
                        />
                      </Stack>
                      <Typography variant="h6" fontWeight={700}>
                        Candidate: {candidateName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Job: {interview.job?.title || 'Job Position'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                        Scheduled for: {new Date(interview.scheduledAt).toLocaleString()} ({interview.durationMinutes} mins)
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {interview.status === 'SCHEDULED' && (
                        <Button
                          variant="outlined"
                          color="success"
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleMarkCompleted(interview._id)}
                          disabled={updateStatusMutation.isPending}
                        >
                          Mark Completed
                        </Button>
                      )}

                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<RateReviewIcon />}
                        onClick={() => setFeedbackInterview({ id: interview._id, candidateName })}
                      >
                        Submit Scorecard
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}

        {feedbackInterview && (
          <SubmitFeedbackModal
            open={!!feedbackInterview}
            onClose={() => setFeedbackInterview(null)}
            interviewId={feedbackInterview.id}
            candidateName={feedbackInterview.candidateName}
          />
        )}
      </Container>
    </>
  );
}
