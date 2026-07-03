import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { UserRole } from '../../features/auth/types/auth.types';
import { AppSpinner } from '../feedback/AppSpinner';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { user, isAuthenticated, isInitializing } = useAuthStore();

  if (isInitializing) {
    return <AppSpinner fullPage label="Checking permissions..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
}
