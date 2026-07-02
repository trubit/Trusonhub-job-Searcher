import { useState } from 'react';
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
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import StarIcon from '@mui/icons-material/Star';
import { AppInput } from '../components/ui/AppInput';
import { AppTag } from '../components/ui/AppTag';
import { JobCard } from '../components/cards/JobCard';
import { CompanyCard } from '../components/cards/CompanyCard';
import { FeatureCard } from '../components/cards/FeatureCard';
import { SEO } from '../components/seo/SEO';
import { fadeUp, staggerContainer, staggerItem } from '../theme/animations';

const MOCK_JOBS = [
  {
    id: '1',
    title: 'Senior Frontend Engineer (React / TypeScript)',
    companyName: 'TechCorp Global',
    location: 'San Francisco, CA (Remote)',
    salary: '$140k - $180k',
    jobType: 'Full-time',
    postedDate: 'Posted 2 days ago',
    tags: ['React', 'TypeScript', 'MUI', 'GraphQL'],
    featured: true,
  },
  {
    id: '2',
    title: 'Staff Backend Developer (Node.js & Go)',
    companyName: 'FinFlow Systems',
    location: 'New York, NY (Hybrid)',
    salary: '$160k - $200k',
    jobType: 'Full-time',
    postedDate: 'Posted 1 day ago',
    tags: ['Node.js', 'TypeScript', 'MongoDB', 'Redis'],
    featured: true,
  },
  {
    id: '3',
    title: 'Lead UI/UX Product Designer',
    companyName: 'CreativeStudio',
    location: 'Austin, TX (Remote)',
    salary: '$130k - $160k',
    jobType: 'Full-time',
    postedDate: 'Posted 3 days ago',
    tags: ['Figma', 'UI/UX', 'Design Systems'],
  },
  {
    id: '4',
    title: 'DevOps & Infrastructure Engineer',
    companyName: 'CloudScale Inc',
    location: 'Seattle, WA (Hybrid)',
    salary: '$150k - $190k',
    jobType: 'Full-time',
    postedDate: 'Posted 4 days ago',
    tags: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
  },
  {
    id: '5',
    title: 'Full Stack Engineer (MERN)',
    companyName: 'StartupX',
    location: 'Remote',
    salary: '$120k - $150k',
    jobType: 'Contract',
    postedDate: 'Posted 5 days ago',
    tags: ['React', 'Express', 'MongoDB', 'Node.js'],
  },
  {
    id: '6',
    title: 'AI / Machine Learning Researcher',
    companyName: 'NeuroLabs AI',
    location: 'Boston, MA (On-site)',
    salary: '$180k - $240k',
    jobType: 'Full-time',
    postedDate: 'Posted 1 day ago',
    tags: ['Python', 'PyTorch', 'LLMs', 'NLP'],
    featured: true,
  },
];

const MOCK_COMPANIES = [
  {
    id: 'c1',
    name: 'TechCorp Global',
    industry: 'Enterprise Software',
    location: 'San Francisco, CA',
    employeeCount: '1,000 - 5,000',
    openRolesCount: 14,
  },
  {
    id: 'c2',
    name: 'FinFlow Systems',
    industry: 'Fintech & Payments',
    location: 'New York, NY',
    employeeCount: '500 - 1,000',
    openRolesCount: 8,
  },
  {
    id: 'c3',
    name: 'CloudScale Inc',
    industry: 'Cloud Infrastructure',
    location: 'Seattle, WA',
    employeeCount: '250 - 500',
    openRolesCount: 12,
  },
  {
    id: 'c4',
    name: 'NeuroLabs AI',
    industry: 'Artificial Intelligence',
    location: 'Boston, MA',
    employeeCount: '100 - 250',
    openRolesCount: 6,
  },
];

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

const TRUSTED_LOGOS = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Spotify', 'Stripe'];

export function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  return (
    <>
      <SEO title="TrusonHub Job Searcher — Find Your Next Opportunity" />

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
                  Over 50,000+ Active Enterprise Jobs Available
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
                  />
                </Box>
                <Box sx={{ width: '100%', flex: { md: 4 } }}>
                  <AppInput
                    type="text"
                    placeholder="City, state, or 'Remote'"
                    fullWidth
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
                    selected={selectedCategory === item}
                    onClick={() => setSelectedCategory(item)}
                  />
                )
              )}
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Trusted Companies Section */}
      <Box sx={{ py: { xs: 4, md: 6 }, borderY: '1px solid', borderColor: 'divider', bgcolor: 'background.surface' }}>
        <Container maxWidth="lg">
          <Typography variant="overline" display="block" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
            Trusted by Hiring Teams at World-Class Companies
          </Typography>
          <Stack
            direction="row"
            spacing={{ xs: 2, sm: 4, md: 6 }}
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            gap={{ xs: 2, md: 4 }}
          >
            {TRUSTED_LOGOS.map((name) => (
              <Typography
                key={name}
                variant="h6"
                fontWeight={800}
                color="text.disabled"
                sx={{ letterSpacing: '0.05em', opacity: 0.7, fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                {name}
              </Typography>
            ))}
          </Stack>
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
            <Button variant="outlined" color="primary" sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}>
              View All Jobs
            </Button>
          </Stack>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <Grid container spacing={3}>
              {MOCK_JOBS.map((job) => (
                <Grid key={job.id} size={{ xs: 12, md: 6, lg: 4 }}>
                  <motion.div variants={staggerItem}>
                    <JobCard {...job} />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Featured Companies Section */}
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
            <Button variant="outlined" color="primary" sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}>
              Browse Companies
            </Button>
          </Stack>

          <Grid container spacing={3}>
            {MOCK_COMPANIES.map((company) => (
              <Grid key={company.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <CompanyCard {...company} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Platform Benefits Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          <Stack textAlign="center" alignItems="center" sx={{ mb: { xs: 5, md: 8 } }}>
            <Typography variant="h3" fontWeight={800} sx={{ mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
              Why Choose TrusonHub?
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
                quote: 'TrusonHub made my job search effortless. I applied to 5 verified tech companies and landed 3 interviews within a week!',
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
              Join thousands of candidates and world-class companies on TrusonHub today.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button variant="contained" size="large" sx={{ bgcolor: '#fff', color: 'primary.main', fontWeight: 700, px: 4, py: 1.5 }}>
                Create Candidate Account
              </Button>
              <Button variant="outlined" size="large" sx={{ borderColor: '#fff', color: '#fff', fontWeight: 700, px: 4, py: 1.5 }}>
                Post a Job
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
