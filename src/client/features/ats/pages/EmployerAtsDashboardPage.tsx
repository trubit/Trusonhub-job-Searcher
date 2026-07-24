import { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Stack,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import {
  useAtsMetrics,
  useAtsApplications,
  useUpdateAtsStatus,
  useUpdateAtsRating,
  useToggleAtsFlag,
  useBulkUpdateAts,
} from '../hooks/useAts';
import { ApplicantFilterBar } from '../components/ApplicantFilterBar';
import { CandidateRating } from '../../candidate-rating/CandidateRating';
import { SEO } from '../../../components/seo/SEO';

const STATUS_STAGES = [
  { code: 'SUBMITTED', label: 'New Submitted', color: '#3b82f6' },
  { code: 'UNDER_REVIEW', label: 'Under Review', color: '#8b5cf6' },
  { code: 'SHORTLISTED', label: 'Shortlisted', color: '#ec4899' },
  { code: 'INTERVIEW_SCHEDULED', label: 'Interviews', color: '#06b6d4' },
  { code: 'OFFER_EXTENDED', label: 'Offers', color: '#eab308' },
  { code: 'HIRED', label: 'Hired', color: '#22c55e' },
  { code: 'REJECTED', label: 'Rejected', color: '#ef4444' },
];

export function EmployerAtsDashboardPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Menu state for individual stage moves
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);

  const { data: metrics } = useAtsMetrics();
  const { data: response, isLoading } = useAtsApplications({
    status: statusFilter || undefined,
    search: search || undefined,
    sortBy,
  });

  const updateStatusMutation = useUpdateAtsStatus();
  const updateRatingMutation = useUpdateAtsRating();
  const toggleFlagMutation = useToggleAtsFlag();
  const bulkUpdateMutation = useBulkUpdateAts();

  const applications = response?.applications || [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(applications.map((a) => a._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleBulkAction = (action: string, targetStatus?: string) => {
    if (selectedIds.length === 0) return;
    bulkUpdateMutation.mutate(
      { applicationIds: selectedIds, action, status: targetStatus },
      {
        onSuccess: () => {
          setSelectedIds([]);
        },
      }
    );
  };

  const handleStageChange = (newStatus: string) => {
    if (!activeAppId) return;
    updateStatusMutation.mutate({ id: activeAppId, status: newStatus });
    setAnchorEl(null);
    setActiveAppId(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <SEO title="Applicant Tracking System (ATS) | Talentra" description="Manage candidates across recruitment stages" />

      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Applicant Tracking System
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Evaluate, organize, and transition job candidates through your recruitment pipeline.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          <Button variant="contained" color="secondary" component={Link} to="/jobs/new">
            Post New Job
          </Button>
          <Button variant="outlined" color="inherit" component={Link} to="/company/dashboard">
            Company Dashboard
          </Button>
        </Stack>
      </Box>

      {/* Stage Metrics Cards */}
      <Grid container spacing={2} sx={{ mb: 5 }}>
        <Grid size={{ xs: 6, sm: 3, md: 1.7 }}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: '16px', bgcolor: 'primary.50' }}>
            <Typography variant="h4" fontWeight={800} color="primary.main">
              {metrics?.total || 0}
            </Typography>
            <Typography variant="caption" fontWeight={700} color="text.secondary">
              TOTAL APPLICANTS
            </Typography>
          </Paper>
        </Grid>
        {STATUS_STAGES.map((s) => (
          <Grid size={{ xs: 6, sm: 3, md: 1.47 }} key={s.code}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: '16px' }}>
              <Typography variant="h4" fontWeight={800} sx={{ color: s.color }}>
                {metrics?.[s.code] || 0}
              </Typography>
              <Typography variant="caption" fontWeight={700} color="text.secondary">
                {s.label.toUpperCase()}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Filter & Search Bar */}
      <ApplicantFilterBar
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Bulk Toolbar */}
      {selectedIds.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'secondary.50', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle2" fontWeight={700} color="secondary.main">
            {selectedIds.length} candidate(s) selected
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleBulkAction('SHORTLIST')}
            >
              Bulk Shortlist
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => handleBulkAction('REJECT')}
            >
              Bulk Reject
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Pipeline Table */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : applications.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px' }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            No Applicants Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No candidates matched your search and filter criteria.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.surface' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.length === applications.length && applications.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Candidate</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Applied Job</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Applied Date</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Stage</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => {
                const applicant = app.applicant as unknown as { firstName?: string; lastName?: string; email?: string; avatarUrl?: string };
                return (
                  <TableRow key={app._id} hover selected={selectedIds.includes(app._id)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(app._id)}
                        onChange={(e) => handleSelectOne(app._id, e.target.checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar src={applicant?.avatarUrl} sx={{ width: 36, height: 36 }}>
                          {applicant?.firstName?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {applicant?.firstName || 'Candidate'} {applicant?.lastName || ''}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {applicant?.email}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          color={app.flagged ? 'error' : 'default'}
                          onClick={() => toggleFlagMutation.mutate({ id: app._id, flagged: !app.flagged })}
                        >
                          <FlagIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {app.job?.title || 'Position'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <CandidateRating
                        rating={app.rating || 0}
                        onRatingChange={(newRating) => updateRatingMutation.mutate({ id: app._id, rating: newRating })}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={app.status.replace(/_/g, ' ')}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                        <Button
                          size="small"
                          variant="outlined"
                          component={Link}
                          to={`/employer/applications/${app._id}`}
                          startIcon={<VisibilityIcon />}
                        >
                          Review
                        </Button>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                            setActiveAppId(app._id);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Stage Transition Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {STATUS_STAGES.map((s) => (
          <MenuItem key={s.code} onClick={() => handleStageChange(s.code)}>
            Move to {s.label}
          </MenuItem>
        ))}
      </Menu>
    </Container>
  );
}
