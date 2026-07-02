import { useState } from 'react';
import { Box, Container, Typography, Stack, Grid, Paper, Button, Pagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { AppInput } from '../components/ui/AppInput';
import { AppSelect } from '../components/ui/AppSelect';
import { CompanyCard } from '../components/cards/CompanyCard';
import { SEO } from '../components/seo/SEO';

const MOCK_COMPANIES_LIST = Array.from({ length: 12 }).map((_, i) => ({
  id: `comp-${i + 1}`,
  name: ['TechCorp Global', 'FinFlow Systems', 'CloudScale Inc', 'NeuroLabs AI', 'DataSphere', 'BioHealth'][i % 6],
  industry: ['Enterprise Software', 'Fintech', 'Cloud Infrastructure', 'Artificial Intelligence', 'Data Analytics', 'HealthTech'][i % 6],
  location: ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Boston, MA', 'Austin, TX', 'Remote'][i % 6],
  employeeCount: ['1,000 - 5,000', '500 - 1,000', '250 - 500', '100 - 250'][i % 4],
  openRolesCount: ((i * 3) % 15) + 2,
}));

export function CompaniesPage() {
  const [page, setPage] = useState(1);

  return (
    <>
      <SEO title="Explore Hiring Companies — TrusonHub Job Searcher" description="Discover top global companies hiring now." />

      <Box sx={{ py: 6, bgcolor: 'background.surface', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
            Top Employers Directory
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Explore company profiles, work culture, and open positions.
          </Typography>

          <Paper sx={{ p: { xs: 2, md: 2.5 }, borderRadius: '16px', overflow: 'hidden' }}>
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems="center">
              <Box sx={{ width: '100%', flex: { md: 5 } }}>
                <AppInput type="search" placeholder="Search companies by name or industry..." fullWidth />
              </Box>
              <Box sx={{ width: '100%', flex: { md: 4 } }}>
                <AppSelect
                  label="Industry"
                  options={[
                    { label: 'All Industries', value: 'all' },
                    { label: 'Enterprise Software', value: 'software' },
                    { label: 'Fintech', value: 'fintech' },
                    { label: 'AI & ML', value: 'ai' },
                    { label: 'HealthTech', value: 'health' },
                  ]}
                  defaultValue="all"
                />
              </Box>
              <Box sx={{ width: '100%', flex: { md: 3 } }}>
                <Button fullWidth variant="contained" size="large" startIcon={<SearchIcon />} sx={{ height: 56, borderRadius: '12px', fontWeight: 700 }}>
                  Search Companies
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {MOCK_COMPANIES_LIST.map((company) => (
            <Grid key={company.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <CompanyCard {...company} />
            </Grid>
          ))}
        </Grid>

        <Stack alignItems="center">
          <Pagination count={5} page={page} onChange={(_, p) => setPage(p)} color="primary" size="large" shape="rounded" />
        </Stack>
      </Container>
    </>
  );
}
