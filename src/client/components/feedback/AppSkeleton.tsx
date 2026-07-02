import { Skeleton, Card, CardContent, Stack, Box } from '@mui/material';

export interface AppSkeletonProps {
  variant?: 'card' | 'text' | 'avatar' | 'list';
  count?: number;
}

export function AppSkeleton({ variant = 'card', count = 1 }: AppSkeletonProps) {
  const items = Array.from({ length: count });

  if (variant === 'card') {
    return (
      <>
        {items.map((_, idx) => (
          <Card key={idx} sx={{ height: 220, p: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Skeleton variant="rounded" width={48} height={48} />
                <Box sx={{ width: '60%' }}>
                  <Skeleton variant="text" height={24} width="100%" />
                  <Skeleton variant="text" height={16} width="60%" />
                </Box>
              </Stack>
              <Skeleton variant="rectangular" height={36} sx={{ borderRadius: '8px', mb: 2 }} />
              <Stack direction="row" spacing={1}>
                <Skeleton variant="rounded" width={60} height={24} />
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="rounded" width={70} height={24} />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  if (variant === 'list') {
    return (
      <Stack spacing={2}>
        {items.map((_, idx) => (
          <Skeleton key={idx} variant="rounded" height={60} width="100%" />
        ))}
      </Stack>
    );
  }

  if (variant === 'avatar') {
    return <Skeleton variant="circular" width={48} height={48} />;
  }

  return <Skeleton variant="text" width="100%" height={24} />;
}
