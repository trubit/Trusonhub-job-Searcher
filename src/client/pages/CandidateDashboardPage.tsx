import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Tabs,
  Tab,
  LinearProgress,
  Button,
  Grid,
  Chip,
  Avatar,
  Card as MuiCard,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import StarIcon from '@mui/icons-material/Star';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import SaveIcon from '@mui/icons-material/Save';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import TranslateIcon from '@mui/icons-material/Translate';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { profileApi } from '../features/profile/services/profileApi';
import { resumeApi, ResumeItem } from '../features/resume/services/resumeApi';
import { JobSeekerProfileData, Education, Experience, Certification, Language, Portfolio as PortfolioType } from '../features/profile/types/profile.types';
import { AppSpinner } from '../components/feedback/AppSpinner';
import { AppAlert } from '../components/feedback/AppAlert';
import { SEO } from '../components/seo/SEO';
import { apiClient } from '../services/apiClient';
import { applicationApi, JobApplicationData } from '../features/applications/services/applicationApi';

// ─── BIO EDIT DIALOG ─────────────────────────────────────────────────────────
function BioEditDialog({
  open, profile, onClose, onSaved,
}: {
  open: boolean;
  profile: JobSeekerProfileData['profile'];
  onClose: () => void;
  onSaved: (d: JobSeekerProfileData) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    headline: profile.headline || '',
    about: profile.about || '',
    phoneNumber: profile.phoneNumber || '',
    currentPosition: profile.currentPosition || '',
    yearsOfExperience: profile.yearsOfExperience ?? 0,
    industry: profile.industry || '',
    employmentStatus: profile.employmentStatus || 'OPEN_TO_WORK',
    preferredJobType: profile.preferredJobType || 'ANY',
    preferredWorkMode: profile.preferredWorkMode || 'ANY',
    expectedSalary: profile.expectedSalary || '',
    location_country: profile.location?.country || '',
    location_city: profile.location?.city || '',
    linkedin: profile.socialLinks?.linkedin || '',
    github: profile.socialLinks?.github || '',
    portfolio: profile.socialLinks?.portfolio || '',
  });

  const handleSave = async () => {
    setSaving(true); setError(null);
    try {
      const updated = await profileApi.updateProfile({
        headline: form.headline, about: form.about, phoneNumber: form.phoneNumber,
        currentPosition: form.currentPosition, yearsOfExperience: Number(form.yearsOfExperience),
        industry: form.industry, employmentStatus: form.employmentStatus as never,
        preferredJobType: form.preferredJobType as never, preferredWorkMode: form.preferredWorkMode as never,
        expectedSalary: form.expectedSalary,
        location: { country: form.location_country, city: form.location_city },
        socialLinks: { linkedin: form.linkedin, github: form.github, portfolio: form.portfolio },
      });
      onSaved(updated); onClose();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setError(ax.response?.data?.message || 'Failed to save profile.');
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ fontWeight: 700 }}>Edit Bio & Profile</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ pt: 1 }}>
          {error && <AppAlert severity="error">{error}</AppAlert>}
          <TextField label="Professional Headline" fullWidth value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
          <TextField label="About / Professional Summary" fullWidth multiline minRows={4} value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
          <TextField label="Phone Number" fullWidth value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
          <TextField label="Current Position / Title" fullWidth value={form.currentPosition} onChange={(e) => setForm({ ...form, currentPosition: e.target.value })} />
          <TextField label="Years of Experience" type="number" fullWidth value={form.yearsOfExperience} onChange={(e) => setForm({ ...form, yearsOfExperience: Number(e.target.value) })} />
          <TextField label="Industry" fullWidth value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Country" fullWidth value={form.location_country} onChange={(e) => setForm({ ...form, location_country: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="City" fullWidth value={form.location_city} onChange={(e) => setForm({ ...form, location_city: e.target.value })} /></Grid>
          </Grid>
          <FormControl fullWidth>
            <InputLabel>Employment Status</InputLabel>
            <Select label="Employment Status" value={form.employmentStatus} onChange={(e) => setForm({ ...form, employmentStatus: e.target.value })}>
              <MuiSelectItem value="EMPLOYED">Employed</MuiSelectItem>
              <MuiSelectItem value="UNEMPLOYED">Unemployed</MuiSelectItem>
              <MuiSelectItem value="OPEN_TO_WORK">Open to Work</MuiSelectItem>
              <MuiSelectItem value="FREELANCING">Freelancing</MuiSelectItem>
            </Select>
          </FormControl>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Preferred Job Type</InputLabel>
                <Select label="Preferred Job Type" value={form.preferredJobType} onChange={(e) => setForm({ ...form, preferredJobType: e.target.value })}>
                  <MuiSelectItem value="ANY">Any</MuiSelectItem>
                  <MuiSelectItem value="FULL_TIME">Full-Time</MuiSelectItem>
                  <MuiSelectItem value="PART_TIME">Part-Time</MuiSelectItem>
                  <MuiSelectItem value="CONTRACT">Contract</MuiSelectItem>
                  <MuiSelectItem value="INTERNSHIP">Internship</MuiSelectItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Work Mode Preference</InputLabel>
                <Select label="Work Mode Preference" value={form.preferredWorkMode} onChange={(e) => setForm({ ...form, preferredWorkMode: e.target.value })}>
                  <MuiSelectItem value="ANY">Any</MuiSelectItem>
                  <MuiSelectItem value="REMOTE">Remote</MuiSelectItem>
                  <MuiSelectItem value="HYBRID">Hybrid</MuiSelectItem>
                  <MuiSelectItem value="ON_SITE">On-Site</MuiSelectItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <TextField label="Expected Salary" fullWidth value={form.expectedSalary} onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })} />
          <Divider />
          <Typography variant="subtitle2" fontWeight={700}>Social Links</Typography>
          <TextField label="LinkedIn URL" fullWidth value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} />
          <TextField label="GitHub URL" fullWidth value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} />
          <TextField label="Portfolio URL" fullWidth value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── EXPERIENCE DIALOG ───────────────────────────────────────────────────────
