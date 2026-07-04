import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Avatar,
  Chip,
  Grid,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Card as MuiCard,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import VerifiedIcon from '@mui/icons-material/Verified';
import CodeIcon from '@mui/icons-material/Code';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import { profileApi } from '../features/profile/services/profileApi';
import { JobSeekerProfileData } from '../features/profile/types/profile.types';
import { SEO } from '../components/seo/SEO';

export function PublicCandidateProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<JobSeekerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!username) return;

    profileApi
      .getPublicProfile(username)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Candidate profile not found');
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return (
      <Box sx={{ py: 12, textAlign: 'center' }}>
        <CircularProgress size={48} color="primary" />
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Loading candidate profile...
        </Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <SEO title="Candidate Profile Not Found | TrusonHub" />
        <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
          Profile Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {error || 'The requested candidate profile does not exist or has been removed.'}
        </Typography>
        <Button component={Link} to="/jobs" variant="contained" color="primary">
          Back to Job Search
        </Button>
      </Container>
    );
  }

  const { user, profile, experience, education, skills, certifications, portfolio } = data;

  return (
    <>
      <SEO title={`${user.firstName} ${user.lastName} — Job Seeker Profile`} />

      {/* Header Banner */}
      <Box sx={{ py: 6, bgcolor: 'background.surface', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'center', sm: 'flex-start' }}>
              <Avatar
                src={user.avatarUrl}
                alt={user.firstName}
                sx={{
                  width: { xs: 90, sm: 110 },
                  height: { xs: 90, sm: 110 },
                  borderRadius: '24px',
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}
              >
                {user.firstName.charAt(0)}
              </Avatar>

              <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'center', sm: 'flex-start' }} sx={{ mb: 0.5 }}>
                  <Typography variant="h4" fontWeight={800}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  {user.isEmailVerified && <VerifiedIcon color="primary" sx={{ fontSize: 24 }} />}
                </Stack>

                <Typography variant="h6" color="primary.main" fontWeight={600} sx={{ mb: 1.5 }}>
                  {profile.headline || profile.currentPosition || 'Professional Candidate'}
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent={{ xs: 'center', sm: 'flex-start' }} gap={1} color="text.secondary">
                  {profile.location?.city && (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <LocationOnIcon fontSize="small" />
                      <Typography variant="body2">{profile.location.city}, {profile.location.country}</Typography>
                    </Stack>
                  )}
                  {profile.yearsOfExperience !== undefined && (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <WorkIcon fontSize="small" />
                      <Typography variant="body2">{profile.yearsOfExperience} Years Experience</Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* Main Interactive Profile Sections */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Interactive Clickable Tabs for Job Seeker Profile: Bio, Experience, Skills, Education, Portfolio */}
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
            <Tab icon={<PersonIcon />} iconPosition="start" label="Bio" />
            <Tab icon={<WorkIcon />} iconPosition="start" label={`Experience (${experience.length})`} />
            <Tab icon={<StarIcon />} iconPosition="start" label={`Skills (${skills.length})`} />
            <Tab icon={<SchoolIcon />} iconPosition="start" label={`Education (${education.length})`} />
            <Tab icon={<CodeIcon />} iconPosition="start" label={`Portfolio (${portfolio.length})`} />
          </Tabs>

          <Box sx={{ p: { xs: 3, md: 4 } }}>
            {/* 1. BIO TAB */}
            {activeTab === 0 && (
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={700}>
                  Professional Bio & Summary
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {profile.about || 'No professional bio provided yet for this job seeker profile.'}
                </Typography>

                {profile.socialLinks && (
                  <Box sx={{ pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                      Social & Professional Connections
                    </Typography>
                    <Stack direction="row" spacing={3} flexWrap="wrap" gap={2}>
                      {profile.socialLinks.linkedin && (
                        <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <LinkedInIcon color="primary" />
                            <Typography variant="body2" color="primary.main" fontWeight={600}>LinkedIn Profile</Typography>
                          </Stack>
                        </a>
                      )}
                      {profile.socialLinks.github && (
                        <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <GitHubIcon />
                            <Typography variant="body2" color="text.primary" fontWeight={600}>GitHub Portfolio</Typography>
                          </Stack>
                        </a>
                      )}
                      {profile.socialLinks.portfolio && (
                        <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <LanguageIcon color="action" />
                            <Typography variant="body2" fontWeight={600}>Personal Website</Typography>
                          </Stack>
                        </a>
                      )}
                    </Stack>
                  </Box>
                )}
              </Stack>
            )}

            {/* 2. EXPERIENCE TAB */}
            {activeTab === 1 && (
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={700}>
                  Work Experience History
                </Typography>
                {experience.length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '16px' }}>
                    <Typography variant="body2" color="text.secondary">
                      No work experience added to this profile yet.
                    </Typography>
                  </Paper>
                ) : (
                  <Stack spacing={3}>
                    {experience.map((exp) => (
                      <Box key={exp._id} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: '16px' }}>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {exp.position}
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight={600}>
                          {exp.companyName} ({exp.employmentType ? exp.employmentType.replace('_', ' ') : 'Full Time'})
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ my: 0.5 }}>
                          {new Date(exp.startDate).toLocaleDateString()} — {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                        {exp.responsibilities && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {exp.responsibilities}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Stack>
                )}
              </Stack>
            )}

            {/* 3. SKILLS TAB */}
            {activeTab === 2 && (
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={700}>
                  Skills & Core Competencies
                </Typography>
                {skills.length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '16px' }}>
                    <Typography variant="body2" color="text.secondary">
                      No skills listed on this profile yet.
                    </Typography>
                  </Paper>
                ) : (
                  <Stack direction="row" spacing={1.5} flexWrap="wrap" gap={1.5}>
                    {skills.map((skill) => (
                      <Chip
                        key={skill._id}
                        label={`${skill.name} • ${skill.level}`}
                        color="primary"
                        variant="outlined"
                        sx={{ px: 1, py: 2, fontSize: '0.9rem', fontWeight: 600 }}
                      />
                    ))}
                  </Stack>
                )}

                {certifications.length > 0 && (
                  <Box sx={{ pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                      Certifications & Badges
                    </Typography>
                    <Grid container spacing={2}>
                      {certifications.map((cert) => (
                        <Grid key={cert._id} size={{ xs: 12, sm: 6 }}>
                          <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
                            <Typography variant="subtitle2" fontWeight={700}>{cert.name}</Typography>
                            <Typography variant="caption" color="text.secondary">Issued by {cert.organization}</Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Stack>
            )}

            {/* 4. EDUCATION TAB */}
            {activeTab === 3 && (
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={700}>
                  Academic Education
                </Typography>
                {education.length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '16px' }}>
                    <Typography variant="body2" color="text.secondary">
                      No education credentials listed on this profile yet.
                    </Typography>
                  </Paper>
                ) : (
                  <Stack spacing={3}>
                    {education.map((edu) => (
                      <Stack key={edu._id} direction="row" spacing={2} alignItems="flex-start" sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: '16px' }}>
                        <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700}>
                            {edu.degree} in {edu.fieldOfStudy}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {edu.institution}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Stack>
            )}

            {/* 5. PORTFOLIO TAB */}
            {activeTab === 4 && (
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={700}>
                  Featured Portfolio & Projects
                </Typography>
                {portfolio.length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '16px' }}>
                    <Typography variant="body2" color="text.secondary">
                      No portfolio projects showcased on this profile yet.
                    </Typography>
                  </Paper>
                ) : (
                  <Grid container spacing={3}>
                    {portfolio.map((item) => (
                      <Grid key={item._id} size={{ xs: 12, sm: 6 }}>
                        <MuiCard sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: '16px', height: '100%' }}>
                          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                            {item.projectName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {item.description}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                            {item.technologies?.map((tech, idx) => (
                              <Chip key={idx} label={tech} size="small" variant="outlined" />
                            ))}
                          </Stack>
                        </MuiCard>
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
