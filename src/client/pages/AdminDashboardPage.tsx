import { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Stack,
  Box,
  Button,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  CircularProgress,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import CategoryIcon from '@mui/icons-material/Category';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ShieldIcon from '@mui/icons-material/Shield';
import { SEO } from '../components/seo/SEO';
import { adminApi, AdminStats, AuditLogItem } from '../features/admin/services/adminApi';
import { jobApi, JobData, JobCategoryData } from '../features/jobs/services/jobApi';
import { User, UserStatus, UserRole } from '../features/auth/types/auth.types';
import { AppAlert } from '../components/feedback/AppAlert';
import { apiClient } from '../services/apiClient';

export function AdminDashboardPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [categories, setCategories] = useState<JobCategoryData[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search & Filters
  const [userSearch, setUserSearch] = useState('');

  // Dialog states for User Edit
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING'>('ACTIVE');
  const [editRole, setEditRole] = useState<'ADMIN' | 'EMPLOYER' | 'JOB_SEEKER'>('JOB_SEEKER');
  const [savingUser, setSavingUser] = useState(false);

  // Dialog states for Add Category
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [savingCat, setSavingCat] = useState(false);

  const showMsg = (text: string, severity: 'success' | 'error' = 'success') => {
    if (severity === 'success') {
      setSuccessMessage(text);
      setTimeout(() => setSuccessMessage(null), 4000);
    } else {
      setErrorMessage(text);
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const [statsData, usersList, jobsList, categoriesList, logsList] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        adminApi.getJobs(),
        jobApi.getCategories(),
        adminApi.getAuditLogs(),
      ]);

      setStats(statsData);
      setUsers(usersList);
      setJobs(jobsList);
      setCategories(categoriesList);
      setAuditLogs(logsList);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setErrorMessage(ax.response?.data?.message || 'Failed to load administrative dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleUserSearch = async () => {
    try {
      const data = await adminApi.getUsers(userSearch);
      setUsers(data);
    } catch {
      showMsg('Failed to search users.', 'error');
    }
  };

  const handleOpenUserDialog = (user: User) => {
    setSelectedUser(user);
    setEditStatus(user.status);
    setEditRole(user.role);
    setUserDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    try {
      setSavingUser(true);
      if (editStatus !== selectedUser.status) {
        await adminApi.updateUserStatus(selectedUser.id, editStatus);
      }
      if (editRole !== selectedUser.role) {
        await adminApi.updateUserRole(selectedUser.id, editRole);
      }
      showMsg('User updated successfully.');
      setUserDialogOpen(false);
      loadAllData();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      showMsg(ax.response?.data?.message || 'Failed to update user parameters.', 'error');
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to soft-delete this user?')) return;
    try {
      await adminApi.deleteUser(userId);
      showMsg('User deleted.');
      loadAllData();
    } catch {
      showMsg('Failed to delete user.', 'error');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await adminApi.deleteJob(jobId);
      showMsg('Job posting deleted.');
      loadAllData();
    } catch {
      showMsg('Failed to delete job posting.', 'error');
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      setSavingCat(true);
      await apiClient.post('/job-categories', {
        name: newCatName.trim(),
        description: newCatDesc.trim(),
      });
      showMsg('Category added successfully.');
      setNewCatName('');
      setNewCatDesc('');
      setCatDialogOpen(false);
      loadAllData();
    } catch {
      showMsg('Failed to add category.', 'error');
    } finally {
      setSavingCat(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await apiClient.delete(`/job-categories/${id}`);
      showMsg('Category deleted.');
      loadAllData();
    } catch {
      showMsg('Failed to delete category.', 'error');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 12, textAlign: 'center' }}>
        <CircularProgress size={48} />
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Loading Administration Portal...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <SEO title="Admin Control Dashboard — Talentra" />

      {/* User Update Dialog */}
      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Manage User Privileges</DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Stack spacing={3} sx={{ pt: 1 }}>
              <Typography variant="body2">
                Managing: <strong>{selectedUser.firstName} {selectedUser.lastName}</strong> ({selectedUser.email})
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Account Status</InputLabel>
                <Select value={editStatus} label="Account Status" onChange={(e) => setEditStatus(e.target.value as UserStatus)}>
                  <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                  <MenuItem value="SUSPENDED">SUSPENDED</MenuItem>
                  <MenuItem value="PENDING">PENDING</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>System Role</InputLabel>
                <Select value={editRole} label="System Role" onChange={(e) => setEditRole(e.target.value as UserRole)}>
                  <MenuItem value="JOB_SEEKER">JOB_SEEKER</MenuItem>
                  <MenuItem value="EMPLOYER">EMPLOYER</MenuItem>
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveUser} disabled={savingUser}>
            {savingUser ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={catDialogOpen} onClose={() => setCatDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create Job Category</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField label="Category Name *" fullWidth value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
            <TextField label="Description" fullWidth multiline rows={3} value={newCatDesc} onChange={(e) => setNewCatDesc(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCatDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCategory} disabled={savingCat || !newCatName.trim()}>
            {savingCat ? 'Creating...' : 'Create Category'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56, borderRadius: '14px' }}>
          <ShieldIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={900}>
            System Admin Center
          </Typography>
          <Typography color="text.secondary">
            Global management portal for users, job moderation, categories, and security audit logs.
          </Typography>
        </Box>
      </Stack>

      {errorMessage && <AppAlert severity="error" sx={{ mb: 4 }}>{errorMessage}</AppAlert>}
      {successMessage && <AppAlert severity="success" sx={{ mb: 4 }}>{successMessage}</AppAlert>}

      <Paper sx={{ borderRadius: '24px', overflow: 'hidden', mb: 4 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3, '& .MuiTab-root': { fontWeight: 800, py: 2.5 } }}
        >
          <Tab icon={<DashboardIcon />} iconPosition="start" label="Overview" />
          <Tab icon={<PeopleIcon />} iconPosition="start" label={`Users (${users.length})`} />
          <Tab icon={<WorkIcon />} iconPosition="start" label={`Jobs Moderation (${jobs.length})`} />
          <Tab icon={<CategoryIcon />} iconPosition="start" label={`Categories (${categories.length})`} />
          <Tab icon={<HistoryIcon />} iconPosition="start" label="Audit Logs" />
        </Tabs>

        <Box sx={{ p: 4 }}>
          {/* ── TAB 0: OVERVIEW ── */}
          {tabIndex === 0 && stats && (
            <Stack spacing={4}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                    <Typography color="text.secondary" fontWeight={700} variant="subtitle2">Candidates</Typography>
                    <Typography variant="h3" fontWeight={900} sx={{ mt: 1 }}>{stats.users.candidates}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                    <Typography color="text.secondary" fontWeight={700} variant="subtitle2">Employers</Typography>
                    <Typography variant="h3" fontWeight={900} sx={{ mt: 1 }}>{stats.users.employers}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                    <Typography color="text.secondary" fontWeight={700} variant="subtitle2">Active Jobs</Typography>
                    <Typography variant="h3" fontWeight={900} sx={{ mt: 1 }}>{stats.jobs}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                    <Typography color="text.secondary" fontWeight={700} variant="subtitle2">Job Saves</Typography>
                    <Typography variant="h3" fontWeight={900} sx={{ mt: 1 }}>{stats.savedBookmarks}</Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Paper sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight={800} gutterBottom>System Operations Quick Summary</Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">Total registered users: <strong>{stats.users.total}</strong></Typography>
                  <Typography variant="body2" color="text.secondary">Total job categories: <strong>{stats.categories}</strong></Typography>
                  <Typography variant="body2" color="text.secondary">Total administrator accounts: <strong>{stats.users.admins}</strong></Typography>
                </Stack>
              </Paper>
            </Stack>
          )}

          {/* ── TAB 1: USER MANAGEMENT ── */}
          {tabIndex === 1 && (
            <Stack spacing={3}>
              <Stack direction="row" spacing={2}>
                <TextField
                  placeholder="Filter users by name or email..."
                  size="small"
                  fullWidth
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUserSearch()}
                />
                <Button variant="contained" startIcon={<SearchIcon />} onClick={handleUserSearch}>
                  Search
                </Button>
              </Stack>

              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '12px' }}>
                <Table>
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800 }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Email Verified</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Created At</TableCell>
                      <TableCell sx={{ fontWeight: 800 }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id} hover>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar src={u.avatarUrl} sx={{ width: 36, height: 36 }}>
                              {u.firstName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={700}>
                                {u.firstName} {u.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {u.email}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip label={u.role} size="small" variant="outlined" color={u.role === 'ADMIN' ? 'error' : u.role === 'EMPLOYER' ? 'primary' : 'secondary'} />
                        </TableCell>
                        <TableCell>
                          <Chip label={u.status} size="small" color={u.status === 'ACTIVE' ? 'success' : u.status === 'SUSPENDED' ? 'error' : 'warning'} />
                        </TableCell>
                        <TableCell>
                          {u.isEmailVerified ? <Chip label="Yes" color="success" size="small" variant="outlined" /> : <Chip label="No" color="error" size="small" variant="outlined" />}
                        </TableCell>
                        <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton size="small" color="primary" onClick={() => handleOpenUserDialog(u)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDeleteUser(u.id)} disabled={u.email.toLowerCase() === 'trustezika831@gmail.com'}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          )}

          {/* ── TAB 2: JOBS MODERATION ── */}
          {tabIndex === 2 && (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '12px' }}>
              <Table>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Job Details</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Views / Saves</TableCell>
                    <TableCell sx={{ fontWeight: 800 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job._id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700}>{job.title}</Typography>
                          <Typography variant="caption" color="text.secondary">{job.category}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{job.company?.name || 'N/A'}</TableCell>
                      <TableCell>{job.city}, {job.country}</TableCell>
                      <TableCell>{job.employmentType}</TableCell>
                      <TableCell>
                        <Chip label={job.status} size="small" color={job.status === 'PUBLISHED' ? 'success' : job.status === 'CLOSED' ? 'error' : 'default'} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{job.totalViews} views / {job.totalSaves} saves</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="error" onClick={() => handleDeleteJob(job._id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* ── TAB 3: CATEGORIES ── */}
          {tabIndex === 3 && (
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCatDialogOpen(true)}>
                  Create Category
                </Button>
              </Stack>

              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '12px' }}>
                <Table>
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800 }}>Category Name</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Slug</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 800 }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((cat) => (
                      <TableRow key={cat._id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{cat.name}</TableCell>
                        <TableCell><code>{cat.slug}</code></TableCell>
                        <TableCell>{cat.description || 'No description provided.'}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" color="error" onClick={() => handleDeleteCategory(cat._id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          )}

          {/* ── TAB 4: AUDIT LOGS ── */}
          {tabIndex === 4 && (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '12px' }}>
              <Table>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Event Timestamp</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Operator</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Security Action</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Resource Affected</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>IP &amp; Client Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log._id} hover>
                      <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        {log.user ? `${log.user.firstName} ${log.user.lastName} (${log.user.email})` : 'System / Guest'}
                      </TableCell>
                      <TableCell>
                        <Chip label={log.action} size="small" color="secondary" sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell><code>{log.resource}</code></TableCell>
                      <TableCell>
                        <Typography variant="caption" display="block">IP: {log.ipAddress}</Typography>
                        <Typography variant="caption" color="text.secondary" display="block" noWrap sx={{ maxWidth: 250 }}>
                          {log.userAgent}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
