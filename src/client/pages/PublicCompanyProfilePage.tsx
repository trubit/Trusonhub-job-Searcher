import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Avatar,
  Grid,
  Button,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import GroupsIcon from '@mui/icons-material/Groups';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CollectionsIcon from '@mui/icons-material/Collections';
import { companyApi, CompanyData } from '../features/company/services/companyApi';
import { SEO } from '../components/seo/SEO';

export function PublicCompanyProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!id) return;

    companyApi
      .getCompany(id)
      .then((res) => {
        setCompany(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Company profile not found');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ py: 12, textAlign: 'center' }}>
        <CircularProgress size={48} color="primary" />
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Loading company profile...
        </Typography>
      </Box>
    );
  }

  if (error || !company) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
          Company Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {error || 'The requested company profile does not exist or has been removed.'}
        </Typography>
        <Button component={Link} to="/companies" variant="contained" color="primary">
          Browse Companies
        </Button>
      </Container>
    );
  }

  return (
    <>
      <SEO title={`${company.name} — Company Profile`} />

      {/* Header Banner */}
      <Box sx={{ py: 6, bgcolor: 'background.surface', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'center', sm: 'flex-start' }}>
              <Avatar
                src={company.logoUrl}
                alt={company.name}
                variant="rounded"
                sx={{
                  width: { xs: 90, sm: 110 },
                  height: { xs: 90, sm: 110 },
                  borderRadius: '20px',
                  bgcolor: 'secondary.main',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}
              >
                {company.name.charAt(0)}
              </Avatar>

              <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'center', sm: 'flex-start' }} sx={{ mb: 0.5 }}>
                  <Typography variant="h4" fontWeight={800}>
                    {company.name}
                  </Typography>
                  {company.isVerified && <VerifiedIcon color="primary" sx={{ fontSize: 24 }} />}
                </Stack>

                <Typography variant="h6" color="text.secondary" fontWeight={500} sx={{ mb: 2 }}>
                  {company.industry}
                </Typography>

                <Stack direction="row" spacing={3} flexWrap="wrap" justifyContent={{ xs: 'center', sm: 'flex-start' }} gap={1.5} color="text.secondary">
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <LocationOnIcon fontSize="small" />
                    <Typography variant="body2">{company.headquarters}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <PeopleIcon fontSize="small" />
                    <Typography variant="body2">{company.companySize} Employees</Typography>
                  </Stack>
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <LanguageIcon fontSize="small" color="primary" />
                        <Typography variant="body2" color="primary.main" fontWeight={600}>{company.website}</Typography>
                      </Stack>
                    </a>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* Main Interactive Company Profile Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Interactive Clickable Tabs for Company Profile: About, Culture, Benefits, Gallery */}
        <Paper sx={{ borderRadius: '20px', mb: 4, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              px: 3,
              bgcolor: 'background.paper',
              '& .MuiTab-root': { fontWeight: 700, py: 2, fontSize: '0.95rem' }
            }}
          >
            <Tab icon={<InfoIcon />} iconPosition="start" label="About" />
            <Tab icon={<GroupsIcon />} iconPosition="start" label="Culture" />
            <Tab icon={<CardGiftcardIcon />} iconPosition="start" label={`Benefits (${company.benefits?.length || 0})`} />
            <Tab icon={<CollectionsIcon />} iconPosition="start" label={`Gallery (${company.gallery?.length || 0})`} />
          </Tabs>

          <Box sx={{ p: { xs: 3, md: 4 } }}>
            {/* 1. ABOUT TAB */}
            {activeTab === 0 && (
              <Stack spacing={4}>
                <Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
                    About {company.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {company.description || 'No description provided for this company profile yet.'}
                  </Typography>
                </Box>

                {(company.mission || company.vision) && (
                  <Grid container spacing={3} sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    {company.mission && (
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3, borderRadius: '16px', bgcolor: 'action.hover' }}>
                          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                            Our Mission
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            {company.mission}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                    {company.vision && (
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3, borderRadius: '16px', bgcolor: 'action.hover' }}>
                          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                            Our Vision
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            {company.vision}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                )}

                <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                    Company Details & Quick Facts
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 4 }}>
                      <Paper sx={{ p: 2, borderRadius: '12px', border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.secondary" display="block">Industry</Typography>
                        <Typography variant="body2" fontWeight={700}>{company.industry}</Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4 }}>
                      <Paper sx={{ p: 2, borderRadius: '12px', border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.secondary" display="block">Company Size</Typography>
                        <Typography variant="body2" fontWeight={700}>{company.companySize} employees</Typography>
                      </Paper>
                    </Grid>
                    {company.foundedYear && (
                      <Grid size={{ xs: 6, sm: 4 }}>
                        <Paper sx={{ p: 2, borderRadius: '12px', border: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="caption" color="text.secondary" display="block">Founded Year</Typography>
                          <Typography variant="body2" fontWeight={700}>{company.foundedYear}</Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Stack>
            )}

            {/* 2. CULTURE TAB */}
            {activeTab === 1 && (
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={700}>
                  Workplace Environment & Culture
                </Typography>
                {company.culture ? (
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {company.culture}
                  </Typography>
                ) : (
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '16px' }}>
                    <Typography variant="body2" color="text.secondary">
                      Company culture details have not been published yet.
                    </Typography>
                  </Paper>
                )}
              </Stack>
            )}

            {/* 3. BENEFITS TAB */}
            {activeTab === 2 && (
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={700}>
                  Employee Benefits & Perks
                </Typography>
                {!company.benefits || company.benefits.length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '16px' }}>
                    <Typography variant="body2" color="text.secondary">
                      No employee benefits listed for this company yet.
                    </Typography>
                  </Paper>
                ) : (
                  <Grid container spacing={2}>
                    {company.benefits.map((b, idx) => (
                      <Grid key={idx} size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <CheckCircleIcon color="primary" sx={{ fontSize: 20 }} />
                            <Typography variant="body2" fontWeight={600}>{b}</Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Stack>
            )}

            {/* 4. GALLERY TAB */}
            {activeTab === 3 && (
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={700}>
                  Company Life & Office Photo Gallery
                </Typography>
                {!company.gallery || company.gallery.length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '16px' }}>
                    <Typography variant="body2" color="text.secondary">
                      No office or team photos added to the gallery yet.
                    </Typography>
                  </Paper>
                ) : (
                  <Grid container spacing={2}>
                    {company.gallery.map((img, idx) => (
                      <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Box
                          component="img"
                          src={img.url}
                          alt={img.caption || `Company photo ${idx + 1}`}
                          sx={{
                            width: '100%',
                            height: 220,
                            objectFit: 'cover',
                            borderRadius: '16px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Stack>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
}
