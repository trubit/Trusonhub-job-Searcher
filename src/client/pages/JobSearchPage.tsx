import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Stack,
  Box,
  Button,
  Chip,
  Avatar,
  Pagination,
  CircularProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { AppInput } from '../components/ui/AppInput';
import { AppSelect } from '../components/ui/AppSelect';
import { SEO } from '../components/seo/SEO';
import { jobApi, JobData, JobCategoryData, JobTypeData } from '../features/jobs/services/jobApi';
import { useSearchFilterStore } from '../features/job-search/store/useSearchFilterStore';
import { useAuthStore } from '../features/auth/store/useAuthStore';

const EXPERIENCE_LEVELS = [
  { label: 'All Levels', value: '' },
  { label: 'Entry Level', value: 'ENTRY_LEVEL' },
  { label: 'Junior', value: 'JUNIOR' },
  { label: 'Mid-Level', value: 'MID_LEVEL' },
  { label: 'Senior', value: 'SENIOR' },
  { label: 'Lead', value: 'LEAD' },
  { label: 'Executive', value: 'EXECUTIVE' },
];

const REMOTE_OPTIONS = [
  { label: 'All Settings', value: '' },
  { label: 'Remote', value: 'REMOTE' },
  { label: 'Hybrid', value: 'HYBRID' },
  { label: 'On-Site', value: 'ON_SITE' },
];

const DATE_POSTED_OPTIONS = [
  { label: 'Anytime', value: 'all' },
  { label: 'Past 24 Hours', value: '24h' },
  { label: 'Past 3 Days', value: '3d' },
  { label: 'Past Week', value: '7d' },
  { label: 'Past Month', value: '30d' },
];

const SORT_BY_OPTIONS = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Most Viewed', value: 'views' },
  { label: 'Salary: High to Low', value: 'salary_desc' },
  { label: 'Salary: Low to High', value: 'salary_asc' },
];

