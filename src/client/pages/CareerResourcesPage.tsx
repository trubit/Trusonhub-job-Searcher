import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { SEO } from '../components/seo/SEO';

const RESOURCE_CATEGORIES = [
  {
    icon: <MenuBookIcon fontSize="large" color="primary" />,
    title: 'Resume & Cover Letter Tips',
    desc: 'Actionable guides and templates to craft ATS-friendly resumes that grab recruiter attention.',
    articlesCount: 18,
  },
  {
    icon: <QuestionAnswerIcon fontSize="large" color="primary" />,
    title: 'Interview Preparation',
    desc: 'Master behavioral, technical, and system design interviews with expert frameworks.',
    articlesCount: 24,
  },
  {
    icon: <TrendingUpIcon fontSize="large" color="primary" />,
    title: 'Career Growth & Leadership',
    desc: 'Strategies for promotions, career pivots, leadership development, and networking.',
    articlesCount: 15,
  },
  {
    icon: <LaptopMacIcon fontSize="large" color="primary" />,
    title: 'Remote Work Mastery',
    desc: 'Best practices for productivity, work-life balance, and asynchronous team communication.',
    articlesCount: 12,
  },
  {
    icon: <AttachMoneyIcon fontSize="large" color="primary" />,
    title: 'Salary Negotiation',
    desc: 'Learn how to benchmark compensation, negotiate offer packages, and maximize total rewards.',
    articlesCount: 10,
  },
];

export function CareerResourcesPage() {
  return (
    <>
      <SEO title="Career Resources & Advice — TrusonHub Job Searcher" description="Guides, tips, and frameworks for resumes, interviews, and salary negotiation." />

      <Box sx={{ py: 8, bgcolor: 'background.surface', borderBottom: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} sx={{ mb: 2 }}>
            Career Resources Hub
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
            Expert advice, interview guides, and industry insights to help you land your next dream role.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {RESOURCE_CATEGORIES.map((cat, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: '100%', p: 1, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 2 }}>{cat.icon}</Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                    {cat.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7, flexGrow: 1 }}>
                    {cat.desc}
                  </Typography>
                  <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {cat.articlesCount} Guides Available
                    </Typography>
                    <Button variant="text" size="small" color="primary">
                      Explore Category →
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
