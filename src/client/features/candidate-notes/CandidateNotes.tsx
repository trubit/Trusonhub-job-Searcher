import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
  Avatar,
  CircularProgress,
} from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { useAtsNotes, useAddAtsNote, useDeleteAtsNote } from '../ats/hooks/useAts';

interface CandidateNotesProps {
  applicationId: string;
}

export function CandidateNotes({ applicationId }: CandidateNotesProps) {
  const { data: notes = [], isLoading } = useAtsNotes(applicationId);
  const addNoteMutation = useAddAtsNote();
  const deleteNoteMutation = useDeleteAtsNote();

  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const handleAddNote = () => {
    if (!content.trim()) return;
    addNoteMutation.mutate(
      { id: applicationId, content, isPinned },
      {
        onSuccess: () => {
          setContent('');
          setIsPinned(false);
        },
      }
    );
  };

  const handleDelete = (noteId: string) => {
    deleteNoteMutation.mutate({ id: applicationId, noteId });
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6" fontWeight={800}>
        Internal Employer Notes
      </Typography>

      {/* Note Creation Form */}
      <Paper sx={{ p: 2.5, borderRadius: '16px', bgcolor: 'background.surface' }}>
        <TextField
          multiline
          rows={3}
          fullWidth
          placeholder="Add an evaluation note or interview feedback (private to hiring team)..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 1.5 }}
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button
            size="small"
            variant={isPinned ? 'contained' : 'outlined'}
            color="secondary"
            startIcon={<PushPinIcon />}
            onClick={() => setIsPinned(!isPinned)}
          >
            {isPinned ? 'Pinned' : 'Pin Note'}
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleAddNote}
            disabled={!content.trim() || addNoteMutation.isPending}
          >
            {addNoteMutation.isPending ? 'Saving...' : 'Add Note'}
          </Button>
        </Stack>
      </Paper>

      {/* Notes List */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : notes.length === 0 ? (
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
          No internal notes added yet.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {notes.map((note) => (
            <Paper
              key={note._id}
              sx={{
                p: 2.5,
                borderRadius: '16px',
                borderLeft: note.isPinned ? '4px solid #7c3aed' : undefined,
                bgcolor: note.isPinned ? 'rgba(124, 58, 237, 0.04)' : undefined,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    src={note.author?.avatarUrl}
                    sx={{ width: 32, height: 32, fontSize: '0.875rem' }}
                  >
                    {note.author?.firstName?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {note.author?.firstName} {note.author?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(note.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={0.5}>
                  {note.isPinned && <PushPinIcon color="secondary" fontSize="small" />}
                  <IconButton size="small" color="error" onClick={() => handleDelete(note._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
              <Typography variant="body2" sx={{ whitespace: 'pre-wrap', lineHeight: 1.6 }}>
                {note.content}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
