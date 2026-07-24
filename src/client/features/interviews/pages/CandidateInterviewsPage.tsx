import { Container, Typography, Box, Paper, Stack, Chip, Button, CircularProgress } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useMyInterviews } from '../hooks/useInterviews';
import { SEO } from '../../../components/seo/SEO';
import { AppAlert } from '../../../components/feedback/AppAlert';

export function CandidateInterviewsPage() {
  const { data: interviews, isLoading, error } = useMyInterviews();

  return (
    <>
      <SEO title="My Scheduled Interviews — Talentra" />

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            My Scheduled Interviews
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View upcoming and past interviews with prospective employers.
          </Typography>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <AppAlert severity="error">Failed to load interviews. Please try again.</AppAlert>
        ) : !interviews || interviews.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px' }}>
            <CalendarMonthIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" fontWeight={700} gutterBottom>
              No Scheduled Interviews
            </Typography>
            <Typography variant="body2" color="text.secondary">
              When an employer schedules an interview with you, it will appear here.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {interviews.map((interview) => (
              <Paper key={interview._id} sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
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
                        variant="outlined"
                      />
                    </Stack>
                    <Typography variant="h6" fontWeight={700}>
                      {interview.job?.title || 'Job Interview'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Company: {interview.employer?.companyName || `${interview.employer?.firstName} ${interview.employer?.lastName}`}
                    </Typography>
                  </Box>

                  <Stack spacing={1} alignItems="flex-end">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarMonthIcon fontSize="small" color="action" />
                      <Typography variant="body2" fontWeight={600}>
                        {new Date(interview.scheduledAt).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(interview.scheduledAt).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        ({interview.durationMinutes} mins)
                      </Typography>
                    </Stack>

                    {interview.locationOrLink && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<VideoCallIcon />}
                        href={interview.locationOrLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ mt: 1, borderRadius: '8px' }}
                      >
                        Join Meeting
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Container>
    </>
  );
}
