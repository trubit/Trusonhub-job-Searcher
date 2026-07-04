import { useEffect, useState } from 'react';
import { Box, Container, Typography, Stack, Grid, Paper, Avatar } from '@mui/material';
import TargetIcon from '@mui/icons-material/TrackChanges';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { SEO } from '../components/seo/SEO';
import { statsApi, PlatformStats } from '../features/stats/statsApi';

const VALUES = [
  {
    title: 'Transparency First',
    desc: 'We mandate clear salary ranges, verified company profiles, and honest candidate communications.',
  },
  {
    title: 'Speed & Precision',
    desc: 'Cutting-edge matching technology reduces hiring cycles from months to days.',
  },
  {
    title: 'Equity & Inclusion',
    desc: 'Democratizing career opportunities by ensuring equal visibility for all candidates globally.',
  },
  {
    title: 'Continuous Innovation',
    desc: 'Constantly advancing our design system, developer tools, and candidate experiences.',
  },
];

export function AboutPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await statsApi.getPublicStats();
        setStats(res);
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    }
    loadStats();
  }, []);

  return (
    <>
      <SEO title="About Us — TrusonHub Job Searcher" description="Learn about our mission, vision, values, and company story." />

      <Box sx={{ py: 10, bgcolor: 'background.surface', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" fontWeight={800} sx={{ mb: 2 }}>
            Empowering Careers, <br />
            <span className="gradient-text">Transforming Hiring</span>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem', lineHeight: 1.8 }}>
            TrusonHub is on a mission to build the world’s most transparent, efficient, and user-centric job platform.
          </Typography>
        </Container>
      </Box>

      {/* Live Stats Bar */}
      <Box sx={{ py: 6, bgcolor: 'primary.main', color: '#fff' }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} textAlign="center">
            {[
              { num: stats ? `${stats.totalJobs.toLocaleString()}+` : '100+', label: 'Active Jobs' },
              { num: stats ? `${stats.totalCompanies.toLocaleString()}+` : '50+', label: 'Verified Employers' },
              { num: stats ? `${stats.totalApplications.toLocaleString()}+` : '1000+', label: 'Job Applications Sent' },
              { num: stats ? `${stats.totalCandidates.toLocaleString()}+` : '500+', label: 'Registered Candidates' },
            ].map((s, idx) => (
              <Grid key={idx} size={{ xs: 6, md: 3 }}>
                <Typography variant="h3" fontWeight={800}>
                  {s.num}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {s.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 10 }}>
        {/* Mission & Vision */}
        <Grid container spacing={6} sx={{ mb: 10 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 4, height: '100%', borderRadius: '20px' }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', color: '#fff' }}>
                  <TargetIcon />
                </Avatar>
                <Typography variant="h5" fontWeight={700}>
                  Our Mission
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                To connect ambitious talent with world-class employers through transparent data, intuitive user experience, and modern technology—eliminating friction from the global hiring process.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 4, height: '100%', borderRadius: '20px' }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', color: '#fff' }}>
                  <VisibilityIcon />
                </Avatar>
                <Typography variant="h5" fontWeight={700}>
                  Our Vision
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                To create a world where every candidate finds fulfilling work and every organization builds high-performing teams effortlessly, regardless of geographic location.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Values */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h3" fontWeight={800} textAlign="center" sx={{ mb: 6 }}>
            Core Values
          </Typography>
          <Grid container spacing={3}>
            {VALUES.map((v, idx) => (
              <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper sx={{ p: 3, height: '100%', borderRadius: '16px' }}>
                  <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ mb: 1 }}>
                    {v.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {v.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
}
