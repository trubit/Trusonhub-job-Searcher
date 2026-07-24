import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Grid,
  Paper,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Chip,
} from '@mui/material';
import { motion, useInView } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { AppInput } from '../components/ui/AppInput';
import { AppTag } from '../components/ui/AppTag';
import { JobCard } from '../components/cards/JobCard';
import { CompanyCard } from '../components/cards/CompanyCard';
import { FeatureCard } from '../components/cards/FeatureCard';
import { SEO } from '../components/seo/SEO';
import { fadeUp, staggerContainer, staggerItem } from '../theme/animations';
import { jobApi, JobData } from '../features/jobs/services/jobApi';
import { companyApi, CompanyData } from '../features/company/services/companyApi';
import { statsApi, PlatformStats } from '../features/stats/statsApi';

const BENEFITS = [
  {
    icon: <VerifiedIcon />,
    title: 'Verified Employers',
    description: 'Every employer is rigorously vetted to ensure authentic, high-quality career opportunities.',
  },
  {
    icon: <SpeedIcon />,
    title: 'Smart Job Search',
    description: 'Advanced filtering and intelligent matching deliver personalized job recommendations instantly.',
  },
  {
    icon: <TrendingUpIcon />,
    title: 'Career Growth',
    description: 'Access salary insights, interview prep, and career resources designed for professional advancement.',
  },
  {
    icon: <DescriptionIcon />,
    title: 'Resume Management',
    description: 'Store multiple resume versions tailored for different roles and track application status seamlessly.',
  },
  {
    icon: <FlashOnIcon />,
    title: 'Fast Applications',
    description: 'Apply to top tier companies in one click with your standardized candidate profile.',
  },
];

