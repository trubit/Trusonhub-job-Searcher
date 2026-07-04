import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiSelectItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Divider,
  CircularProgress,
  Avatar,
  Tooltip,
  Badge,
  Alert,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import GroupsIcon from '@mui/icons-material/Groups';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CollectionsIcon from '@mui/icons-material/Collections';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BrushIcon from '@mui/icons-material/Brush';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { companyApi, CompanyData } from '../features/company/services/companyApi';
import { profileApi } from '../features/profile/services/profileApi';
import { jobApi, JobData } from '../features/jobs/services/jobApi';
import { AppSpinner } from '../components/feedback/AppSpinner';
import { AppAlert } from '../components/feedback/AppAlert';
import { SEO } from '../components/seo/SEO';
import { apiClient } from '../services/apiClient';
import { applicationApi, JobApplicationData } from '../features/applications/services/applicationApi';
import WorkIcon from '@mui/icons-material/Work';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const AVAILABLE_BENEFITS = [
  'Health Insurance',
  'Paid Leave',
  'Bonuses',
  'Remote Work',
  'Flexible Hours',
  'Learning Budget',
  'Stock Options',
  'Gym Membership',
];

interface UserAccountData {
  id?: string;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role?: string;
}

interface EmployerProfileDetails {
  position?: string;
  department?: string;
  businessEmail?: string;
  phone?: string;
}

// ─── EMPLOYER PROFILE DIALOG ────────────────────────────────────────────────
function EmployerProfileDialog({
  open, profile, user, onClose, onSaved
}: {
  open: boolean;
  profile: EmployerProfileDetails | null;
  user: UserAccountData | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    position: profile?.position || '',
    department: profile?.department || '',
    businessEmail: profile?.businessEmail || '',
    phone: profile?.phone || '',
  });

  const handleSave = async () => {
    setSaving(true); setError(null);
    try {
      await profileApi.updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        position: form.position,
        department: form.department,
        businessEmail: form.businessEmail,
        phone: form.phone,
      } as never);
      onSaved();
      onClose();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setError(ax.response?.data?.message || 'Failed to update profile.');
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Edit Employer Profile</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {error && <AppAlert severity="error">{error}</AppAlert>}
          <TextField label="First Name" fullWidth value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <TextField label="Last Name" fullWidth value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          <TextField label="Job Title / Position" fullWidth value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
          <TextField label="Department" fullWidth value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <TextField label="Business Email" fullWidth value={form.businessEmail} onChange={(e) => setForm({ ...form, businessEmail: e.target.value })} />
          <TextField label="Phone Number" fullWidth value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="secondary" onClick={handleSave} disabled={saving} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── COMPANY EDIT DIALOG ─────────────────────────────────────────────────────
