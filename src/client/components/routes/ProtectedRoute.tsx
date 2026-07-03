import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { AppSpinner } from '../feedback/AppSpinner';

export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuthStore();
  const location = useLocation();

  if (isInitializing) {
    return <AppSpinner fullPage label="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
