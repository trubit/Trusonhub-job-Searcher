import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { AppSpinner } from '../feedback/AppSpinner';

export function AdminRoute() {
  const { user, isAuthenticated, isInitializing } = useAuthStore();

  if (isInitializing) {
    return <AppSpinner fullPage label="Validating admin credentials..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Strict email constraint: only trustezika831@gmail.com is allowed into the Admin Dashboard!
  if (user.email.toLowerCase() !== 'trustezika831@gmail.com') {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
}