function ExperienceDialog({
  open, onClose, onSaved, editItem
}: {
  open: boolean; onClose: () => void; onSaved: (d: JobSeekerProfileData) => void; editItem?: Experience | null;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ companyName: '', position: '', employmentType: 'FULL_TIME', location: '', startDate: '', endDate: '', isCurrent: false, responsibilities: '', achievements: '' });

  useEffect(() => {
    if (editItem) {
      setForm({
        companyName: editItem.companyName || '',
        position: editItem.position || '',
        employmentType: editItem.employmentType || 'FULL_TIME',
        location: editItem.location || '',
        startDate: editItem.startDate ? new Date(editItem.startDate).toISOString().split('T')[0] : '',
        endDate: editItem.endDate ? new Date(editItem.endDate).toISOString().split('T')[0] : '',
        isCurrent: editItem.isCurrent || false,
        responsibilities: editItem.responsibilities || '',
        achievements: editItem.achievements || '',
      });
    } else {
      setForm({ companyName: '', position: '', employmentType: 'FULL_TIME', location: '', startDate: '', endDate: '', isCurrent: false, responsibilities: '', achievements: '' });
    }
  }, [editItem, open]);

  const handleSave = async () => {
    if (!form.companyName || !form.position || !form.startDate) { setError('Company name, position, and start date are required.'); return; }
    setSaving(true); setError(null);
    try {
      const payload = {
        companyName: form.companyName, position: form.position, employmentType: form.employmentType,
        location: form.location, startDate: form.startDate,
        endDate: form.isCurrent ? undefined : form.endDate || undefined,
        isCurrent: form.isCurrent, responsibilities: form.responsibilities, achievements: form.achievements,
      };
      const updated = editItem 
        ? await profileApi.updateExperience(editItem._id, payload)
        : await profileApi.addExperience(payload);
      onSaved(updated); onClose();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setError(ax.response?.data?.message || 'Failed to save experience.');
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle sx={{ fontWeight: 700 }}>{editItem ? 'Edit Work Experience' : 'Add Work Experience'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {error && <AppAlert severity="error">{error}</AppAlert>}
          <TextField label="Company Name *" fullWidth value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          <TextField label="Job Title / Position *" fullWidth value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
          <FormControl fullWidth>
            <InputLabel>Employment Type</InputLabel>
            <Select label="Employment Type" value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}>
              <MuiSelectItem value="FULL_TIME">Full-Time</MuiSelectItem>
              <MuiSelectItem value="PART_TIME">Part-Time</MuiSelectItem>
              <MuiSelectItem value="CONTRACT">Contract</MuiSelectItem>
              <MuiSelectItem value="FREELANCE">Freelance</MuiSelectItem>
              <MuiSelectItem value="INTERNSHIP">Internship</MuiSelectItem>
            </Select>
          </FormControl>
          <TextField label="Location" fullWidth value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Start Date *" type="date" fullWidth value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="End Date" type="date" fullWidth value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={form.isCurrent} slotProps={{ inputLabel: { shrink: true } }} /></Grid>
          </Grid>
          <FormControlLabel control={<Checkbox checked={form.isCurrent} onChange={(e) => setForm({ ...form, isCurrent: e.target.checked, endDate: '' })} />} label="I currently work here" />
          <TextField label="Key Responsibilities" fullWidth multiline minRows={3} value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} />
          <TextField label="Achievements (optional)" fullWidth multiline minRows={2} value={form.achievements} onChange={(e) => setForm({ ...form, achievements: e.target.value })} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : editItem ? 'Save Changes' : 'Add Experience'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── SKILL DIALOG ────────────────────────────────────────────────────────────
function SkillDialog({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: (d: JobSeekerProfileData) => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', level: 'INTERMEDIATE', yearsOfExperience: 1 });

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Skill name is required.'); return; }
    setSaving(true); setError(null);
    try {
      const updated = await profileApi.addSkill({ name: form.name.trim(), level: form.level, yearsOfExperience: Number(form.yearsOfExperience) });
      onSaved(updated); setForm({ name: '', level: 'INTERMEDIATE', yearsOfExperience: 1 }); onClose();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setError(ax.response?.data?.message || 'Failed to add skill.');
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Add Skill</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {error && <AppAlert severity="error">{error}</AppAlert>}
          <TextField label="Skill Name *" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. React, Python, Figma" />
          <FormControl fullWidth>
            <InputLabel>Proficiency Level</InputLabel>
            <Select label="Proficiency Level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              <MuiSelectItem value="BEGINNER">Beginner</MuiSelectItem>
              <MuiSelectItem value="INTERMEDIATE">Intermediate</MuiSelectItem>
              <MuiSelectItem value="ADVANCED">Advanced</MuiSelectItem>
              <MuiSelectItem value="EXPERT">Expert</MuiSelectItem>
            </Select>
          </FormControl>
          <TextField label="Years of Experience" type="number" fullWidth value={form.yearsOfExperience} onChange={(e) => setForm({ ...form, yearsOfExperience: Number(e.target.value) })} slotProps={{ htmlInput: { min: 0 } }} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <AddIcon />} onClick={handleSave} disabled={saving}>
          {saving ? 'Adding…' : 'Add Skill'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── EDUCATION DIALOG ────────────────────────────────────────────────────────
function EducationDialog({
  open, onClose, onSaved, editItem
}: {
  open: boolean; onClose: () => void; onSaved: (d: JobSeekerProfileData) => void; editItem?: Education | null;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', isCurrent: false, description: '' });

  useEffect(() => {
    if (editItem) {
      setForm({
        institution: editItem.institution || '',
        degree: editItem.degree || '',
        fieldOfStudy: editItem.fieldOfStudy || '',
        startDate: editItem.startDate ? new Date(editItem.startDate).toISOString().split('T')[0] : '',
        endDate: editItem.endDate ? new Date(editItem.endDate).toISOString().split('T')[0] : '',
        isCurrent: editItem.isCurrent || false,
        description: editItem.description || '',
      });
    } else {
      setForm({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', isCurrent: false, description: '' });
    }
  }, [editItem, open]);

  const handleSave = async () => {
    if (!form.institution || !form.degree || !form.fieldOfStudy || !form.startDate) { setError('Institution, degree, field of study, and start date are required.'); return; }
    setSaving(true); setError(null);
    try {
      const payload = {
        institution: form.institution, degree: form.degree, fieldOfStudy: form.fieldOfStudy,
        startDate: form.startDate, endDate: form.isCurrent ? undefined : form.endDate || undefined,
        isCurrent: form.isCurrent, description: form.description,
      };
      const updated = editItem
        ? await profileApi.updateEducation(editItem._id, payload)
        : await profileApi.addEducation(payload);
      onSaved(updated); onClose();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setError(ax.response?.data?.message || 'Failed to save education.');
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle sx={{ fontWeight: 700 }}>{editItem ? 'Edit Education' : 'Add Education'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {error && <AppAlert severity="error">{error}</AppAlert>}
          <TextField label="Institution / School *" fullWidth value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
          <TextField label="Degree *" fullWidth value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="e.g. Bachelor of Science" />
          <TextField label="Field of Study *" fullWidth value={form.fieldOfStudy} onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })} placeholder="e.g. Computer Science" />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Start Date *" type="date" fullWidth value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="End Date" type="date" fullWidth value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={form.isCurrent} slotProps={{ inputLabel: { shrink: true } }} /></Grid>
          </Grid>
          <FormControlLabel control={<Checkbox checked={form.isCurrent} onChange={(e) => setForm({ ...form, isCurrent: e.target.checked, endDate: '' })} />} label="Currently studying here" />
          <TextField label="Description (optional)" fullWidth multiline minRows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : editItem ? 'Save Changes' : 'Add Education'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── CERTIFICATION DIALOG ───────────────────────────────────────────────────
function CertificationDialog({
  open, onClose, onSaved, editItem
}: {
  open: boolean; onClose: () => void; onSaved: (d: JobSeekerProfileData) => void; editItem?: Certification | null;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', organization: '', issueDate: '', expirationDate: '', credentialId: '', credentialUrl: '' });

  useEffect(() => {
    if (editItem) {
      setForm({
        name: editItem.name || '',
        organization: editItem.organization || '',
        issueDate: editItem.issueDate ? new Date(editItem.issueDate).toISOString().split('T')[0] : '',
        expirationDate: editItem.expirationDate ? new Date(editItem.expirationDate).toISOString().split('T')[0] : '',
        credentialId: editItem.credentialId || '',
        credentialUrl: editItem.credentialUrl || '',
      });
    } else {
      setForm({ name: '', organization: '', issueDate: '', expirationDate: '', credentialId: '', credentialUrl: '' });
    }
  }, [editItem, open]);

  const handleSave = async () => {
    if (!form.name || !form.organization || !form.issueDate) { setError('Name, organization, and issue date are required.'); return; }
    setSaving(true); setError(null);
    try {
      const payload = {
        name: form.name, organization: form.organization, issueDate: form.issueDate,
        expirationDate: form.expirationDate || undefined, credentialId: form.credentialId || undefined, credentialUrl: form.credentialUrl || undefined,
      };
      const updated = editItem
        ? await profileApi.updateCertification(editItem._id, payload)
        : await profileApi.addCertification(payload);
      onSaved(updated); onClose();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setError(ax.response?.data?.message || 'Failed to save certification.');
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle sx={{ fontWeight: 700 }}>{editItem ? 'Edit Certification' : 'Add Certification'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {error && <AppAlert severity="error">{error}</AppAlert>}
          <TextField label="Certification Name *" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Issuing Organization *" fullWidth value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Issue Date *" type="date" fullWidth value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Expiration Date" type="date" fullWidth value={form.expirationDate} onChange={(e) => setForm({ ...form, expirationDate: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} /></Grid>
          </Grid>
          <TextField label="Credential ID" fullWidth value={form.credentialId} onChange={(e) => setForm({ ...form, credentialId: e.target.value })} />
          <TextField label="Credential URL" fullWidth value={form.credentialUrl} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : editItem ? 'Save Changes' : 'Add Certification'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── LANGUAGE DIALOG ─────────────────────────────────────────────────────────
function LanguageDialog({
  open, onClose, onSaved, editItem
}: {
  open: boolean; onClose: () => void; onSaved: (d: JobSeekerProfileData) => void; editItem?: Language | null;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', proficiency: 'INTERMEDIATE' });

  useEffect(() => {
    if (editItem) {
      setForm({ name: editItem.name || '', proficiency: editItem.proficiency || 'INTERMEDIATE' });
    } else {
      setForm({ name: '', proficiency: 'INTERMEDIATE' });
    }
  }, [editItem, open]);

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Language name is required.'); return; }
    setSaving(true); setError(null);
    try {
      const payload = { name: form.name.trim(), proficiency: form.proficiency };
      const updated = editItem
        ? await profileApi.updateLanguage(editItem._id, payload)
        : await profileApi.addLanguage(payload);
      onSaved(updated); onClose();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setError(ax.response?.data?.message || 'Failed to save language.');
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{editItem ? 'Edit Language' : 'Add Language'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {error && <AppAlert severity="error">{error}</AppAlert>}
          <TextField label="Language Name *" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. English, French, Spanish" />
          <FormControl fullWidth>
            <InputLabel>Proficiency Level</InputLabel>
            <Select label="Proficiency Level" value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: e.target.value })}>
              <MuiSelectItem value="BEGINNER">Beginner</MuiSelectItem>
              <MuiSelectItem value="INTERMEDIATE">Intermediate</MuiSelectItem>
              <MuiSelectItem value="ADVANCED">Advanced</MuiSelectItem>
              <MuiSelectItem value="FLUENT">Fluent</MuiSelectItem>
              <MuiSelectItem value="NATIVE">Native</MuiSelectItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : editItem ? 'Save Changes' : 'Add Language'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── PORTFOLIO DIALOG ────────────────────────────────────────────────────────
function PortfolioDialog({
  open, onClose, onSaved, editItem
}: {
  open: boolean; onClose: () => void; onSaved: (d: JobSeekerProfileData) => void; editItem?: PortfolioType | null;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ projectName: '', description: '', technologies: '', projectUrl: '', githubUrl: '' });

  useEffect(() => {
    if (editItem) {
      setForm({
        projectName: editItem.projectName || '',
        description: editItem.description || '',
        technologies: editItem.technologies ? editItem.technologies.join(', ') : '',
        projectUrl: editItem.projectUrl || '',
        githubUrl: editItem.githubUrl || '',
      });
    } else {
      setForm({ projectName: '', description: '', technologies: '', projectUrl: '', githubUrl: '' });
    }
  }, [editItem, open]);

  const handleSave = async () => {
    if (!form.projectName.trim() || !form.description.trim()) { setError('Project name and description are required.'); return; }
    setSaving(true); setError(null);
    try {
      const techs = form.technologies.split(',').map((t) => t.trim()).filter(Boolean);
      const payload = {
        projectName: form.projectName, description: form.description, technologies: techs,
        projectUrl: form.projectUrl || undefined, githubUrl: form.githubUrl || undefined, images: [],
      };
      const updated = editItem
        ? await profileApi.updatePortfolio(editItem._id, payload)
        : await profileApi.addPortfolio(payload);
      onSaved(updated); onClose();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setError(ax.response?.data?.message || 'Failed to save project.');
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle sx={{ fontWeight: 700 }}>{editItem ? 'Edit Portfolio Project' : 'Add Portfolio Project'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {error && <AppAlert severity="error">{error}</AppAlert>}
          <TextField label="Project Name *" fullWidth value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} />
          <TextField label="Description *" fullWidth multiline minRows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextField label="Technologies (comma-separated)" fullWidth value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="e.g. React, Node.js, MongoDB" />
          <TextField label="Live Project URL" fullWidth value={form.projectUrl} onChange={(e) => setForm({ ...form, projectUrl: e.target.value })} />
          <TextField label="GitHub Repository URL" fullWidth value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : editItem ? 'Save Changes' : 'Add Project'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── DOWNLOAD HELPER ─────────────────────────────────────────────────────────
async function downloadResume(fileUrl: string, fileName: string) {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch {
    window.open(fileUrl, '_blank');
  }
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
interface SavedJobItem {
  _id: string;
  job: {
    _id: string;
    title?: string;
    slug?: string;
    city?: string;
    country?: string;
    employmentType?: string;
    company?: {
      name?: string;
      logoUrl?: string;
    };
  };
  createdAt: string;
}

export function CandidateDashboardPage() {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<JobSeekerProfileData | null>(null);
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState<{ text: string; severity: 'success' | 'error' | 'info' } | null>(null);

  const [savedJobs, setSavedJobs] = useState<SavedJobItem[]>([]);
  const [loadingSavedJobs, setLoadingSavedJobs] = useState(false);

  const [applications, setApplications] = useState<JobApplicationData[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  const fetchSavedJobs = async () => {
    try {
      setLoadingSavedJobs(true);
      const res = await apiClient.get('/bookmarks');
      setSavedJobs(res.data.data?.filter((b: SavedJobItem) => b.job) || []);
    } catch (err) {
      console.error('Failed to fetch saved jobs:', err);
    } finally {
      setLoadingSavedJobs(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoadingApplications(true);
      const res = await applicationApi.getMyApplications();
      setApplications(res || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoadingApplications(false);
    }
  };

  // Modal open states
  const [bioDialogOpen, setBioDialogOpen] = useState(false);
  const [expDialogOpen, setExpDialogOpen] = useState(false);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [eduDialogOpen, setEduDialogOpen] = useState(false);
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [langDialogOpen, setLangDialogOpen] = useState(false);
  const [portfolioDialogOpen, setPortfolioDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Edit item targets
  const [editExp, setEditExp] = useState<Experience | null>(null);
  const [editEdu, setEditEdu] = useState<Education | null>(null);
  const [editCert, setEditCert] = useState<Certification | null>(null);
  const [editLang, setEditLang] = useState<Language | null>(null);
  const [editPortfolio, setEditPortfolio] = useState<PortfolioType | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMsg = (text: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setMessage({ text, severity });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchProfile = async () => {
    try {
      fetchSavedJobs();
      fetchApplications();
      const p = await profileApi.getMyProfile();
      setData(p);
      try {
        const r = await resumeApi.getResumes();
        setResumes(r || []);
      } catch { setResumes([]); }
    } catch (err) {
      console.error('Failed to load candidate profile:', err);
    } finally { setLoading(false); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProfile(); }, []);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assetType', 'PROFILE_PHOTO');

    try {
      setUploadingPhoto(true);
      await apiClient.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchProfile();
      showMsg('Profile photo updated successfully!');
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      showMsg(ax.response?.data?.message || 'Failed to upload photo.', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      setUploadingPhoto(true);
      await profileApi.deletePhoto();
      await fetchProfile();
      showMsg('Profile photo removed.');
    } catch {
      showMsg('Failed to remove profile photo.', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploadingResume(true);
      await resumeApi.uploadResume(file);
      const r = await resumeApi.getResumes();
      setResumes(r || []);
      showMsg('Resume uploaded successfully!');
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      showMsg(ax.response?.data?.message || 'Failed to upload resume.', 'error');
    } finally { setUploadingResume(false); }
  };

  const handleDeleteResume = async (id: string) => {
    setDeletingId(id);
    try {
      await resumeApi.deleteResume(id);
      const r = await resumeApi.getResumes();
      setResumes(r || []);
      showMsg('Resume deleted.');
    } catch { showMsg('Failed to delete resume.', 'error'); }
    finally { setDeletingId(null); }
  };

  const handleReplaceResume = async (id: string, file: File) => {
    setDeletingId(id);
    try {
      await resumeApi.deleteResume(id);
      await resumeApi.uploadResume(file);
      const r = await resumeApi.getResumes();
      setResumes(r || []);
      showMsg('Resume replaced successfully!');
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      showMsg(ax.response?.data?.message || 'Failed to replace resume.', 'error');
    } finally { setDeletingId(null); }
  };

  const handleDeleteExperience = async (id: string) => {
    setDeletingId(id);
    try {
      const updated = await profileApi.deleteExperience(id);
      setData(updated);
      showMsg('Experience removed.');
    } catch { showMsg('Failed to delete experience.', 'error'); }
    finally { setDeletingId(null); }
  };

  const handleDeleteEducation = async (id: string) => {
    setDeletingId(id);
    try {
      const updated = await profileApi.deleteEducation(id);
      setData(updated);
      showMsg('Education removed.');
    } catch { showMsg('Failed to delete education.', 'error'); }
    finally { setDeletingId(null); }
  };

  const handleDeleteCert = async (id: string) => {
    setDeletingId(id);
    try {
      const updated = await profileApi.deleteCertification(id);
      setData(updated);
      showMsg('Certification removed.');
    } catch { showMsg('Failed to delete certification.', 'error'); }
    finally { setDeletingId(null); }
  };

  const handleDeleteLang = async (id: string) => {
    setDeletingId(id);
    try {
      const updated = await profileApi.deleteLanguage(id);
      setData(updated);
      showMsg('Language removed.');
    } catch { showMsg('Failed to delete language.', 'error'); }
    finally { setDeletingId(null); }
  };

  const handleDeleteSkill = async (id: string) => {
    setDeletingId(id);
    try {
      const updated = await profileApi.deleteSkill(id);
      setData(updated);
      showMsg('Skill removed.');
    } catch { showMsg('Failed to delete skill.', 'error'); }
    finally { setDeletingId(null); }
  };

  const handleDeletePortfolio = async (id: string) => {
    setDeletingId(id);
    try {
      const updated = await profileApi.deletePortfolio(id);
      setData(updated);
      showMsg('Portfolio project removed.');
    } catch { showMsg('Failed to delete project.', 'error'); }
    finally { setDeletingId(null); }
  };

  if (loading) return <AppSpinner fullPage label="Loading candidate dashboard…" />;

  if (!data) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700}>Unable to load candidate profile.</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={fetchProfile}>Retry</Button>
      </Container>
    );
  }

  const { user, profile, completion, experience, education, skills, portfolio, certifications, languages } = data;
  const completionColor = completion.score >= 80 ? 'success' : completion.score >= 50 ? 'warning' : 'error';

  return (
    <>
      <SEO title="Candidate Profile Portal — Talentra" />

      {/* Invisible inputs for file upload */}
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handlePhotoUpload} />

      {/* Dialogs */}
      <BioEditDialog open={bioDialogOpen} profile={profile} onClose={() => setBioDialogOpen(false)} onSaved={(d) => { setData(d); showMsg('Profile updated successfully!'); }} />
      
      <ExperienceDialog
        open={expDialogOpen}
        editItem={editExp}
        onClose={() => { setExpDialogOpen(false); setEditExp(null); }}
        onSaved={(d) => { setData(d); showMsg(editExp ? 'Experience updated!' : 'Experience added!'); }}
      />
      
      <SkillDialog open={skillDialogOpen} onClose={() => setSkillDialogOpen(false)} onSaved={(d) => { setData(d); showMsg('Skill added!'); }} />
      
      <EducationDialog
        open={eduDialogOpen}
        editItem={editEdu}
        onClose={() => { setEduDialogOpen(false); setEditEdu(null); }}
        onSaved={(d) => { setData(d); showMsg(editEdu ? 'Education updated!' : 'Education added!'); }}
      />

      <CertificationDialog
        open={certDialogOpen}
        editItem={editCert}
        onClose={() => { setCertDialogOpen(false); setEditCert(null); }}
        onSaved={(d) => { setData(d); showMsg(editCert ? 'Certification updated!' : 'Certification added!'); }}
      />

      <LanguageDialog
        open={langDialogOpen}
        editItem={editLang}
        onClose={() => { setLangDialogOpen(false); setEditLang(null); }}
        onSaved={(d) => { setData(d); showMsg(editLang ? 'Language updated!' : 'Language added!'); }}
      />

      <PortfolioDialog
        open={portfolioDialogOpen}
        editItem={editPortfolio}
        onClose={() => { setPortfolioDialogOpen(false); setEditPortfolio(null); }}
        onSaved={(d) => { setData(d); showMsg(editPortfolio ? 'Project updated!' : 'Project added!'); }}
      />

      {/* Profile Header */}
      <Box sx={{ py: 5, bgcolor: 'background.surface', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
            <Box sx={{ position: 'relative' }}>
              <Avatar src={user.avatarUrl} sx={{ width: 90, height: 90, bgcolor: 'primary.main', fontWeight: 700, fontSize: '2.2rem' }}>
                {user.firstName.charAt(0)}
              </Avatar>
              <Box sx={{ position: 'absolute', bottom: -5, right: -5, display: 'flex', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: 2, '&:hover': { bgcolor: 'action.hover' } }}
                >
                  {uploadingPhoto ? <CircularProgress size={16} /> : <PhotoCameraIcon fontSize="small" />}
                </IconButton>
                {user.avatarUrl && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={handleDeletePhoto}
                    sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: 2, '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h4" fontWeight={800}>{user.firstName} {user.lastName}</Typography>
              <Typography variant="body1" color="text.secondary">{profile.headline || 'Candidate Profile'} • {user.email}</Typography>
              {profile.location?.city && (
                <Typography variant="body2" color="text.secondary">
                  {profile.location.city}{profile.location.country ? `, ${profile.location.country}` : ''}
                </Typography>
              )}
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {message && <AppAlert severity={message.severity} sx={{ mb: 4 }}>{message.text}</AppAlert>}

        <Grid container spacing={4}>
          {/* Left: Tabs */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ borderRadius: '20px', overflow: 'hidden', mb: 4 }}>
              <Tabs
                value={tabIndex}
                onChange={(_, val) => setTabIndex(val)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 2, '& .MuiTab-root': { fontWeight: 700, py: 2 } }}
              >
                <Tab icon={<PersonIcon />} iconPosition="start" label="Bio" />
                <Tab icon={<WorkIcon />} iconPosition="start" label={`Experience (${experience.length})`} />
                <Tab icon={<StarIcon />} iconPosition="start" label={`Skills (${skills.length})`} />
                <Tab icon={<SchoolIcon />} iconPosition="start" label={`Education (${education.length})`} />
                <Tab icon={<WorkspacePremiumIcon />} iconPosition="start" label={`Certifications (${certifications?.length || 0})`} />
                <Tab icon={<TranslateIcon />} iconPosition="start" label={`Languages (${languages?.length || 0})`} />
                <Tab icon={<CodeIcon />} iconPosition="start" label={`Portfolio (${portfolio.length})`} />
                <Tab icon={<DescriptionIcon />} iconPosition="start" label={`Resumes (${resumes.length})`} />
                <Tab icon={<BookmarkIcon />} iconPosition="start" label={`Saved Jobs (${savedJobs.length})`} />
                <Tab icon={<WorkIcon />} iconPosition="start" label={`Applications (${applications.length})`} />
              </Tabs>

              <Box sx={{ p: 4 }}>
                {/* ── TAB 0: BIO ── */}
                {tabIndex === 0 && (
                  <Stack spacing={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" fontWeight={700}>Professional Summary &amp; Bio</Typography>
                      <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={() => setBioDialogOpen(true)}>Edit Bio</Button>
                    </Stack>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {profile.about || 'No bio provided yet. Click "Edit Bio" to add your professional summary.'}
                    </Typography>
                    {profile.headline && (
                      <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: '10px' }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>Headline</Typography>
                        <Typography variant="body1">{profile.headline}</Typography>
                      </Box>
                    )}
                    {(profile.location?.city || profile.location?.country) && (
                      <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: '10px' }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>Location</Typography>
                        <Typography variant="body1">{[profile.location?.city, profile.location?.country].filter(Boolean).join(', ')}</Typography>
                      </Box>
                    )}
                    {profile.industry && (
                      <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: '10px' }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>Industry</Typography>
                        <Typography variant="body1">{profile.industry}</Typography>
                      </Box>
                    )}
                    {profile.expectedSalary && (
                      <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: '10px' }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>Expected Salary</Typography>
                        <Typography variant="body1">{profile.expectedSalary}</Typography>
                      </Box>
                    )}
                  </Stack>
                )}

                {/* ── TAB 1: EXPERIENCE ── */}
                {tabIndex === 1 && (
                  <Stack spacing={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" fontWeight={700}>Work Experience</Typography>
                      <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => { setEditExp(null); setExpDialogOpen(true); }}>Add Experience</Button>
                    </Stack>
                    {experience.length === 0 ? (
                      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '12px' }}>
                        <WorkIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">No work experience added yet.</Typography>
                      </Paper>
                    ) : (
                      experience.map((e) => (
                        <Box key={e._id} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                              <Typography variant="subtitle1" fontWeight={700}>{e.position}</Typography>
                              <Typography variant="body2" color="primary.main" fontWeight={600}>{e.companyName}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(e.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} –{' '}
                                {e.isCurrent ? 'Present' : e.endDate ? new Date(e.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                              </Typography>
                              {e.location && <Typography variant="body2" color="text.secondary">{e.location}</Typography>}
                              <Chip label={e.employmentType.replace('_', ' ')} size="small" sx={{ mt: 1, fontWeight: 600, fontSize: '0.7rem' }} />
                            </Box>
                            <Stack direction="row" spacing={0.5}>
                              <IconButton size="small" color="primary" onClick={() => { setEditExp(e); setExpDialogOpen(true); }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={() => handleDeleteExperience(e._id)} disabled={deletingId === e._id}>
                                {deletingId === e._id ? <CircularProgress size={16} /> : <DeleteIcon fontSize="small" />}
                              </IconButton>
                            </Stack>
                          </Stack>
                          {e.responsibilities && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, whiteSpace: 'pre-line' }}>{e.responsibilities}</Typography>
                          )}
                        </Box>
                      ))
                    )}
                  </Stack>
                )}

                {/* ── TAB 2: SKILLS ── */}
                {tabIndex === 2 && (
                  <Stack spacing={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" fontWeight={700}>Skills &amp; Competencies</Typography>
                      <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setSkillDialogOpen(true)}>Add Skill</Button>
                    </Stack>
                    {skills.length === 0 ? (
                      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '12px' }}>
                        <StarIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">No skills added yet.</Typography>
                      </Paper>
                    ) : (
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {skills.map((s) => (
                          <Chip
                            key={s._id}
                            label={`${s.name} · ${s.level}`}
                            color="primary"
                            sx={{ fontWeight: 600 }}
                            onDelete={deletingId === s._id ? undefined : () => handleDeleteSkill(s._id)}
                            deleteIcon={deletingId === s._id ? <CircularProgress size={14} /> : undefined}
                          />
                        ))}
                      </Stack>
                    )}
                  </Stack>
                )}

                {/* ── TAB 3: EDUCATION ── */}
                {tabIndex === 3 && (
                  <Stack spacing={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" fontWeight={700}>Academic Education</Typography>
                      <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => { setEditEdu(null); setEduDialogOpen(true); }}>Add Education</Button>
                    </Stack>
                    {education.length === 0 ? (
                      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '12px' }}>
                        <SchoolIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">No education entries added yet.</Typography>
                      </Paper>
                    ) : (
                      education.map((edu) => (
                        <Box key={edu._id} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                              <Typography variant="subtitle1" fontWeight={700}>{edu.degree} in {edu.fieldOfStudy}</Typography>
                              <Typography variant="body2" color="primary.main" fontWeight={600}>{edu.institution}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} –{' '}
                                {edu.isCurrent ? 'Present' : edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                              </Typography>
                              {edu.description && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{edu.description}</Typography>}
                            </Box>
                            <Stack direction="row" spacing={0.5}>
                              <IconButton size="small" color="primary" onClick={() => { setEditEdu(edu); setEduDialogOpen(true); }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={() => handleDeleteEducation(edu._id)} disabled={deletingId === edu._id}>
                                {deletingId === edu._id ? <CircularProgress size={16} /> : <DeleteIcon fontSize="small" />}
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Box>
                      ))
                    )}
                  </Stack>
                )}

                {/* ── TAB 4: CERTIFICATIONS ── */}
                {tabIndex === 4 && (
                  <Stack spacing={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" fontWeight={700}>Certifications &amp; Credentials</Typography>
                      <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => { setEditCert(null); setCertDialogOpen(true); }}>Add Certification</Button>
                    </Stack>
                    {!certifications || certifications.length === 0 ? (
                      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '12px' }}>
                        <WorkspacePremiumIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">No certifications added yet.</Typography>
                      </Paper>
                    ) : (
                      certifications.map((c) => (
                        <Box key={c._id} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                              <Typography variant="subtitle1" fontWeight={700}>{c.name}</Typography>
                              <Typography variant="body2" color="primary.main" fontWeight={600}>{c.organization}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Issued: {new Date(c.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                {c.expirationDate ? ` • Expires: ${new Date(c.expirationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ' • No Expiration'}
                              </Typography>
                              {c.credentialId && <Typography variant="caption" color="text.secondary" display="block">Credential ID: {c.credentialId}</Typography>}
                              {c.credentialUrl && <Button size="small" href={c.credentialUrl} target="_blank" variant="text" sx={{ mt: 1, p: 0 }}>View Credential</Button>}
                            </Box>
                            <Stack direction="row" spacing={0.5}>
                              <IconButton size="small" color="primary" onClick={() => { setEditCert(c); setCertDialogOpen(true); }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={() => handleDeleteCert(c._id)} disabled={deletingId === c._id}>
                                {deletingId === c._id ? <CircularProgress size={16} /> : <DeleteIcon fontSize="small" />}
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Box>
                      ))
                    )}
                  </Stack>
                )}

                {/* ── TAB 5: LANGUAGES ── */}
                {tabIndex === 5 && (
                  <Stack spacing={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" fontWeight={700}>Spoken Languages</Typography>
                      <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => { setEditLang(null); setLangDialogOpen(true); }}>Add Language</Button>
                    </Stack>
                    {!languages || languages.length === 0 ? (
                      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '12px' }}>
                        <TranslateIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">No languages listed yet.</Typography>
                      </Paper>
                    ) : (
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1.5}>
                        {languages.map((l) => (
                          <Chip
                            key={l._id}
                            label={`${l.name} (${l.proficiency.toLowerCase()})`}
                            color="secondary"
                            onClick={() => { setEditLang(l); setLangDialogOpen(true); }}
                            onDelete={deletingId === l._id ? undefined : () => handleDeleteLang(l._id)}
                            deleteIcon={deletingId === l._id ? <CircularProgress size={14} /> : undefined}
                            sx={{ fontWeight: 600, py: 2 }}
                          />
                        ))}
                      </Stack>
                    )}
                  </Stack>
                )}

                {/* ── TAB 6: PORTFOLIO ── */}
                {tabIndex === 6 && (
                  <Stack spacing={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" fontWeight={700}>Projects &amp; Portfolio</Typography>
                      <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => { setEditPortfolio(null); setPortfolioDialogOpen(true); }}>Add Project</Button>
                    </Stack>
                    {portfolio.length === 0 ? (
                      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '12px' }}>
                        <CodeIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">No portfolio projects yet. Showcase your best work!</Typography>
                      </Paper>
                    ) : (
                      <Grid container spacing={2}>
                        {portfolio.map((item) => (
                          <Grid key={item._id} size={{ xs: 12, sm: 6 }}>
                            <MuiCard sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                              <Box>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                  <Typography variant="subtitle1" fontWeight={700}>{item.projectName}</Typography>
                                  <Stack direction="row" spacing={0.5}>
                                    <IconButton size="small" color="primary" onClick={() => { setEditPortfolio(item); setPortfolioDialogOpen(true); }}>
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDeletePortfolio(item._id)} disabled={deletingId === item._id}>
                                      {deletingId === item._id ? <CircularProgress size={16} /> : <DeleteIcon fontSize="small" />}
                                    </IconButton>
                                  </Stack>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>{item.description}</Typography>
                                {item.technologies && item.technologies.length > 0 && (
                                  <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}>
                                    {item.technologies.map((t) => (
                                      <Chip key={t} label={t} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                    ))}
                                  </Stack>
                                )}
                              </Box>
                              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                {item.projectUrl && <Button size="small" href={item.projectUrl} target="_blank" variant="outlined">Live Demo</Button>}
                                {item.githubUrl && <Button size="small" href={item.githubUrl} target="_blank" variant="outlined">GitHub</Button>}
                              </Stack>
                            </MuiCard>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Stack>
                )}

                {/* ── TAB 7: RESUMES ── */}
                {tabIndex === 7 && (
                  <Stack spacing={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" fontWeight={700}>My Resumes</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Upload, replace, or delete each resume. Upload to add a new one.
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        component="label"
                        startIcon={uploadingResume ? <CircularProgress size={16} color="inherit" /> : <UploadFileIcon />}
                        disabled={uploadingResume}
                      >
                        {uploadingResume ? 'Uploading…' : resumes.length > 0 ? 'Add Another Resume' : 'Upload Resume'}
                        <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                      </Button>
                    </Stack>

                    {resumes.length === 0 ? (
                      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '12px' }}>
                        <DescriptionIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">No resume uploaded yet.</Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                          Supported formats: PDF, DOC, DOCX (max 10MB)
                        </Typography>
                      </Paper>
                    ) : (
                      <Stack spacing={2}>
                        {resumes.map((r) => (
                          <Box
                            key={r._id}
                            sx={{
                              p: 3,
                              border: '1px solid',
                              borderColor: r.isPrimary ? 'primary.main' : 'divider',
                              borderRadius: '12px',
                              bgcolor: r.isPrimary ? 'action.selected' : 'transparent',
                            }}
                          >
                            {/* File info */}
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                              <DescriptionIcon color={r.isPrimary ? 'primary' : 'disabled'} sx={{ fontSize: 36 }} />
                              <Box sx={{ flexGrow: 1 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography variant="subtitle1" fontWeight={700}>{r.fileName}</Typography>
                                  {r.isPrimary && (
                                    <Chip label="Primary" size="small" color="primary" sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
                                  )}
                                </Stack>
                                {r.createdAt && (
                                  <Typography variant="caption" color="text.secondary">
                                    Uploaded {new Date(r.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </Typography>
                                )}
                              </Box>
                            </Stack>

                            {/* Action buttons */}
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<UploadFileIcon />}
                                disabled={deletingId === r._id}
                                onClick={() => downloadResume(r.fileUrl, r.fileName)}
                              >
                                Download
                              </Button>

                              <Button
                                size="small"
                                variant="outlined"
                                color="warning"
                                component="label"
                                startIcon={deletingId === r._id ? <CircularProgress size={14} color="inherit" /> : <EditIcon />}
                                disabled={deletingId === r._id}
                              >
                                Replace
                                <input
                                  type="file"
                                  hidden
                                  accept=".pdf,.doc,.docx"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleReplaceResume(r._id, file);
                                    e.target.value = '';
                                  }}
                                />
                              </Button>

                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={deletingId === r._id ? <CircularProgress size={14} color="inherit" /> : <DeleteIcon />}
                                disabled={deletingId === r._id}
                                onClick={() => handleDeleteResume(r._id)}
                              >
                                Delete
                              </Button>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                )}

                {/* ── TAB 8: SAVED JOBS ── */}
                {tabIndex === 8 && (
                  <Stack spacing={3}>
                    <Typography variant="h6" fontWeight={700}>Saved Openings</Typography>
                    {loadingSavedJobs ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                    ) : savedJobs.length === 0 ? (
                      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '12px' }}>
                        <BookmarkIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">No bookmarked jobs found.</Typography>
                      </Paper>
                    ) : (
                      <Stack spacing={2}>
                        {savedJobs.map((item) => {
                          const job = item.job;
                          return (
                            <Paper
                              key={item._id}
                              sx={{
                                p: 3,
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: 'all 0.2s',
                                '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.06)' },
                              }}
                            >
                              <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 12, sm: 8 }}>
                                  <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar src={job.company?.logoUrl} variant="rounded">
                                      {job.company?.name?.charAt(0)}
                                    </Avatar>
                                    <Box>
                                      <Typography variant="subtitle1" fontWeight={800}>{job.title}</Typography>
                                      <Typography variant="body2" color="primary.main" fontWeight={700}>
                                        {job.company?.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" display="block">
                                        {job.city}, {job.country} • {job.employmentType}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button
                                      size="small"
                                      color="error"
                                      onClick={async () => {
                                        try {
                                          await apiClient.delete(`/jobs/${job._id}/bookmark`);
                                          showMsg('Bookmark removed.');
                                          fetchSavedJobs();
                                        } catch {
                                          showMsg('Failed to remove bookmark.', 'error');
                                        }
                                      }}
                                    >
                                      Remove
                                    </Button>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      onClick={() => navigate(`/jobs/${job.slug}`)}
                                    >
                                      View
                                    </Button>
                                  </Stack>
                                </Grid>
                              </Grid>
                            </Paper>
                          );
                        })}
                      </Stack>
                    )}
                  </Stack>
                )}

                {/* ── TAB 9: APPLICATIONS ── */}
                {tabIndex === 9 && (
                   <Stack spacing={3}>
                     <Typography variant="h6" fontWeight={700}>My Submitted Applications</Typography>
                     {loadingApplications ? (
                       <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                     ) : applications.length === 0 ? (
                       <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: '12px' }}>
                         <WorkIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                         <Typography variant="body2" color="text.secondary">You haven't applied to any jobs yet.</Typography>
                         <Button variant="outlined" size="small" onClick={() => navigate('/jobs')} sx={{ mt: 2 }}>
                           Browse Jobs
                         </Button>
                       </Paper>
                     ) : (
                       <Stack spacing={2}>
                         {applications.map((app) => {
                           const job = app.job;
                           if (!job) return null;
                           return (
                             <Paper
                               key={app._id}
                               sx={{
                                 p: 3,
                                 borderRadius: '12px',
                                 border: '1px solid',
                                 borderColor: 'divider',
                                 transition: 'all 0.2s',
                                 '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.06)' },
                               }}
                             >
                               <Grid container spacing={2} alignItems="center">
                                 <Grid size={{ xs: 12, sm: 8 }}>
                                   <Stack direction="row" spacing={2} alignItems="center">
                                     <Avatar src={job.company?.logoUrl} variant="rounded">
                                       {job.company?.name ? job.company.name.charAt(0) : 'J'}
                                     </Avatar>
                                     <Box>
                                       <Typography variant="subtitle1" fontWeight={800}>{job.title}</Typography>
                                       <Typography variant="body2" color="primary.main" fontWeight={700}>
                                         {job.company?.name || 'Vetted Employer'}
                                       </Typography>
                                       <Typography variant="caption" color="text.secondary" display="block">
                                         Applied on {new Date(app.createdAt).toLocaleDateString()} • Resume: {app.resume?.fileName || 'Attached Resume'}
                                       </Typography>
                                     </Box>
                                   </Stack>
                                 </Grid>
                                 <Grid size={{ xs: 12, sm: 4 }}>
                                   <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
                                     <Chip
                                       label={app.status}
                                       color={
                                         app.status === 'ACCEPTED' || app.status === 'SHORTLISTED'
                                           ? 'success'
                                           : app.status === 'REJECTED'
                                           ? 'error'
                                           : 'primary'
                                       }
                                       sx={{ fontWeight: 700 }}
                                     />
                                     <Button
                                       size="small"
                                       variant="outlined"
                                       onClick={() => navigate(`/jobs/${job.slug}`)}
                                     >
                                       View Details
                                     </Button>
                                   </Stack>
                                 </Grid>
                               </Grid>
                             </Paper>
                           );
                         })}
                       </Stack>
                     )}
                   </Stack>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Right: Completion Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, borderRadius: '20px', mb: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Profile Completion</Typography>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Typography variant="h3" fontWeight={900} color={`${completionColor}.main`}>{completion.score}%</Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress variant="determinate" value={completion.score} color={completionColor} sx={{ height: 10, borderRadius: 5 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>{completion.level}</Typography>
                </Box>
              </Stack>
              <Stack spacing={1.5}>
                {Object.entries(completion.breakdown).map(([key, done]) => (
                  <Stack key={key} direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon sx={{ fontSize: 18, color: done ? 'success.main' : 'text.disabled' }} />
                    <Typography variant="body2" color={done ? 'text.primary' : 'text.disabled'} sx={{ textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>

            {completion.recommendations && completion.recommendations.length > 0 && (
              <Paper sx={{ p: 3, borderRadius: '20px' }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Recommendations</Typography>
                <Stack spacing={1}>
                  {completion.recommendations.map((rec, i) => (
                    <Typography key={i} variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 1 }}>
                      <span>•</span> {rec}
                    </Typography>
                  ))}
                </Stack>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