// ── Animated Counter component ────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || target === 0) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  suffix,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  color: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: '20px',
        border: '1px solid',
        borderColor: 'divider',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.08)',
          borderColor: color,
        },
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '16px',
          bgcolor: `${color}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
          color,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h3" fontWeight={900} sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, color }}>
        <AnimatedCounter target={value} suffix={suffix} />
      </Typography>
      <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mt: 0.5 }}>
        {label}
      </Typography>
    </Paper>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const [jobs, setJobs] = useState<JobData[]>([]);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [jobsRes, companiesRes, statsRes] = await Promise.allSettled([
          jobApi.searchJobs({ limit: 6 }),
          companyApi.getAllCompanies(),
          statsApi.getPublicStats(),
        ]);

        if (jobsRes.status === 'fulfilled' && jobsRes.value) {
          setJobs(jobsRes.value.jobs || []);
        }
        if (companiesRes.status === 'fulfilled' && companiesRes.value) {
          setCompanies((companiesRes.value || []).slice(0, 8));
        }
        if (statsRes.status === 'fulfilled' && statsRes.value) {
          setStats(statsRes.value);
        }
      } catch {
        // Fallback gracefully without console error
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handlePopularSearch = (term: string) => {
    const params = new URLSearchParams();
    if (term === 'Remote React Developer') {
      params.append('keyword', 'React');
      params.append('remoteOption', 'REMOTE');
    } else if (term === 'DevOps Engineer') {
      params.append('keyword', 'DevOps');
    } else if (term === 'Product Manager') {
      params.append('keyword', 'Product Manager');
    } else if (term === 'Data Scientist') {
      params.append('keyword', 'Data Scientist');
    } else if (term === 'UI Designer') {
      params.append('keyword', 'UI');
    } else {
      params.append('keyword', term);
    }
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <>
      <SEO title="Talentra — Find Your Next Career Opportunity" />

      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 6, sm: 8, md: 12 },
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 0) 70%)'
              : 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.08) 0%, rgba(248, 250, 252, 0) 70%)',
        }}
      >
        <Container maxWidth="lg">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Stack spacing={3} textAlign="center" alignItems="center" sx={{ mb: { xs: 4, md: 6 } }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: { xs: 1.5, sm: 2 },
                  py: 0.75,
                  borderRadius: '20px',
                  bgcolor: 'primary.50',
                  color: 'primary.700',
                  border: '1px solid',
                  borderColor: 'primary.200',
                }}
              >
                <StarIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="caption" fontWeight={700} sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}>
                  {stats && stats.totalJobs > 0
                    ? `${stats.totalJobs.toLocaleString()}+ Active Jobs Available Right Now`
                    : 'Thousands of Active Enterprise Jobs Available'}
                </Typography>
              </Box>

              <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', sm: '3.25rem', md: '4.25rem' }, lineHeight: 1.15 }}>
                Discover Your Next <br />
                <span className="gradient-text">Career Opportunity</span>
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, fontSize: { xs: '1rem', md: '1.125rem' } }}>
                Explore thousands of verified job listings from top global tech companies and industry pioneers.
              </Typography>
            </Stack>

            {/* Search Box UI */}
            <Paper
              elevation={4}
              sx={{
                p: { xs: 2, md: 2.5 },
                borderRadius: '20px',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                mb: 4,
                overflow: 'hidden',
              }}
            >
              <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems="center">
                <Box sx={{ width: '100%', flex: { md: 5 } }}>
                  <AppInput
                    type="search"
                    placeholder="Job title, keywords, or company..."
                    fullWidth
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </Box>
                <Box sx={{ width: '100%', flex: { md: 4 } }}>
                  <AppInput
                    type="text"
                    placeholder="City, state, or 'Remote'"
                    fullWidth
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    InputProps={{
                      startAdornment: <LocationOnIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Box>
                <Box sx={{ width: '100%', flex: { md: 3 } }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                    sx={{ height: 56, borderRadius: '12px', fontWeight: 700 }}
                  >
                    Search Jobs
                  </Button>
                </Box>
              </Stack>
            </Paper>

            {/* Popular Searches */}
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" justifyContent="center" gap={1}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Popular Searches:
              </Typography>
              {['Remote React Developer', 'DevOps Engineer', 'Product Manager', 'Data Scientist', 'UI Designer'].map(
                (item) => (
                  <AppTag
                    key={item}
                    label={item}
                    selected={false}
                    onClick={() => handlePopularSearch(item)}
                  />
                )
              )}
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Live Platform Stats Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.surface' }}>
        <Container maxWidth="xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Typography
              variant="overline"
              display="block"
              textAlign="center"
              color="text.secondary"
              fontWeight={700}
              sx={{ mb: 2, letterSpacing: '0.1em' }}
            >
              Platform Statistics
            </Typography>
            <Typography variant="h3" fontWeight={800} textAlign="center" sx={{ mb: 6, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
              Trusted by Thousands Worldwide
            </Typography>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 6, md: 3 }}>
                <motion.div variants={staggerItem}>
                  <StatCard
                    icon={<WorkIcon fontSize="large" />}
                    label="Active Job Listings"
                    value={stats?.totalJobs ?? 0}
                    color="#3b82f6"
                  />
                </motion.div>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <motion.div variants={staggerItem}>
                  <StatCard
                    icon={<ApartmentIcon fontSize="large" />}
                    label="Hiring Companies"
                    value={stats?.totalCompanies ?? 0}
                    color="#8b5cf6"
                  />
                </motion.div>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <motion.div variants={staggerItem}>
                  <StatCard
                    icon={<PeopleIcon fontSize="large" />}
                    label="Registered Candidates"
                    value={stats?.totalCandidates ?? 0}
                    color="#10b981"
                  />
                </motion.div>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <motion.div variants={staggerItem}>
                  <StatCard
                    icon={<AssignmentIcon fontSize="large" />}
                    label="Applications Submitted"
                    value={stats?.totalApplications ?? 0}
                    color="#f59e0b"
                  />
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Featured Jobs Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
            spacing={2}
            sx={{ mb: 6 }}
          >
            <Box>
              <Typography variant="h3" fontWeight={800} sx={{ mb: 1, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
                Featured Job Openings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Handpicked high-impact opportunities from verified employers.
              </Typography>
            </Box>
            <Button onClick={() => navigate('/jobs')} variant="outlined" color="primary" sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}>
              View All Jobs
            </Button>
          </Stack>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : jobs.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body1" color="text.secondary">
                No active jobs posted yet. Check back soon!
              </Typography>
            </Paper>
          ) : (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <Grid container spacing={3}>
                {jobs.map((job) => {
                  const mapped = {
                    id: job._id,
                    title: job.title,
                    companyName: job.company?.name || 'Vetted Employer',
                    companyLogo: job.company?.logoUrl,
                    location: `${job.city}, ${job.country}`,
                    salary: job.salaryVisibility === 'PUBLIC' && job.minimumSalary
                      ? `$${job.minimumSalary.toLocaleString()} - $${job.maximumSalary?.toLocaleString()} ${job.currency}`
                      : 'Negotiable',
                    jobType: job.employmentType,
                    postedDate: `Posted ${new Date(job.createdAt).toLocaleDateString()}`,
                    tags: job.requiredSkills || [],
                    featured: job.status === 'PUBLISHED',
                  };
                  return (
                    <Grid key={job._id} size={{ xs: 12, md: 6, lg: 4 }}>
                      <motion.div variants={staggerItem}>
                        <JobCard {...mapped} />
                      </motion.div>
                    </Grid>
                  );
                })}
              </Grid>
            </motion.div>
          )}
        </Container>
      </Box>

      {/* Real Hiring Companies Section (replaces TRUSTED_LOGOS) */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.surface' }}>
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
            spacing={2}
            sx={{ mb: 6 }}
          >
            <Box>
              <Typography variant="h3" fontWeight={800} sx={{ mb: 1, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
                Top Hiring Companies
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Explore company cultures, benefits, and open positions.
              </Typography>
            </Box>
            <Button onClick={() => navigate('/companies')} variant="outlined" color="primary" sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}>
              Browse Companies
            </Button>
          </Stack>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : companies.length === 0 ? (
            /* Fallback: show trusted brand names if no companies registered yet */
            <Box sx={{ py: 4, borderY: '1px solid', borderColor: 'divider' }}>
              <Typography variant="overline" display="block" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
                Trusted by Hiring Teams at World-Class Companies
              </Typography>
              <Stack direction="row" spacing={{ xs: 2, md: 6 }} justifyContent="center" alignItems="center" flexWrap="wrap" gap={3}>
                {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Spotify', 'Stripe'].map((name) => (
                  <Typography key={name} variant="h6" fontWeight={800} color="text.disabled" sx={{ letterSpacing: '0.05em', opacity: 0.6 }}>
                    {name}
                  </Typography>
                ))}
              </Stack>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {companies.map((company) => (
                <Grid key={company._id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <CompanyCard {...company} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Platform Benefits Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          <Stack textAlign="center" alignItems="center" sx={{ mb: { xs: 5, md: 8 } }}>
            <Typography variant="h3" fontWeight={800} sx={{ mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
              Why Choose Talentra?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
              Engineered for seamless career discovery and high-velocity hiring.
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {BENEFITS.map((b, idx) => (
              <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
                <FeatureCard {...b} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonial Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.surface' }}>
        <Container maxWidth="lg">
          <Stack textAlign="center" alignItems="center" sx={{ mb: { xs: 5, md: 8 } }}>
            <Typography variant="h3" fontWeight={800} sx={{ mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
              What Candidates Say
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Real stories from professionals who found their dream roles.
            </Typography>
          </Stack>

          <Grid container spacing={4}>
            {[
              {
                quote: 'Talentra made my job search effortless. I applied to 5 verified tech companies and landed 3 interviews within a week!',
                name: 'Sarah Jenkins',
                role: 'Senior Staff Engineer at Stripe',
              },
              {
                quote: 'The salary transparency and verified employer badges saved me so much time. Easily the best job platform I have used.',
                name: 'Marcus Chen',
                role: 'Lead UI/UX Designer',
              },
              {
                quote: 'As an employer, posting roles and receiving pre-screened candidate applications doubled our hiring speed.',
                name: 'Elena Rostova',
                role: 'Head of Talent at FinFlow',
              },
            ].map((t, idx) => (
              <Grid key={idx} size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', p: 1 }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 3, lineHeight: 1.7 }}>
                      "{t.quote}"
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700 }}>
                        {t.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {t.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t.role}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Employer CTA Banner */}
      <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: 'background.surface', borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Chip label="For Employers & HR Teams" color="secondary" size="small" sx={{ mb: 1.5, fontWeight: 700 }} />
              <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
                Ready to Hire Top Talent?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Post your job openings and reach thousands of pre-screened, verified candidates instantly.
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexShrink: 0 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/auth/register/employer')}
                sx={{ fontWeight: 700, px: 3, py: 1.5 }}
              >
                Post a Job Free
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => navigate('/pricing')}
                sx={{ fontWeight: 700, px: 3, py: 1.5 }}
              >
                See Pricing Plans
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Paper
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #c026d3 100%)',
              color: '#fff',
              textAlign: 'center',
            }}
          >
            <Typography variant="h3" fontWeight={800} sx={{ mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
              Ready to Accelerate Your Career?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto', opacity: 0.9 }}>
              Join{stats && stats.totalCandidates > 0 ? ` ${stats.totalCandidates.toLocaleString()}+` : ' thousands of'} candidates and world-class companies on Talentra today.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button onClick={() => navigate('/auth/register/job-seeker')} variant="contained" size="large" sx={{ bgcolor: '#fff', color: 'primary.main', fontWeight: 700, px: 4, py: 1.5 }}>
                Create Candidate Account
              </Button>
              <Button onClick={() => navigate('/pricing')} variant="outlined" size="large" sx={{ borderColor: '#fff', color: '#fff', fontWeight: 700, px: 4, py: 1.5 }}>
                Post a Job
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
