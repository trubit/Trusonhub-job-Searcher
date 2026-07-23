import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface ApplicantFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled' },
  { value: 'OFFER_EXTENDED', label: 'Offer Extended' },
  { value: 'HIRED', label: 'Hired' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'WITHDRAWN', label: 'Withdrawn' },
];

export function ApplicantFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
}: ApplicantFilterBarProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
      <TextField
        size="small"
        placeholder="Search applicant name, email..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ minWidth: 260, flexGrow: 1 }}
      />

      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Status Stage</InputLabel>
        <Select value={status} label="Status Stage" onChange={(e) => onStatusChange(e.target.value)}>
          {STATUS_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Sort By</InputLabel>
        <Select value={sortBy} label="Sort By" onChange={(e) => onSortByChange(e.target.value)}>
          <MenuItem value="date_desc">Newest Applied</MenuItem>
          <MenuItem value="date_asc">Oldest Applied</MenuItem>
          <MenuItem value="rating_desc">Highest Rating</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
