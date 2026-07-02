import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Header } from '../components/navigation/Header';
import { Footer } from '../components/navigation/Footer';

export function PublicLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, width: '100%', overflowX: 'hidden' }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
