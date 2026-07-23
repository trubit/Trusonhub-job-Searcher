import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import { useApplyJob } from '../hooks/useApplications';
import { resumeApi, ResumeItem } from '../../resume/services/resumeApi';

interface ApplyJobModalProps {
  open: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  companyName: string;
}

export function ApplyJobModal({ open, onClose, jobId, jobTitle, companyName }: ApplyJobModalProps) {
  const applyMutation = useApplyJob();

  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (open) {
      resumeApi.getResumes()
        .then((data) => setResumes(data))
        .catch(() => setResumes([]));
    }
  }, [open]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Resume file size must not exceed 10MB.');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMsg('');
      const newResume = await resumeApi.uploadResume(file);
      setUploadedResumeUrl(newResume.fileUrl || '');
      setSelectedResumeId(newResume._id);
    } catch {
      setErrorMsg('Failed to upload resume file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (isDraft = false) => {
    if (!isDraft && !selectedResumeId && !uploadedResumeUrl) {
      setErrorMsg('Please select an existing resume or upload a new one.');
      return;
    }

    setErrorMsg('');
    applyMutation.mutate(
      {
        jobId,
        resumeId: selectedResumeId || undefined,
        resumeUrl: uploadedResumeUrl || undefined,
        coverLetter,
        isDraft,
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: unknown) => {
          const message = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
          setErrorMsg(message || 'Failed to submit job application.');
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
        Apply for Position
        <Typography variant="body2" color="text.secondary">
          {jobTitle} at <strong>{companyName}</strong>
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

          {/* Resume Selection */}
          <FormControl>
            <FormLabel sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>Select Resume *</FormLabel>
            {resumes.length > 0 && (
              <RadioGroup value={selectedResumeId} onChange={(e) => setSelectedResumeId(e.target.value)}>
                {resumes.map((r: ResumeItem) => (
                  <FormControlLabel
                    key={r._id}
                    value={r._id}
                    control={<Radio />}
                    label={`${r.fileName || 'PDF Document'}`}
                  />
                ))}
              </RadioGroup>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Or upload a new resume document (PDF, DOCX up to 10MB):
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading Resume...' : 'Upload New Resume'}
                <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
              </Button>
              {uploadedResumeUrl && (
                <Typography variant="caption" color="success.main" display="block" sx={{ mt: 0.5, fontWeight: 700 }}>
                  ✓ Resume uploaded successfully!
                </Typography>
              )}
            </Box>
          </FormControl>

          {/* Cover Letter */}
          <Box>
            <FormLabel sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block' }}>
              Cover Letter (Optional)
            </FormLabel>
            <TextField
              multiline
              rows={5}
              fullWidth
              placeholder="Introduce yourself and explain why you're a great fit for this position..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              inputProps={{ maxLength: 5000 }}
              helperText={`${coverLetter.length}/5000 characters`}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, justifyContent: 'space-between' }}>
        <Button onClick={() => handleSubmit(true)} startIcon={<SaveIcon />} color="inherit">
          Save Draft
        </Button>
        <Stack direction="row" spacing={1.5}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => handleSubmit(false)}
            disabled={applyMutation.isPending || isUploading}
          >
            {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
