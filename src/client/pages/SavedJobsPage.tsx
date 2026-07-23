import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Stack,
  Box,
  Button,
  Grid,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SEO } from '../components/seo/SEO';
import { jobApi, JobData } from '../features/jobs/services/jobApi';

export function SavedJobsPage() {
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<Array<{ _id: string; job: JobData; createdAt: string }>>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const data = await jobApi.getBookmarks();
      setSavedJobs(data.filter((b) => b.job) || []);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setErrorMessage(ax.response?.data?.message || 'Failed to fetch saved jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemove = async (jobId: string) => {
    try {
      await jobApi.unbookmarkJob(jobId);
      setSavedJobs((prev) => prev.filter((b) => b.job?._id !== jobId));
    } catch {
      setErrorMessage('Failed to remove bookmark.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <SEO title="My Bookmarked Jobs | Talentra" description="View and manage your bookmarked jobs on Talentra" />
      
      <Button startIcon={<ArrowBackIcon />} component={Link} to="/jobs" sx={{ mb: 4 }}>
        Find More Jobs
      </Button>

      <Typography variant="h4" fontWeight={800} gutterBottom>
        Saved Openings
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Here are the opportunities you have bookmarked. Keep track of deadlines and apply when ready.
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {savedJobs.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            You haven't bookmarked any jobs yet.
          </Typography>
          <Button component={Link} to="/jobs" variant="contained">
            Search Jobs
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2.5}>
          {savedJobs.map((item) => {
            const job = item.job;
            return (
              <Paper
                key={item._id}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s',
                  '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.06)' },
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={job.company?.logoUrl} variant="rounded">
                        {job.company?.name ? job.company.name.charAt(0) : 'J'}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={800}
                          component={Link}
                          to={`/jobs/${job.slug}`}
                          sx={{ textDecoration: 'none', color: 'text.primary', '&:hover': { color: 'primary.main' } }}
                        >
                          {job.title}
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight={700}>
                          {job.company?.name}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                          <Chip icon={<LocationOnIcon fontSize="small" />} label={`${job.city}, ${job.country}`} size="small" variant="outlined" />
                          <Chip label={job.employmentType} size="small" />
                          <Chip label={job.remoteOption} size="small" />
                        </Stack>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
                      <Button
                        size="small"
                        color="secondary"
                        startIcon={<BookmarkIcon />}
                        onClick={() => handleRemove(job._id)}
                      >
                        Remove
                      </Button>
                      <Button
                        component={Link}
                        to={`/jobs/${job.slug}`}
                        variant="contained"
                        size="small"
                      >
                        View Details
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Container>
  );
}
