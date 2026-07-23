import { useEffect, useState } from 'react';
import { Box, Container, Typography, Stack, Grid, Paper, Button, Pagination, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { AppInput } from '../components/ui/AppInput';
import { AppSelect } from '../components/ui/AppSelect';
import { CompanyCard } from '../components/cards/CompanyCard';
import { SEO } from '../components/seo/SEO';
import { companyApi, CompanyData } from '../features/company/services/companyApi';

export function CompaniesPage() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  useEffect(() => {
    async function fetchCompaniesList() {
      try {
        setLoading(true);
        const data = await companyApi.getAllCompanies();
        setCompanies(data || []);
      } catch (err) {
        console.error('Failed to load companies:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCompaniesList();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      !searchTerm ||
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.headquarters.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry =
      selectedIndustry === 'all' ||
      company.industry.toLowerCase().includes(selectedIndustry.toLowerCase());

    return matchesSearch && matchesIndustry;
  });

  return (
    <>
      <SEO title="Explore Hiring Companies — Talentra" description="Discover top global companies hiring now." />

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
                <AppInput
                  type="search"
                  placeholder="Search companies by name or industry..."
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value as string)}
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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredCompanies.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px solid', borderColor: 'divider', mb: 6 }}>
            <Typography variant="body1" color="text.secondary">
              No companies match your filters.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {filteredCompanies.map((company) => (
              <Grid key={company._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <CompanyCard {...company} />
              </Grid>
            ))}
          </Grid>
        )}

        <Stack alignItems="center">
          <Pagination count={5} page={page} onChange={(_, p) => setPage(p)} color="primary" size="large" shape="rounded" />
        </Stack>
      </Container>
    </>
  );
}
