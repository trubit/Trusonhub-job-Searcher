import { Card, CardContent, Box, Stack, Typography, Avatar, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';

export interface CompanyCardProps {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  location: string;
  employeeCount: string;
  openRolesCount: number;
}

export function CompanyCard({
  name,
  logo,
  industry,
  location,
  employeeCount,
  openRolesCount,
}: CompanyCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', minWidth: 0 }}>
        <Avatar
          src={logo}
          alt={name}
          sx={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            bgcolor: 'primary.main',
            fontSize: '1.25rem',
            fontWeight: 700,
            mb: 2,
            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            flexShrink: 0,
          }}
        >
          {name.charAt(0)}
        </Avatar>

        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, fontSize: { xs: '1rem', sm: '1.125rem' }, overflowWrap: 'break-word', wordBreak: 'break-word', width: '100%' }}>
          {name}
        </Typography>

        <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mb: 2 }}>
          {industry}
        </Typography>

        <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" sx={{ mb: 3, width: '100%', gap: 1 }}>
          <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
            <LocationOnIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">{location}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
            <PeopleIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">{employeeCount}</Typography>
          </Stack>
        </Stack>

        <Box sx={{ mt: 'auto', width: '100%' }}>
          <Button fullWidth variant="outlined" color="primary" size="small">
            View {openRolesCount} Open Jobs
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
