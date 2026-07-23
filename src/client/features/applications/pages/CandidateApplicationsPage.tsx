import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Button,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionIcon from '@mui/icons-material/Description';
import { useMyApplications, useWithdrawApplication } from '../hooks/useApplications';
import { SEO } from '../../../components/seo/SEO';

const STATUS_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  DRAFT: 'default',
  SUBMITTED: 'info',
  UNDER_REVIEW: 'secondary',
  SHORTLISTED: 'primary',
  INTERVIEW_SCHEDULED: 'warning',
  INTERVIEW_COMPLETED: 'warning',
  OFFER_EXTENDED: 'success',
  HIRED: 'success',
  REJECTED: 'error',
  WITHDRAWN: 'default',
};

export function CandidateApplicationsPage() {
  const { data: applications = [], isLoading } = useMyApplications();
  const withdrawMutation = useWithdrawApplication();

  const [withdrawId, setWithdrawId] = useState<string | null>(null);
  const [withdrawReason, setWithdrawReason] = useState<string>('');

  const handleWithdrawConfirm = () => {
    if (!withdrawId) return;
    withdrawMutation.mutate(
      { id: withdrawId, reason: withdrawReason },
      {
        onSuccess: () => {
          setWithdrawId(null);
          setWithdrawReason('');
        },
      }
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <SEO title="My Applications | Talentra" description="Track your submitted job applications" />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={800} gutterBottom>
          My Applications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track the status and timeline of all your submitted job applications.
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : applications.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px' }}>
          <DescriptionIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" fontWeight={700} gutterBottom>
            No Applications Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You haven't submitted any job applications yet.
          </Typography>
          <Button variant="contained" href="/jobs">
            Explore Open Positions
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.surface' }}>
                <TableCell sx={{ fontWeight: 800 }}>Job Position</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Applied Date</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app._id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {app.job?.title || 'Position'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {app.job?.city}, {app.job?.country} • {app.job?.employmentType}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {app.company?.name || 'Company'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : new Date(app.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={app.status.replace(/_/g, ' ')}
                      color={STATUS_COLORS[app.status] || 'default'}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {app.status !== 'WITHDRAWN' && app.status !== 'HIRED' && app.status !== 'REJECTED' && (
                        <Button
                          size="small"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => setWithdrawId(app._id)}
                        >
                          Withdraw
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Withdraw Modal */}
      <Dialog open={Boolean(withdrawId)} onClose={() => setWithdrawId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Withdraw Application</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Are you sure you want to withdraw your application? This action cannot be undone.
          </Typography>
          <TextField
            label="Reason for withdrawal (Optional)"
            multiline
            rows={3}
            fullWidth
            value={withdrawReason}
            onChange={(e) => setWithdrawReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawId(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleWithdrawConfirm}
            disabled={withdrawMutation.isPending}
          >
            {withdrawMutation.isPending ? 'Withdrawing...' : 'Confirm Withdraw'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
