import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { AppSpinner } from '../feedback/AppSpinner';

export function PublicOnlyRoute() {
  const { isAuthenticated, isInitializing } = useAuthStore();

  if (isInitializing) {
    return <AppSpinner fullPage label="Checking session..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
