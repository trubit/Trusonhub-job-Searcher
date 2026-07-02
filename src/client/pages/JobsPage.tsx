import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Paper,
  Button,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Drawer,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { AppInput } from '../components/ui/AppInput';
import { AppSelect } from '../components/ui/AppSelect';
import { JobCard } from '../components/cards/JobCard';
import { SEO } from '../components/seo/SEO';
import { useMediaQuery } from '../hooks/useMediaQuery';

const MOCK_JOBS_LIST = Array.from({ length: 12 }).map((_, i) => ({
  id: `job-${i + 1}`,
  title: [
    'Senior Frontend Engineer (React)',
    'Full Stack TypeScript Developer',
    'Backend Engineer (Node.js / Express)',
    'Lead DevOps Engineer (Kubernetes)',
    'Product Designer (UI/UX)',
    'AI Research Scientist',
  ][i % 6],
  companyName: ['TechCorp Global', 'FinFlow Systems', 'CloudScale Inc', 'StartupX', 'NeuroLabs AI', 'DataSphere'][i % 6],
  location: ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Remote', 'Seattle, WA', 'Boston, MA'][i % 6],
  salary: ['$120k - $150k', '$140k - $180k', '$160k - $200k', '$100k - $130k'][i % 4],
  jobType: ['Full-time', 'Remote', 'Hybrid', 'Contract'][i % 4],
  postedDate: `${(i % 5) + 1} days ago`,
  tags: [['React', 'TypeScript'], ['Node.js', 'MongoDB'], ['Docker', 'AWS'], ['Figma', 'UI/UX']][i % 4],
  featured: i % 4 === 0,
}));

function FilterContent() {
  return (
    <Stack spacing={3}>
      <AppSelect
        label="Job Type"
        options={[
          { label: 'All Types', value: 'all' },
          { label: 'Full-time', value: 'fulltime' },
          { label: 'Part-time', value: 'parttime' },
          { label: 'Contract', value: 'contract' },
          { label: 'Remote', value: 'remote' },
        ]}
        defaultValue="all"
      />

      <AppSelect
        label="Experience Level"
        options={[
          { label: 'All Levels', value: 'all' },
          { label: 'Entry Level', value: 'entry' },
          { label: 'Mid Level', value: 'mid' },
          { label: 'Senior Level', value: 'senior' },
          { label: 'Executive', value: 'executive' },
        ]}
        defaultValue="all"
      />

      <AppSelect
        label="Salary Range"
        options={[
          { label: 'Any Salary', value: 'any' },
          { label: '$50k - $80k', value: '50-80' },
          { label: '$80k - $120k', value: '80-120' },
          { label: '$120k - $160k', value: '120-160' },
          { label: '$160k+', value: '160+' },
        ]}
        defaultValue="any"
      />

      <Button variant="outlined" color="primary" fullWidth>
        Reset Filters
      </Button>
    </Stack>
  );
}

export function JobsPage() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const isMobile = useMediaQuery('md');

  return (
    <>
      <SEO title="Browse All Jobs — TrusonHub Job Searcher" description="Search and filter thousands of active tech and enterprise jobs." />

      <Box sx={{ py: { xs: 3, md: 6 }, bgcolor: 'background.surface', borderBottom: '1px solid', borderColor: 'divider', overflowX: 'hidden' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography variant="h3" fontWeight={800} sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2.25rem', md: '3rem' }, overflowWrap: 'break-word' }}>
            Find Your Next Role
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: { xs: '0.9rem', md: '1rem' } }}>
            Explore 10,000+ active positions across engineering, design, product, and management.
          </Typography>

          {/* Search Bar Container */}
          <Paper sx={{ p: { xs: 2, md: 2.5 }, borderRadius: '16px', overflow: 'hidden' }}>
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems="center">
              <Box sx={{ width: '100%', flex: { md: 5 } }}>
                <AppInput type="search" placeholder="Search by title, skill, or company..." fullWidth />
              </Box>
              <Box sx={{ width: '100%', flex: { md: 4 } }}>
                <AppInput type="text" placeholder="Location or 'Remote'" fullWidth />
              </Box>
              <Box sx={{ width: '100%', flex: { md: 3 } }}>
                <Button fullWidth variant="contained" size="large" startIcon={<SearchIcon />} sx={{ height: 56, borderRadius: '12px', fontWeight: 700 }}>
                  Search
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 }, px: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* Desktop Filters Sidebar */}
          <Grid size={{ md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Paper sx={{ p: 3, borderRadius: '16px', position: 'sticky', top: 90 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                <FilterListIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Filter Jobs
                </Typography>
              </Stack>
              <FilterContent />
            </Paper>
          </Grid>

          {/* Job Listings Grid */}
          <Grid size={{ xs: 12, md: 9 }}>
            {/* Controls Bar */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Typography variant="body1" fontWeight={600} color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Showing <strong style={{ color: 'inherit' }}>12</strong> of 1,240 jobs
              </Typography>

              <Stack direction="row" spacing={1.5} alignItems="center">
                {/* Mobile Filter Button */}
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<FilterListIcon />}
                  onClick={() => setMobileFiltersOpen(true)}
                  sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}
                >
                  Filters
                </Button>

                <FormControl size="small" sx={{ minWidth: 140, flexGrow: { xs: 1, sm: 0 } }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
                    <MenuItem value="newest">Most Recent</MenuItem>
                    <MenuItem value="relevant">Most Relevant</MenuItem>
                    <MenuItem value="salary-high">Salary (High to Low)</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>

            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
              {MOCK_JOBS_LIST.map((job) => (
                <Grid key={job.id} size={{ xs: 12, sm: 6 }}>
                  <JobCard {...job} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <Stack alignItems="center" sx={{ width: '100%', overflowX: 'auto' }}>
              <Pagination
                count={10}
                page={page}
                onChange={(_, p) => setPage(p)}
                color="primary"
                size={isMobile ? 'medium' : 'large'}
                shape="rounded"
              />
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="bottom"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            p: 3,
            maxHeight: '85vh',
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterListIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Filter Jobs
            </Typography>
          </Stack>
          <IconButton onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
            <CloseIcon />
          </IconButton>
        </Stack>
        <FilterContent />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => setMobileFiltersOpen(false)}
          sx={{ mt: 3, py: 1.5, borderRadius: '12px' }}
        >
          Apply Filters
        </Button>
      </Drawer>
    </>
  );
}
