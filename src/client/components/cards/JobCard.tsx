import { Card, CardContent, Box, Stack, Typography, Avatar, Button, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { AppBadge } from '../ui/AppBadge';

export interface JobCardProps {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  salary: string;
  jobType: string;
  postedDate: string;
  tags: string[];
  featured?: boolean;
}

export function JobCard({
  title,
  companyName,
  companyLogo,
  location,
  salary,
  jobType,
  postedDate,
  tags,
  featured = false,
}: JobCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: featured ? '2px solid' : undefined,
        borderColor: featured ? 'primary.main' : undefined,
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5} sx={{ mb: 2, minWidth: 0 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
            <Avatar
              src={companyLogo}
              alt={companyName}
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: '12px',
                bgcolor: 'primary.main',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {companyName.charAt(0)}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  fontSize: { xs: '0.95rem', sm: '1.125rem' },
                  lineHeight: 1.3,
                  mb: 0.5,
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                }}
              >
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500} noWrap>
                {companyName}
              </Typography>
            </Box>
          </Stack>

          <IconButton size="small" aria-label="Bookmark job" sx={{ flexShrink: 0 }}>
            <BookmarkBorderIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 2, gap: 1 }}>
          <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
            <LocationOnIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption" fontWeight={500}>
              {location}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
            <AttachMoneyIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption" fontWeight={500}>
              {salary}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
            <WorkOutlineIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption" fontWeight={500}>
              {jobType}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3, gap: 0.8 }}>
          {tags.map((tag, idx) => (
            <AppBadge key={idx} label={tag} variantStyle="neutral" />
          ))}
        </Stack>

        <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {postedDate}
          </Typography>
          <Button variant="outlined" size="small" color="primary">
            Apply Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
