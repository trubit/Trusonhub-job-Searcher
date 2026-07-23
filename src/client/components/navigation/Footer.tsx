import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Stack, IconButton, Divider } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Logo } from './Logo';

const FOOTER_SECTIONS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', path: '/about' },
      { label: 'Careers', path: '/about' },
      { label: 'Press & Media', path: '/about' },
      { label: 'Contact', path: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Career Resources', path: '/career-resources' },
      { label: 'Resume Tips', path: '/career-resources' },
      { label: 'Interview Prep', path: '/career-resources' },
      { label: 'Pricing Plans', path: '/pricing' },
    ],
  },
  {
    title: 'Employers',
    links: [
      { label: 'Post a Job', path: '/pricing' },
      { label: 'Browse Candidates', path: '/companies' },
      { label: 'Talent Solutions', path: '/pricing' },
      { label: 'Employer Branding', path: '/pricing' },
    ],
  },
  {
    title: 'Job Seekers',
    links: [
      { label: 'Browse Jobs', path: '/jobs' },
      { label: 'Companies Directory', path: '/companies' },
      { label: 'Salary Calculator', path: '/career-resources' },
      { label: 'Job Alerts', path: '/jobs' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', path: '/about' },
      { label: 'Terms of Service', path: '/about' },
      { label: 'Security', path: '/about' },
      { label: 'Cookie Settings', path: '/about' },
    ],
  },
];

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        pt: { xs: 6, md: 8 },
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Brand Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2.5}>
              <Logo size="medium" />
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320, lineHeight: 1.7 }}>
                The next-generation enterprise job board platform. Connecting world-class talent with leading global companies.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton size="small" aria-label="Twitter">
                  <TwitterIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="LinkedIn">
                  <LinkedInIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="GitHub">
                  <GitHubIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="Facebook">
                  <FacebookIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>

          {/* Links Columns */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={3}>
              {FOOTER_SECTIONS.map((section) => (
                <Grid key={section.title} size={{ xs: 6, sm: 4, md: 2.4 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, letterSpacing: '0.02em' }}>
                    {section.title}
                  </Typography>
                  <Stack spacing={1.2}>
                    {section.links.map((link, idx) => (
                      <Link
                        key={idx}
                        to={link.path}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            transition: 'color 0.2s',
                            '&:hover': { color: 'primary.main' },
                          }}
                        >
                          {link.label}
                        </Typography>
                      </Link>
                    ))}
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4 }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Talentra Inc. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Built with React 19, Express, TypeScript & MUI.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
