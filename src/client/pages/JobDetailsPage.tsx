import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Stack,
  Box,
  Divider,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SEO } from '../components/seo/SEO';
import { jobApi, JobData } from '../features/jobs/services/jobApi';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { resumeApi, ResumeItem } from '../features/resume/services/resumeApi';
import { applicationApi, JobApplicationData } from '../features/applications/services/applicationApi';

export function JobDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<JobData | null>(null);
  const [similarJobs, setSimilarJobs] = useState<JobData[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Application States
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [myApplication, setMyApplication] = useState<JobApplicationData | null>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);

  const loadData = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const data = await jobApi.getJobDetails(slug);
      setJob(data);

      try {
        const similarRes = await jobApi.searchJobs({ limit: 5 });
        setSimilarJobs((similarRes.jobs || []).filter((j) => j._id !== data._id).slice(0, 3));
      } catch {
        // Non-critical
      }

      if (isAuthenticated) {
        // Fetch bookmarks
        const bookmarkData = await jobApi.getBookmarks();
        setBookmarks(bookmarkData.map((b) => b.job?._id));

        // If Job Seeker, fetch resumes and applications to see if already applied
        if (user?.role === 'JOB_SEEKER') {
          const [resumesList, applicationsList] = await Promise.all([
            resumeApi.getResumes(),
            applicationApi.getMyApplications(),
          ]);
          setResumes(resumesList || []);
          
          // Auto select primary resume
          const primary = resumesList.find((r) => r.isPrimary) || resumesList[0];
          if (primary) {
            setSelectedResume(primary._id);
          }

          const existingApp = applicationsList.find((app) => app.job?._id === data._id);
          if (existingApp) {
            setMyApplication(existingApp);
          }
        }
      }
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setErrorMsg(ax.response?.data?.message || 'Failed to fetch job details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [slug, isAuthenticated, user]);

  const toggleBookmark = async () => {
    if (!job || !isAuthenticated) return;
    try {
      if (bookmarks.includes(job._id)) {
        await jobApi.unbookmarkJob(job._id);
        setBookmarks((prev) => prev.filter((id) => id !== job._id));
      } else {
        await jobApi.bookmarkJob(job._id);
        setBookmarks((prev) => [...prev, job._id]);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    if (user?.role !== 'JOB_SEEKER') {
      alert('Only Job Seekers can apply to jobs.');
      return;
    }
    setApplyDialogOpen(true);
  };

  const handleApplySubmit = async () => {
    if (!job || !selectedResume) return;
    try {
      setSubmitting(true);
      setApplicationError(null);
      const app = await applicationApi.applyToJob(job._id, selectedResume, coverLetter);
      setMyApplication(app);
      setApplyDialogOpen(false);
      alert('Your job application has been submitted successfully!');
    } catch (err: any) {
      setApplicationError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (errorMsg || !job) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" variant="filled">
          {errorMsg || 'Job listing not found.'}
        </Alert>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/jobs')} variant="contained">
            Back to Job Search
          </Button>
        </Box>
      </Container>
    );
  }

  const isBookmarked = bookmarks.includes(job._id);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <SEO
        title={`${job.title} at ${job.company?.name} | TrusonHub`}
        description={job.description.substring(0, 150)}
      />
      
      <Button startIcon={<ArrowBackIcon />} component={Link} to="/jobs" sx={{ mb: 4 }}>
        Back to Job Listings
      </Button>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', border: '1px solid', borderColor: 'divider', mb: 4 }}>
            <Stack direction="row" spacing={3} alignItems="flex-start" sx={{ mb: 3 }}>
              <Avatar
                src={job.company?.logoUrl}
                variant="rounded"
                sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32, fontWeight: 800 }}
              >
                {job.company?.name ? job.company.name.charAt(0) : 'J'}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                  {job.title}
                </Typography>
                <Typography variant="h6" color="primary.main" fontWeight={700} gutterBottom>
                  {job.company?.name}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                    <LocationOnIcon fontSize="small" />
                    <Typography variant="body2">{job.city}, {job.country}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                    <WorkIcon fontSize="small" />
                    <Typography variant="body2">{job.employmentType} • {job.remoteOption}</Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Job Description</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 4, whiteSpace: 'pre-wrap' }}>
              {job.description}
            </Typography>

            {job.responsibilities && (
              <>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Responsibilities</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 4, whiteSpace: 'pre-wrap' }}>
                  {job.responsibilities}
                </Typography>
              </>
            )}

            {job.requirements && (
              <>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Requirements</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 4, whiteSpace: 'pre-wrap' }}>
                  {job.requirements}
                </Typography>
              </>
            )}

            {job.qualifications && (
              <>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Qualifications</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 4, whiteSpace: 'pre-wrap' }}>
                  {job.qualifications}
                </Typography>
              </>
            )}
          </Paper>

          <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Similar Openings</Typography>
            {similarJobs.length === 0 ? (
              <Typography color="text.secondary" variant="body2">
                No related job openings found at this time.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {similarJobs.map((simJob) => (
                  <Paper
                    key={simJob._id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                    }}
                    onClick={() => navigate(`/jobs/${simJob.slug || simJob._id}`)}
                  >
                    <Typography variant="subtitle2" fontWeight={700}>{simJob.title}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {simJob.company?.name || 'Vetted Employer'} • {simJob.city}, {simJob.country}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', border: '1px solid', borderColor: 'divider', mb: 4 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Overview & Actions</Typography>
            
            <Stack spacing={2} sx={{ mb: 4 }}>
              {isAuthenticated ? (
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  color={isBookmarked ? 'secondary' : 'primary'}
                  startIcon={isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  onClick={toggleBookmark}
                >
                  {isBookmarked ? 'Job Saved' : 'Save Job Opening'}
                </Button>
              ) : (
                <Button fullWidth variant="outlined" size="large" component={Link} to="/auth/login">
                  Login to Save Job
                </Button>
              )}

              {myApplication ? (
                <Stack spacing={1}>
                  <Button fullWidth variant="contained" size="large" color="success" disabled sx={{ fontWeight: 700 }}>
                    Applied
                  </Button>
                  <Typography variant="caption" color="text.secondary" align="center" display="block">
                    Submitted: {new Date(myApplication.createdAt).toLocaleDateString()} • Status: <strong style={{ color: '#10B981' }}>{myApplication.status}</strong>
                  </Typography>
                </Stack>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  color="primary"
                  onClick={handleApplyClick}
                  sx={{ fontWeight: 700 }}
                >
                  Apply Online
                </Button>
              )}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack spacing={2.5}>
              <Stack direction="row" spacing={2} alignItems="center">
                <AttachMoneyIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Salary Range</Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {job.salaryVisibility === 'PUBLIC' && job.minimumSalary
                      ? `${job.minimumSalary.toLocaleString()} - ${job.maximumSalary?.toLocaleString()} ${job.currency}`
                      : 'Negotiable'}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <CalendarMonthIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Date Posted</Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {new Date(job.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <PeopleIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Vacancies Available</Typography>
                  <Typography variant="body2" fontWeight={700}>{job.vacancies || 1} Openings</Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>About {job.company?.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
              {job.company?.description?.substring(0, 200)}...
            </Typography>
            {job.company?._id && (
              <Button component={Link} to={`/company/${job.company._id}`} size="small" variant="outlined" color="primary">
                View Company Profile
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Job Application Dialog */}
      <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Apply to {job.title}</DialogTitle>
        <DialogContent dividers>
          {applicationError && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '12px' }}>
              {applicationError}
            </Alert>
          )}

          {resumes.length === 0 ? (
            <Box sx={{ py: 3, textAlign: 'center' }}>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                You haven't uploaded any resumes to your profile yet. You must upload a resume before you can apply.
              </Typography>
              <Button variant="contained" onClick={() => navigate('/profile/me')}>
                Go to Resumes Dashboard
              </Button>
            </Box>
          ) : (
            <Stack spacing={3} sx={{ pt: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="select-resume-label">Choose a Resume *</InputLabel>
                <Select
                  labelId="select-resume-label"
                  value={selectedResume}
                  label="Choose a Resume *"
                  onChange={(e) => setSelectedResume(e.target.value)}
                >
                  {resumes.map((r) => (
                    <MenuItem key={r._id} value={r._id}>
                      {r.fileName} {r.isPrimary ? '(Primary)' : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Cover Letter / Notes (Optional)"
                placeholder="Briefly introduce yourself and outline why you are a great match for this position..."
                fullWidth
                multiline
                rows={5}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </Stack>
          )}
        </DialogContent>
        {resumes.length > 0 && (
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setApplyDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleApplySubmit}
              disabled={submitting || !selectedResume}
            >
              {submitting ? 'Submitting Application...' : 'Submit Application'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Container>
  );
}