function CompanyEditDialog({
  open, company, onClose, onSaved
}: {
  open: boolean;
  company: CompanyData | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', industry: '', companySize: '11-50', headquarters: '', website: '', description: '',
    mission: '', vision: '', culture: '', foundedYear: '',
    contact_email: '', contact_phone: '', contact_country: '', contact_state: '', contact_city: '', contact_address: '',
    social_linkedin: '', social_facebook: '', social_twitter: '', social_instagram: '', social_youtube: '',
  });

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name || '',
        industry: company.industry || '',
        companySize: company.companySize || '11-50',
        headquarters: company.headquarters || '',
        website: company.website || '',
        description: company.description || '',
        mission: company.mission || '',
        vision: company.vision || '',
        culture: company.culture || '',
        foundedYear: company.foundedYear ? String(company.foundedYear) : '',
        contact_email: company.contactInfo?.email || '',
        contact_phone: company.contactInfo?.phone || '',
        contact_country: company.contactInfo?.country || '',
        contact_state: company.contactInfo?.state || '',
        contact_city: company.contactInfo?.city || '',
        contact_address: company.contactInfo?.address || '',
        social_linkedin: company.socialLinks?.linkedin || '',
        social_facebook: company.socialLinks?.facebook || '',
        social_twitter: company.socialLinks?.twitter || '',
        social_instagram: company.socialLinks?.instagram || '',
        social_youtube: company.socialLinks?.youtube || '',
      });
    } else {
      setForm({
        name: '', industry: '', companySize: '11-50', headquarters: '', website: '', description: '',
        mission: '', vision: '', culture: '', foundedYear: '',
        contact_email: '', contact_phone: '', contact_country: '', contact_state: '', contact_city: '', contact_address: '',
        social_linkedin: '', social_facebook: '', social_twitter: '', social_instagram: '', social_youtube: '',
      });
    }
  }, [company, open]);

  const handleSave = async () => {
    if (!form.name || !form.industry || !form.headquarters || !form.description) {
      setError('Name, industry, headquarters, and description are required.');
      return;
    }
    setSaving(true); setError(null);
    try {
      const payload = {
        name: form.name,
        industry: form.industry,
        companySize: form.companySize as never,
        headquarters: form.headquarters,
        website: form.website,
        description: form.description,
        mission: form.mission,
        vision: form.vision,
        culture: form.culture,
        foundedYear: form.foundedYear ? Number(form.foundedYear) : undefined,
        contactInfo: {
          email: form.contact_email,
          phone: form.contact_phone,
          country: form.contact_country,
          state: form.contact_state,
          city: form.contact_city,
          address: form.contact_address,
        },
        socialLinks: {
          linkedin: form.social_linkedin,
          facebook: form.social_facebook,
          twitter: form.social_twitter,
          instagram: form.social_instagram,
          youtube: form.social_youtube,
        },
      };

      if (company) {
        await companyApi.updateCompany(company._id, payload);
      } else {
        await companyApi.createCompany(payload);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setError(ax.response?.data?.message || 'Failed to save company.');
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ fontWeight: 700 }}>{company ? 'Edit Company Profile' : 'Register New Company'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ pt: 1 }}>
          {error && <AppAlert severity="error">{error}</AppAlert>}
          <Typography variant="subtitle2" fontWeight={700}>Basic Information</Typography>
          <TextField label="Company Name *" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Industry *" fullWidth value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Company Size</InputLabel>
                <Select label="Company Size" value={form.companySize} onChange={(e) => setForm({ ...form, companySize: e.target.value })}>
                  <MuiSelectItem value="1-10">1 - 10 employees</MuiSelectItem>
                  <MuiSelectItem value="11-50">11 - 50 employees</MuiSelectItem>
                  <MuiSelectItem value="51-200">51 - 200 employees</MuiSelectItem>
                  <MuiSelectItem value="201-500">201 - 500 employees</MuiSelectItem>
                  <MuiSelectItem value="501-1000">501 - 1000 employees</MuiSelectItem>
                  <MuiSelectItem value="1000+">1000+ employees</MuiSelectItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Headquarters Location *" fullWidth placeholder="San Francisco, CA" value={form.headquarters} onChange={(e) => setForm({ ...form, headquarters: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Website URL" fullWidth placeholder="https://website.com" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Founded Year" type="number" fullWidth placeholder="e.g. 2015" value={form.foundedYear} onChange={(e) => setForm({ ...form, foundedYear: e.target.value })} /></Grid>
          </Grid>
          <TextField label="Description / Overview *" multiline minRows={3} fullWidth value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextField label="Mission" multiline minRows={2} fullWidth value={form.mission} onChange={(e) => setForm({ ...form, mission: e.target.value })} />
          <TextField label="Vision" multiline minRows={2} fullWidth value={form.vision} onChange={(e) => setForm({ ...form, vision: e.target.value })} />
          <TextField label="Workplace &amp; Culture" multiline minRows={2} fullWidth placeholder="Describe core values, hybrid work policies, etc." value={form.culture} onChange={(e) => setForm({ ...form, culture: e.target.value })} />

          <Divider />
          <Typography variant="subtitle2" fontWeight={700}>Contact Information</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Business Email" fullWidth value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Business Phone" fullWidth value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Country" fullWidth value={form.contact_country} onChange={(e) => setForm({ ...form, contact_country: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="State / Region" fullWidth value={form.contact_state} onChange={(e) => setForm({ ...form, contact_state: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="City" fullWidth value={form.contact_city} onChange={(e) => setForm({ ...form, contact_city: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Address" fullWidth value={form.contact_address} onChange={(e) => setForm({ ...form, contact_address: e.target.value })} /></Grid>
          </Grid>

          <Divider />
          <Typography variant="subtitle2" fontWeight={700}>Social Links</Typography>
          <TextField label="LinkedIn Profile URL" fullWidth value={form.social_linkedin} onChange={(e) => setForm({ ...form, social_linkedin: e.target.value })} />
          <TextField label="Facebook Page URL" fullWidth value={form.social_facebook} onChange={(e) => setForm({ ...form, social_facebook: e.target.value })} />
          <TextField label="X / Twitter URL" fullWidth value={form.social_twitter} onChange={(e) => setForm({ ...form, social_twitter: e.target.value })} />
          <TextField label="Instagram Profile URL" fullWidth value={form.social_instagram} onChange={(e) => setForm({ ...form, social_instagram: e.target.value })} />
          <TextField label="YouTube Channel URL" fullWidth value={form.social_youtube} onChange={(e) => setForm({ ...form, social_youtube: e.target.value })} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="secondary" onClick={handleSave} disabled={saving} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}>
          {company ? 'Save Changes' : 'Create Company'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── BENEFITS EDIT DIALOG ───────────────────────────────────────────────────
function BenefitsDialog({
  open, selectedBenefits, onClose, onSaved
}: {
  open: boolean;
  selectedBenefits: string[];
  onClose: () => void;
  onSaved: (benefits: string[]) => void;
}) {
  const [benefits, setBenefits] = useState<string[]>([]);

  useEffect(() => {
    setBenefits(selectedBenefits || []);
  }, [selectedBenefits, open]);

  const toggleBenefit = (b: string) => {
    if (benefits.includes(b)) {
      setBenefits(benefits.filter((item) => item !== b));
    } else {
      setBenefits([...benefits, b]);
    }
  };

  const handleSave = () => {
    onSaved(benefits);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Select Company Benefits</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1} sx={{ pt: 1 }}>
          {AVAILABLE_BENEFITS.map((b) => (
            <FormControlLabel
              key={b}
              control={<Checkbox checked={benefits.includes(b)} onChange={() => toggleBenefit(b)} />}
              label={b}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="secondary" onClick={handleSave}>
          Apply Perks
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── STATUS CONFIG HELPER ───────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { color: 'default' | 'primary' | 'warning' | 'error' | 'success' | 'secondary'; label: string; icon: React.ReactNode }> = {
  SUBMITTED: { color: 'primary', label: 'Submitted', icon: <HourglassEmptyIcon fontSize="small" /> },
  REVIEWING: { color: 'warning', label: 'Reviewing', icon: <VisibilityIcon fontSize="small" /> },
  SHORTLISTED: { color: 'secondary', label: 'Shortlisted', icon: <StarIcon fontSize="small" /> },
  REJECTED: { color: 'error', label: 'Rejected', icon: <CancelIcon fontSize="small" /> },
  ACCEPTED: { color: 'success', label: 'Accepted', icon: <CheckCircleIcon fontSize="small" /> },
};

// ─── APPLICANTS TAB ──────────────────────────────────────────────────────────
function ApplicantsTab({ jobs, selectedCompanyId }: { jobs: JobData[]; selectedCompanyId: string | null }) {
  const companyJobs = jobs.filter((j) => j.company?._id === selectedCompanyId);
  const [selectedJobId, setSelectedJobId] = useState<string>(companyJobs[0]?._id || '');
  const [applications, setApplications] = useState<JobApplicationData[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<{ text: string; name: string } | null>(null);

  useEffect(() => {
    if (companyJobs.length > 0 && !selectedJobId) {
      setSelectedJobId(companyJobs[0]._id);
    }
  }, [companyJobs, selectedJobId]);

  useEffect(() => {
    if (!selectedJobId) return;
    async function fetchApps() {
      try {
        setLoadingApps(true);
        const data = await applicationApi.getJobApplications(selectedJobId);
        setApplications(data || []);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
        setApplications([]);
      } finally {
        setLoadingApps(false);
      }
    }
    fetchApps();
  }, [selectedJobId]);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      setUpdatingId(appId);
      await applicationApi.updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus as JobApplicationData['status'] } : a))
      );
      setSuccessMsg(`Status updated to ${newStatus}. Applicant notified via email.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (companyJobs.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px dashed', borderColor: 'divider' }}>
        <PeopleAltIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" fontWeight={700} color="text.secondary">
          No job postings yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Post a job first to start receiving and managing applications.
        </Typography>
      </Paper>
    );
  }

  const selectedJob = companyJobs.find((j) => j._id === selectedJobId);
  const statusCounts = applications.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <Stack spacing={3}>
      {successMsg && <Alert severity="success" sx={{ borderRadius: '12px' }}>{successMsg}</Alert>}

      {/* Job selector */}
      <Box>
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>Select a Job Listing</Typography>
        <Stack direction="row" spacing={1.5} flexWrap="wrap" gap={1.5}>
          {companyJobs.map((j) => (
            <Chip
              key={j._id}
              label={j.title}
              onClick={() => setSelectedJobId(j._id)}
              color={selectedJobId === j._id ? 'primary' : 'default'}
              variant={selectedJobId === j._id ? 'filled' : 'outlined'}
              sx={{ fontWeight: 600, cursor: 'pointer' }}
            />
          ))}
        </Stack>
      </Box>

      {/* Stats row */}
      {selectedJob && (
        <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
          <Paper variant="outlined" sx={{ px: 2, py: 1, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleAltIcon fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight={700}>{applications.length} Total Applications</Typography>
          </Paper>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            statusCounts[key] ? (
              <Chip key={key} label={`${cfg.label}: ${statusCounts[key]}`} color={cfg.color} size="small" sx={{ fontWeight: 600 }} />
            ) : null
          ))}
        </Stack>
      )}

      {/* Applications list */}
      {loadingApps ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : applications.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px dashed', borderColor: 'divider' }}>
          <PeopleAltIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1.5 }} />
          <Typography variant="body1" fontWeight={600} color="text.secondary">No applications yet for this job</Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>Applications will appear here as candidates apply.</Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {applications.map((app) => {
            const applicant = typeof app.applicant === 'object' ? app.applicant : null;
            const cfg = STATUS_CONFIG[app.status];
            return (
              <Paper
                key={app._id}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s',
                  '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.06)', borderColor: 'primary.main' },
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  {/* Applicant info */}
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 800, width: 48, height: 48 }}>
                        {applicant ? applicant.firstName.charAt(0) : '?'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={800}>
                          {applicant ? `${applicant.firstName} ${applicant.lastName}` : 'Unknown Applicant'}
                        </Typography>
                        {applicant?.email && (
                          <Typography variant="caption" color="text.secondary">{applicant.email}</Typography>
                        )}
                        {applicant?.phoneNumber && (
                          <Typography variant="caption" color="text.secondary" display="block">{applicant.phoneNumber}</Typography>
                        )}
                        <Typography variant="caption" color="text.disabled">
                          Applied: {new Date(app.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  {/* Status + Actions */}
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack spacing={1}>
                      <Chip
                        icon={cfg?.icon as React.ReactElement}
                        label={cfg?.label || app.status}
                        color={cfg?.color || 'default'}
                        size="small"
                        sx={{ fontWeight: 700, width: 'fit-content' }}
                      />
                      <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel>Update Status</InputLabel>
                        <Select
                          value=""
                          label="Update Status"
                          disabled={updatingId === app._id}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        >
                          {['SUBMITTED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED']
                            .filter((s) => s !== app.status)
                            .map((s) => (
                              <MuiSelectItem key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</MuiSelectItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>

                  {/* Resume + Cover Letter */}
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Stack spacing={1}>
                      {app.resume?.fileUrl && (
                        <Tooltip title="Open Resume">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<OpenInNewIcon />}
                            href={app.resume.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ fontSize: '0.75rem' }}
                          >
                            View Resume
                          </Button>
                        </Tooltip>
                      )}
                      {app.coverLetter && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          startIcon={<VisibilityIcon />}
                          onClick={() => setCoverPreview({ text: app.coverLetter!, name: applicant ? `${applicant.firstName} ${applicant.lastName}` : 'Applicant' })}
                          sx={{ fontSize: '0.75rem' }}
                        >
                          Cover Letter
                        </Button>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Stack>
      )}

      {/* Cover Letter Preview Dialog */}
      <Dialog open={!!coverPreview} onClose={() => setCoverPreview(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Cover Letter — {coverPreview?.name}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {coverPreview?.text}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCoverPreview(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

// ─── MAIN PORTAL PAGE ────────────────────────────────────────────────────────
export function EmployerCompanyDashboardPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [employerProfile, setEmployerProfile] = useState<EmployerProfileDetails | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccountData | null>(null);

  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editCompanyTarget, setEditCompanyTarget] = useState<CompanyData | null>(null);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [message, setMessage] = useState<{ text: string; severity: 'success' | 'error' | 'info' } | null>(null);

  // Upload/Deleting state variables
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [deletingGalleryId, setDeletingGalleryId] = useState<string | null>(null);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [employerProfileDialogOpen, setEmployerProfileDialogOpen] = useState(false);
  const [benefitsDialogOpen, setBenefitsDialogOpen] = useState(false);
  
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const data = await jobApi.getEmployerJobs();
      setJobs(data || []);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const showMsg = (text: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setMessage({ text, severity });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchProfileAndCompanies = async () => {
    try {
      fetchJobs();
      const p = await profileApi.getMyProfile();
      setEmployerProfile(p.profile as never);
      setUserAccount(p.user as never);

      const data = await companyApi.getMyCompanies();
      setCompanies(data || []);
      if (data && data.length > 0 && !selectedCompanyId) {
        setSelectedCompanyId(data[0]._id);
      }
    } catch (err) {
      console.error('Failed to load profile and companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateCompanyClick = () => {
    setEditCompanyTarget(null);
    setOpenModal(true);
  };

  const handleEditCompanyClick = () => {
    const selected = companies.find((c) => c._id === selectedCompanyId);
    if (selected) {
      setEditCompanyTarget(selected);
      setOpenModal(true);
    }
  };

  const handleDeleteCompanyClick = async () => {
    if (!selectedCompanyId) return;
    if (window.confirm('Are you absolutely sure you want to delete this company profile? This action is permanent.')) {
      try {
        await companyApi.deleteCompany(selectedCompanyId);
        showMsg('Company profile deleted.');
        const updated = companies.filter((c) => c._id !== selectedCompanyId);
        setCompanies(updated);
        setSelectedCompanyId(updated.length > 0 ? updated[0]._id : null);
      } catch {
        showMsg('Failed to delete company profile.', 'error');
      }
    }
  };

  // Avatar Upload / Delete handlers
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assetType', 'PROFILE_PHOTO');

    try {
      setUploadingAvatar(true);
      await apiClient.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchProfileAndCompanies();
      showMsg('Profile avatar updated!');
    } catch {
      showMsg('Failed to upload profile avatar.', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setUploadingAvatar(true);
      await profileApi.deletePhoto();
      await fetchProfileAndCompanies();
      showMsg('Profile avatar removed.');
    } catch {
      showMsg('Failed to remove avatar.', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Logo Upload / Delete handlers
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedCompanyId) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assetType', 'COMPANY_LOGO');
    formData.append('targetId', selectedCompanyId);

    try {
      setUploadingLogo(true);
      await apiClient.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchProfileAndCompanies();
      showMsg('Company logo uploaded successfully!');
    } catch {
      showMsg('Failed to upload company logo.', 'error');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!selectedCompanyId) return;
    try {
      setUploadingLogo(true);
      // We can query the media endpoint if we had mediaId, but we can also just call updateCompany with empty logoUrl
      await companyApi.updateCompany(selectedCompanyId, { logoUrl: '' });
      await fetchProfileAndCompanies();
      showMsg('Company logo removed.');
    } catch {
      showMsg('Failed to remove company logo.', 'error');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Cover Upload / Delete handlers
  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedCompanyId) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assetType', 'COVER_IMAGE');
    formData.append('targetId', selectedCompanyId);

    try {
      setUploadingCover(true);
      await apiClient.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchProfileAndCompanies();
      showMsg('Company cover image uploaded!');
    } catch {
      showMsg('Failed to upload cover image.', 'error');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleDeleteCover = async () => {
    if (!selectedCompanyId) return;
    try {
      setUploadingCover(true);
      await companyApi.updateCompany(selectedCompanyId, { coverImageUrl: '' });
      await fetchProfileAndCompanies();
      showMsg('Company cover image removed.');
    } catch {
      showMsg('Failed to remove cover image.', 'error');
    } finally {
      setUploadingCover(false);
    }
  };

  // Gallery Upload / Delete handlers
  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedCompanyId) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assetType', 'GALLERY');
    formData.append('targetId', selectedCompanyId);

    try {
      setUploadingGallery(true);
      await apiClient.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchProfileAndCompanies();
      showMsg('Office photo uploaded to gallery!');
    } catch {
      showMsg('Failed to upload gallery image.', 'error');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleDeleteGalleryItem = async (publicId: string) => {
    if (!selectedCompanyId) return;
    setDeletingGalleryId(publicId);
    try {
      // Find the media record to delete, or pull it directly using updateCompany by filtering gallery list
      const selected = companies.find((c) => c._id === selectedCompanyId);
      if (selected) {
        const filteredGallery = selected.gallery.filter((g) => g.publicId !== publicId);
        await companyApi.updateCompany(selectedCompanyId, { gallery: filteredGallery });
        await fetchProfileAndCompanies();
        showMsg('Gallery image deleted.');
      }
    } catch {
      showMsg('Failed to delete gallery image.', 'error');
    } finally {
      setDeletingGalleryId(null);
    }
  };

  // Save benefits handler
  const handleSaveBenefits = async (benefits: string[]) => {
    if (!selectedCompanyId) return;
    try {
      await companyApi.updateCompany(selectedCompanyId, { benefits });
      await fetchProfileAndCompanies();
      showMsg('Benefits checklist updated!');
    } catch {
      showMsg('Failed to update benefits.', 'error');
    }
  };

  if (loading) {
    return <AppSpinner fullPage label="Loading company management portal..." />;
  }

  const selectedCompany = companies.find((c) => c._id === selectedCompanyId) || companies[0];

  return (
    <>
      <SEO title="Company Management — Employer Dashboard" />

      {/* Hidden file inputs */}
      <input type="file" ref={logoInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleLogoUpload} />
      <input type="file" ref={coverInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleCoverUpload} />
      <input type="file" ref={galleryInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleGalleryUpload} />
      <input type="file" ref={avatarInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleAvatarUpload} />

      {/* Dialog Modals */}
      <EmployerProfileDialog
        open={employerProfileDialogOpen}
        profile={employerProfile}
        user={userAccount}
        onClose={() => setEmployerProfileDialogOpen(false)}
        onSaved={fetchProfileAndCompanies}
      />

      <CompanyEditDialog
        open={openModal}
        company={editCompanyTarget}
        onClose={() => setOpenModal(false)}
        onSaved={fetchProfileAndCompanies}
      />

      <BenefitsDialog
        open={benefitsDialogOpen}
        selectedBenefits={selectedCompany?.benefits || []}
        onClose={() => setBenefitsDialogOpen(false)}
        onSaved={handleSaveBenefits}
      />

      {/* Top Title Banner */}
      <Box sx={{ py: 5, bgcolor: 'background.surface', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'secondary.main', color: '#fff' }}>
                <BusinessIcon />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>Company Portal</Typography>
                <Typography variant="body1" color="text.secondary">Branding, culture, office photos, benefits, and team dashboard</Typography>
              </Box>
            </Stack>
            <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleCreateCompanyClick}>
              Add Company
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Main Container */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {message && <AppAlert severity={message.severity} sx={{ mb: 4 }}>{message.text}</AppAlert>}

        <Grid container spacing={4}>
          {/* Left Column: Employer Profile & Company list */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Employer Profile Card */}
            {userAccount && (
              <Paper sx={{ p: 3, borderRadius: '20px', mb: 4, position: 'relative' }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar src={userAccount.avatarUrl} sx={{ width: 64, height: 64, bgcolor: 'secondary.main', fontWeight: 700 }}>
                      {userAccount.firstName.charAt(0)}
                    </Avatar>
                    <Box sx={{ position: 'absolute', bottom: -5, right: -5, display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => avatarInputRef.current?.click()}
                        sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: 1, p: 0.5 }}
                      >
                        {uploadingAvatar ? <CircularProgress size={12} /> : <PhotoCameraIcon sx={{ fontSize: 14 }} />}
                      </IconButton>
                      {userAccount.avatarUrl && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={handleDeleteAvatar}
                          sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: 1, p: 0.5 }}
                        >
                          <DeleteIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight={800}>{userAccount.firstName} {userAccount.lastName}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {employerProfile?.position || 'Employer'} {employerProfile?.department ? `· ${employerProfile.department}` : ''}
                    </Typography>
                  </Box>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary"><strong>Business Email:</strong> {employerProfile?.businessEmail || userAccount.email}</Typography>
                  <Typography variant="body2" color="text.secondary"><strong>Business Phone:</strong> {employerProfile?.phone || 'No phone provided'}</Typography>
                </Stack>
                <Button size="small" variant="outlined" color="secondary" fullWidth startIcon={<EditIcon />} onClick={() => setEmployerProfileDialogOpen(true)}>
                  Edit Profile
                </Button>
              </Paper>
            )}

            {/* Companies list selector */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Your Companies</Typography>
            {companies.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '16px' }}>
                <Typography variant="body2" color="text.secondary">No registered companies found.</Typography>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {companies.map((c) => (
                  <Paper
                    key={c._id}
                    onClick={() => setSelectedCompanyId(c._id)}
                    sx={{
                      p: 3,
                      borderRadius: '16px',
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: c._id === selectedCompany?._id ? 'secondary.main' : 'divider',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { borderColor: 'secondary.main' }
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={800}>{c.name}</Typography>
                    <Typography variant="body2" color="secondary.main">{c.industry}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      {c.headquarters} • {c.companySize} employees
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            )}
          </Grid>

          {/* Right Column: Company details tabs */}
          <Grid size={{ xs: 12, md: 8 }}>
            {selectedCompany ? (
              <Paper sx={{ borderRadius: '20px', overflow: 'hidden' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.surface' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={selectedCompany.logoUrl} variant="rounded" sx={{ width: 48, height: 48, bgcolor: 'secondary.main' }}>
                        {selectedCompany.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight={800}>{selectedCompany.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{selectedCompany.industry} • Headquarters: {selectedCompany.headquarters}</Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" color="secondary" size="small" href={`/company/${selectedCompany.slug || selectedCompany._id}`} target="_blank">
                        Public View
                      </Button>
                      <Button variant="outlined" color="warning" size="small" startIcon={<EditIcon />} onClick={handleEditCompanyClick}>
                        Edit Profile
                      </Button>
                      <Button variant="outlined" color="error" size="small" startIcon={<DeleteIcon />} onClick={handleDeleteCompanyClick}>
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                </Box>

                <Tabs
                  value={tabIndex}
                  onChange={(_, val) => setTabIndex(val)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3, '& .MuiTab-root': { fontWeight: 700, py: 2 } }}
                >
                  <Tab icon={<InfoIcon />} iconPosition="start" label="About" />
                  <Tab icon={<GroupsIcon />} iconPosition="start" label="Culture" />
                  <Tab icon={<CardGiftcardIcon />} iconPosition="start" label={`Benefits (${selectedCompany.benefits?.length || 0})`} />
                  <Tab icon={<CollectionsIcon />} iconPosition="start" label={`Gallery (${selectedCompany.gallery?.length || 0})`} />
                  <Tab icon={<BrushIcon />} iconPosition="start" label="Branding" />
                  <Tab icon={<WorkIcon />} iconPosition="start" label="Job Openings" />
                  <Tab
                    icon={
                      <Badge
                        badgeContent={jobs.filter((j) => j.company?._id === selectedCompanyId).length}
                        color="primary"
                        max={99}
                      >
                        <PeopleAltIcon />
                      </Badge>
                    }
                    iconPosition="start"
                    label="Applicants"
                  />
                </Tabs>

                <Box sx={{ p: 4 }}>
                  {/* TAB 0: ABOUT */}
                  {tabIndex === 0 && (
                    <Stack spacing={3}>
                      <Typography variant="h6" fontWeight={700}>Overview</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {selectedCompany.description}
                      </Typography>

                      {selectedCompany.mission && (
                        <>
                          <Divider />
                          <Typography variant="subtitle1" fontWeight={700}>Our Mission</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedCompany.mission}</Typography>
                        </>
                      )}
                      {selectedCompany.vision && (
                        <>
                          <Divider />
                          <Typography variant="subtitle1" fontWeight={700}>Our Vision</Typography>
                          <Typography variant="body2" color="text.secondary">{selectedCompany.vision}</Typography>
                        </>
                      )}

                      <Divider />
                      <Typography variant="subtitle1" fontWeight={700}>Contact Details</Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}><Typography variant="body2"><strong>Email:</strong> {selectedCompany.contactInfo?.email || 'N/A'}</Typography></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><Typography variant="body2"><strong>Phone:</strong> {selectedCompany.contactInfo?.phone || 'N/A'}</Typography></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><Typography variant="body2"><strong>Location:</strong> {selectedCompany.contactInfo?.city || ''}{selectedCompany.contactInfo?.country ? `, ${selectedCompany.contactInfo.country}` : 'N/A'}</Typography></Grid>
                      </Grid>
                    </Stack>
                  )}

                  {/* TAB 1: CULTURE */}
                  {tabIndex === 1 && (
                    <Stack spacing={3}>
                      <Typography variant="h6" fontWeight={700}>Company Culture</Typography>
                      {selectedCompany.culture ? (
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                          {selectedCompany.culture}
                        </Typography>
                      ) : (
                        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '12px' }}>
                          <Typography variant="body2" color="text.secondary">No culture details added yet. Edit company profile to describe your workspace culture.</Typography>
                        </Paper>
                      )}
                    </Stack>
                  )}

                  {/* TAB 2: BENEFITS */}
                  {tabIndex === 2 && (
                    <Stack spacing={3}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight={700}>Benefits &amp; Perks</Typography>
                        <Button variant="outlined" color="secondary" size="small" startIcon={<EditIcon />} onClick={() => setBenefitsDialogOpen(true)}>
                          Configure Benefits
                        </Button>
                      </Stack>
                      {!selectedCompany.benefits || selectedCompany.benefits.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '12px' }}>
                          <Typography variant="body2" color="text.secondary">No company benefits selected yet. Add benefits to attract top talent.</Typography>
                        </Paper>
                      ) : (
                        <Stack direction="row" spacing={1.5} flexWrap="wrap" gap={1.5}>
                          {selectedCompany.benefits.map((b, idx) => (
                            <Chip key={idx} label={b} color="secondary" sx={{ fontWeight: 600 }} />
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  )}

                  {/* TAB 3: GALLERY */}
                  {tabIndex === 3 && (
                    <Stack spacing={3}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight={700}>Office Photo Gallery</Typography>
                        <Button variant="contained" color="secondary" size="small" component="label" startIcon={uploadingGallery ? <CircularProgress size={16} color="inherit" /> : <AddIcon />} disabled={uploadingGallery}>
                          Upload Photo
                          <input type="file" hidden accept="image/*" onChange={handleGalleryUpload} />
                        </Button>
                      </Stack>
                      {!selectedCompany.gallery || selectedCompany.gallery.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '12px' }}>
                          <Typography variant="body2" color="text.secondary">No office or team photos added to the gallery yet.</Typography>
                        </Paper>
                      ) : (
                        <Grid container spacing={2}>
                          {selectedCompany.gallery.map((img, idx) => (
                            <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
                              <Box sx={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: 160 }}>
                                <Box
                                  component="img"
                                  src={img.url}
                                  alt={img.caption || `Gallery photo ${idx + 1}`}
                                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteGalleryItem(img.publicId)}
                                  disabled={deletingGalleryId === img.publicId}
                                  sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'background.paper', boxShadow: 1, '&:hover': { bgcolor: 'action.hover' } }}
                                >
                                  {deletingGalleryId === img.publicId ? <CircularProgress size={14} /> : <DeleteIcon fontSize="small" />}
                                </IconButton>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </Stack>
                  )}

                  {/* TAB 4: BRANDING */}
                  {tabIndex === 4 && (
                    <Stack spacing={4}>
                      <Typography variant="h6" fontWeight={700}>Branding Assets</Typography>

                      {/* Company Logo Asset */}
                      <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
                        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Company Logo</Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                          This logo will appear on your public profile page and job postings. (Recommended: 400x400px square image)
                        </Typography>
                        <Stack direction="row" spacing={3} alignItems="center">
                          <Avatar src={selectedCompany.logoUrl} variant="rounded" sx={{ width: 80, height: 80, bgcolor: 'secondary.main' }}>
                            {selectedCompany.name.charAt(0)}
                          </Avatar>
                          <Stack direction="row" spacing={1}>
                            <Button variant="outlined" color="secondary" startIcon={<UploadFileIcon />} component="label" disabled={uploadingLogo}>
                              {uploadingLogo ? 'Uploading…' : selectedCompany.logoUrl ? 'Change Logo' : 'Upload Logo'}
                              <input type="file" hidden accept="image/*" onChange={handleLogoUpload} />
                            </Button>
                            {selectedCompany.logoUrl && (
                              <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteLogo} disabled={uploadingLogo}>
                                Remove
                              </Button>
                            )}
                          </Stack>
                        </Stack>
                      </Paper>

                      {/* Cover Image Asset */}
                      <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
                        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Cover / Banner Image</Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                          This banner image will span across the top of your public company page. (Recommended: 1200x400px landscape image)
                        </Typography>
                        {selectedCompany.coverImageUrl && (
                          <Box
                            component="img"
                            src={selectedCompany.coverImageUrl}
                            alt="Company banner preview"
                            sx={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: '8px', mb: 2 }}
                          />
                        )}
                        <Stack direction="row" spacing={1}>
                          <Button variant="outlined" color="secondary" startIcon={<UploadFileIcon />} component="label" disabled={uploadingCover}>
                            {uploadingCover ? 'Uploading…' : selectedCompany.coverImageUrl ? 'Change Banner' : 'Upload Banner'}
                            <input type="file" hidden accept="image/*" onChange={handleCoverUpload} />
                          </Button>
                          {selectedCompany.coverImageUrl && (
                            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteCover} disabled={uploadingCover}>
                              Remove
                            </Button>
                          )}
                        </Stack>
                      </Paper>
                    </Stack>
                  )}

                  {tabIndex === 5 && (
                    <Stack spacing={3}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight={700}>Job Listings ({jobs.filter(j => j.company?._id === selectedCompanyId).length})</Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<AddIcon />}
                          onClick={() => navigate('/jobs/new')}
                        >
                          Post a Job
                        </Button>
                      </Stack>
                      
                      {loadingJobs ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                      ) : jobs.filter(j => j.company?._id === selectedCompanyId).length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '12px', border: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="body2" color="text.secondary">No job postings found for this company.</Typography>
                        </Paper>
                      ) : (
                        <Stack spacing={2}>
                          {jobs.filter(j => j.company?._id === selectedCompanyId).map((job) => (
                            <Paper
                              key={job._id}
                              sx={{
                                p: 3,
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: 'all 0.2s',
                                '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
                              }}
                            >
                              <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 12, sm: 6 }}>
                                  <Typography variant="subtitle1" fontWeight={800}>{job.title}</Typography>
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    {job.employmentType} • {job.remoteOption} • {job.city}, {job.country}
                                  </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 3 }}>
                                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                    <Chip label={job.status} size="small" color={job.status === 'PUBLISHED' ? 'success' : job.status === 'DRAFT' ? 'default' : 'warning'} />
                                    <Chip label={`${job.totalViews} Views`} size="small" variant="outlined" />
                                    <Chip label={`${job.totalSaves} Saves`} size="small" variant="outlined" />
                                  </Stack>
                                  <Button
                                    size="small"
                                    variant="text"
                                    color="primary"
                                    startIcon={<PeopleAltIcon fontSize="small" />}
                                    onClick={() => setTabIndex(6)}
                                    sx={{ textTransform: 'none', p: 0, fontSize: '0.75rem', fontWeight: 700 }}
                                  >
                                    View Applicants
                                  </Button>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 3 }}>
                                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                    <IconButton size="small" color="primary" onClick={() => navigate('/jobs/edit/' + job._id)} title="Edit Job">
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="secondary" onClick={async () => {
                                      try {
                                        await jobApi.duplicateJob(job._id);
                                        showMsg('Job listing duplicated!');
                                        fetchJobs();
                                      } catch {
                                        showMsg('Failed to duplicate job listing.', 'error');
                                      }
                                    }} title="Duplicate Job">
                                      <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                    {job.status === 'PUBLISHED' ? (
                                      <Button size="small" variant="outlined" color="warning" onClick={async () => {
                                        try {
                                          await jobApi.updateJob(job._id, { status: 'CLOSED' });
                                          showMsg('Job listing closed.');
                                          fetchJobs();
                                        } catch {
                                          showMsg('Failed to close job listing.', 'error');
                                        }
                                      }}>
                                        Close
                                      </Button>
                                    ) : job.status === 'CLOSED' || job.status === 'DRAFT' ? (
                                      <Button size="small" variant="outlined" color="success" onClick={async () => {
                                        try {
                                          await jobApi.updateJob(job._id, { status: 'PUBLISHED' });
                                          showMsg('Job listing published!');
                                          fetchJobs();
                                        } catch {
                                          showMsg('Failed to publish job listing.', 'error');
                                        }
                                      }}>
                                        Publish
                                      </Button>
                                    ) : null}
                                    <IconButton size="small" color="error" onClick={async () => {
                                      if (window.confirm('Are you sure you want to delete this job listing?')) {
                                        try {
                                          await jobApi.deleteJob(job._id);
                                          showMsg('Job listing deleted.');
                                          fetchJobs();
                                        } catch {
                                          showMsg('Failed to delete job listing.', 'error');
                                        }
                                      }
                                    }} title="Delete Job">
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Stack>
                                </Grid>
                              </Grid>
                            </Paper>
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  )}

                  {/* TAB 6: APPLICANTS */}
                  {tabIndex === 6 && (
                    <Stack spacing={3}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h6" fontWeight={700}>Applicants Management</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Review, manage and update candidate application statuses. Applicants are notified via email on every status change.
                          </Typography>
                        </Box>
                        <Chip label="📧 Email notifications enabled" color="success" size="small" sx={{ fontWeight: 600 }} />
                      </Stack>
                      <ApplicantsTab jobs={jobs} selectedCompanyId={selectedCompanyId} />
                    </Stack>
                  )}
                </Box>
              </Paper>
            ) : (
              <Paper sx={{ p: 8, textAlign: 'center', borderRadius: '24px' }}>
                <BusinessIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>No Companies Selected</Typography>
                <Typography variant="body1" color="text.secondary">Create a company profile on the left or select an existing one to begin.</Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