export function JobSearchPage() {
  const { filters, setFilters, resetFilters } = useSearchFilterStore();
  const { isAuthenticated } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [categories, setCategories] = useState<JobCategoryData[]>([]);
  const [types, setTypes] = useState<JobTypeData[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    async function loadConfig() {
      try {
        const [catsData, typesData] = await Promise.all([
          jobApi.getCategories(),
          jobApi.getJobTypes(),
        ]);
        setCategories(catsData);
        setTypes(typesData);
        
        if (isAuthenticated) {
          const bookmarkData = await jobApi.getBookmarks();
          setBookmarks(bookmarkData.map((b) => b.job?._id));
        }
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    }
    loadConfig();
  }, [isAuthenticated]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const data = await jobApi.searchJobs(filters);
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error('Failed to search jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const toggleBookmark = async (jobId: string) => {
    if (!isAuthenticated) return;
    try {
      if (bookmarks.includes(jobId)) {
        await jobApi.unbookmarkJob(jobId);
        setBookmarks((prev) => prev.filter((id) => id !== jobId));
      } else {
        await jobApi.bookmarkJob(jobId);
        setBookmarks((prev) => [...prev, jobId]);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <SEO title="Find Jobs | TrusonHub" description="Search and filter thousands of job listings on TrusonHub" />
      
      <Typography variant="h3" fontWeight={800} sx={{ mb: 1, letterSpacing: '-1px' }}>
        Discover Your Next Opportunity
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Find matching jobs based on your core skills, workplace settings, salary expectations, and locations.
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 3.5 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider', position: 'sticky', top: 96 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={800}>Filter Options</Typography>
              <Button size="small" onClick={resetFilters}>Reset All</Button>
            </Stack>
            
            <Stack spacing={2.5}>
              <AppInput
                label="Keywords"
                placeholder="Title, skills, or tags"
                value={filters.keyword || ''}
                onChange={(e) => setFilters({ keyword: e.target.value })}
              />

              <AppInput
                label="Location"
                placeholder="City, State, or Country"
                value={filters.location || ''}
                onChange={(e) => setFilters({ location: e.target.value })}
              />

              <AppSelect
                label="Job Category"
                value={filters.category || ''}
                options={[{ label: 'All Categories', value: '' }, ...categories.map((c) => ({ label: c.name, value: c.slug }))]}
                onChange={(e) => setFilters({ category: e.target.value as string })}
              />

              <AppSelect
                label="Employment Type"
                value={filters.employmentType || ''}
                options={[{ label: 'All Types', value: '' }, ...types.map((t) => ({ label: t.name, value: t.slug }))]}
                onChange={(e) => setFilters({ employmentType: e.target.value as string })}
              />

              <AppSelect
                label="Experience Level"
                value={filters.experienceLevel || ''}
                options={EXPERIENCE_LEVELS}
                onChange={(e) => setFilters({ experienceLevel: e.target.value as string })}
              />

              <AppSelect
                label="Workplace Setting"
                value={filters.remoteOption || ''}
                options={REMOTE_OPTIONS}
                onChange={(e) => setFilters({ remoteOption: e.target.value as string })}
              />

              <AppSelect
                label="Date Posted"
                value={filters.datePosted || 'all'}
                options={DATE_POSTED_OPTIONS}
                onChange={(e) => setFilters({ datePosted: e.target.value as never })}
              />

              <Stack direction="row" spacing={1.5}>
                <AppInput
                  label="Min Salary ($)"
                  value={filters.minSalary || ''}
                  onChange={(e) => setFilters({ minSalary: e.target.value ? Number(e.target.value) : undefined })}
                />
                <AppInput
                  label="Max Salary ($)"
                  value={filters.maxSalary || ''}
                  onChange={(e) => setFilters({ maxSalary: e.target.value ? Number(e.target.value) : undefined })}
                />
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary">
              We found <strong>{total}</strong> opportunities for you
            </Typography>
            
            <Box sx={{ width: 200 }}>
              <AppSelect
                label="Sort By"
                value={filters.sortBy || 'recent'}
                options={SORT_BY_OPTIONS}
                onChange={(e) => setFilters({ sortBy: e.target.value as string })}
                size="small"
              />
            </Box>
          </Stack>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : jobs.length === 0 ? (
            <Paper sx={{ p: 8, textAlign: 'center', borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>No Jobs Found</Typography>
              <Typography color="text.secondary">Try broadening your search keywords or resetting filters.</Typography>
            </Paper>
          ) : (
            <Stack spacing={3}>
              {jobs.map((job) => (
                <Paper
                  key={job._id}
                  sx={{
                    p: 4,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.06)' },
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 9 }}>
                      <Stack direction="row" spacing={3} alignItems="flex-start">
                        <Avatar
                          src={job.company?.logoUrl}
                          variant="rounded"
                          sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontWeight: 800, fontSize: 24 }}
                        >
                          {job.company?.name ? job.company.name.charAt(0) : 'J'}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={800} gutterBottom component={Link} to={`/jobs/${job.slug}`} sx={{ textDecoration: 'none', color: 'text.primary', '&:hover': { color: 'primary.main' } }}>
                            {job.title}
                          </Typography>
                          <Typography variant="subtitle2" color="primary.main" fontWeight={700} gutterBottom>
                            {job.company?.name}
                          </Typography>
                          
                          <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                            <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                              <LocationOnIcon fontSize="small" />
                              <Typography variant="caption">{job.city}, {job.country}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                              <WorkIcon fontSize="small" />
                              <Typography variant="caption">{job.employmentType} • {job.remoteOption}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                              <AttachMoneyIcon fontSize="small" />
                              <Typography variant="caption">
                                {job.salaryVisibility === 'PUBLIC' && job.minimumSalary
                                  ? `${job.minimumSalary.toLocaleString()} - ${job.maximumSalary?.toLocaleString()} ${job.currency}`
                                  : 'Negotiable'}
                              </Typography>
                            </Stack>
                          </Stack>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 2 }}>
                            {job.description}
                          </Typography>
                          
                          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                            {job.requiredSkills?.slice(0, 4).map((s) => (
                              <Chip key={s} label={s} size="small" />
                            ))}
                          </Stack>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
                      {isAuthenticated ? (
                        <Button
                          variant="outlined"
                          size="small"
                          color={bookmarks.includes(job._id) ? 'secondary' : 'primary'}
                          startIcon={bookmarks.includes(job._id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                          onClick={() => toggleBookmark(job._id)}
                        >
                          {bookmarks.includes(job._id) ? 'Saved' : 'Save'}
                        </Button>
                      ) : (
                        <div />
                      )}
                      
                      <Button component={Link} to={`/jobs/${job.slug}`} variant="contained" size="small">
                        Apply Now
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={pages}
                  page={filters.page || 1}
                  onChange={(_, value) => setFilters({ page: value })}
                  color="primary"
                />
              </Box>
            </Stack>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
