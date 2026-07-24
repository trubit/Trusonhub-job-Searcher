import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { MinimalLayout } from '../layouts/MinimalLayout';
import { ErrorLayout } from '../layouts/ErrorLayout';
import { AppSpinner } from '../components/feedback/AppSpinner';
import { PublicOnlyRoute } from '../components/routes/PublicOnlyRoute';
import { ProtectedRoute } from '../components/routes/ProtectedRoute';
import { AdminRoute } from '../components/routes/AdminRoute';
import { RoleRoute } from '../components/routes/RoleRoute';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { authApi } from '../features/auth/services/authApi';

// Lazy loaded public pages
const LandingPage = lazy(() => import('../pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const CompaniesPage = lazy(() => import('../pages/CompaniesPage').then((m) => ({ default: m.CompaniesPage })));
const PricingPage = lazy(() => import('../pages/PricingPage').then((m) => ({ default: m.PricingPage })));
const AboutPage = lazy(() => import('../pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('../pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const CareerResourcesPage = lazy(() => import('../pages/CareerResourcesPage').then((m) => ({ default: m.CareerResourcesPage })));

// Lazy loaded profile & company pages
const PublicCandidateProfilePage = lazy(() => import('../pages/PublicCandidateProfilePage').then((m) => ({ default: m.PublicCandidateProfilePage })));
const PublicCompanyProfilePage = lazy(() => import('../pages/PublicCompanyProfilePage').then((m) => ({ default: m.PublicCompanyProfilePage })));
const CandidateDashboardPage = lazy(() => import('../pages/CandidateDashboardPage').then((m) => ({ default: m.CandidateDashboardPage })));
const EmployerCompanyDashboardPage = lazy(() => import('../pages/EmployerCompanyDashboardPage').then((m) => ({ default: m.EmployerCompanyDashboardPage })));
const JobPostPage = lazy(() => import('../pages/JobPostPage').then((m) => ({ default: m.JobPostPage })));
const JobSearchPage = lazy(() => import('../pages/JobSearchPage').then((m) => ({ default: m.JobSearchPage })));
const JobDetailsPage = lazy(() => import('../pages/JobDetailsPage').then((m) => ({ default: m.JobDetailsPage })));
const SavedJobsPage = lazy(() => import('../pages/SavedJobsPage').then((m) => ({ default: m.SavedJobsPage })));
const ActiveSessionsPage = lazy(() => import('../pages/ActiveSessionsPage').then((m) => ({ default: m.ActiveSessionsPage })));
const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));

// Lazy loaded Application & ATS pages
const CandidateApplicationsPage = lazy(() => import('../features/applications/pages/CandidateApplicationsPage').then((m) => ({ default: m.CandidateApplicationsPage })));
const EmployerAtsDashboardPage = lazy(() => import('../features/ats/pages/EmployerAtsDashboardPage').then((m) => ({ default: m.EmployerAtsDashboardPage })));
const ApplicantReviewPage = lazy(() => import('../features/candidate-review/pages/ApplicantReviewPage').then((m) => ({ default: m.ApplicantReviewPage })));

// Lazy loaded auth pages
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterJobSeekerPage = lazy(() => import('../features/auth/pages/RegisterJobSeekerPage').then((m) => ({ default: m.RegisterJobSeekerPage })));
const RegisterEmployerPage = lazy(() => import('../features/auth/pages/RegisterEmployerPage').then((m) => ({ default: m.RegisterEmployerPage })));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('../features/auth/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import('../features/auth/pages/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage })));

// Lazy loaded error pages
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));
const ServerErrorPage = lazy(() => import('../pages/ServerErrorPage').then((m) => ({ default: m.ServerErrorPage })));
const MaintenancePage = lazy(() => import('../pages/MaintenancePage').then((m) => ({ default: m.MaintenancePage })));

export function AppRoutes() {
  const { setInitializing } = useAuthStore();

  useEffect(() => {
    const { accessToken, isAuthenticated } = useAuthStore.getState();
    setInitializing(false);

    if (isAuthenticated && accessToken) {
      authApi
        .getCurrentUser()
        .then((user) => {
          useAuthStore.getState().updateUser(user);
        })
        .catch(() => {
          // Token expired or invalid session
        });
    }
  }, [setInitializing]);

  return (
    <Suspense fallback={<AppSpinner fullPage label="Loading Page..." />}>
      <Routes>
        {/* ── JOB SEEKER ONLY Routes ──────────────────────────────────── */}
        <Route element={<RoleRoute allowedRoles={['JOB_SEEKER']} />}>
          <Route element={<PublicLayout />}>
            <Route path="/profile/me" element={<CandidateDashboardPage />} />
            <Route path="/applications/me" element={<CandidateApplicationsPage />} />
            <Route path="/bookmarks" element={<SavedJobsPage />} />
          </Route>
        </Route>

        {/* ── EMPLOYER / ADMIN ONLY Routes ────────────────────────────── */}
        <Route element={<RoleRoute allowedRoles={['EMPLOYER', 'ADMIN']} />}>
          <Route element={<PublicLayout />}>
            <Route path="/company/dashboard" element={<EmployerCompanyDashboardPage />} />
            <Route path="/employer/ats" element={<EmployerAtsDashboardPage />} />
            <Route path="/employer/applications/:id" element={<ApplicantReviewPage />} />
            <Route path="/jobs/new" element={<JobPostPage />} />
            <Route path="/jobs/edit/:id" element={<JobPostPage />} />
          </Route>
        </Route>

        {/* ── General Authenticated Routes (any role) ──────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PublicLayout />}>
            <Route path="/auth/sessions" element={<ActiveSessionsPage />} />
          </Route>
        </Route>

        {/* Admin Protected Dashboard Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<PublicLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Route>
        </Route>

        {/* Public Website Layout Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/jobs" element={<JobSearchPage />} />
          <Route path="/jobs/:slug" element={<JobDetailsPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/career-resources" element={<CareerResourcesPage />} />
          <Route path="/profile/:username" element={<PublicCandidateProfilePage />} />
          <Route path="/company/:id" element={<PublicCompanyProfilePage />} />
        </Route>

        {/* Guest Only Auth Pages */}
        <Route element={<PublicOnlyRoute />}>
          <Route element={<MinimalLayout />}>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register/job-seeker" element={<RegisterJobSeekerPage />} />
            <Route path="/auth/register/employer" element={<RegisterEmployerPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
          </Route>
        </Route>

        {/* Error Pages Layout Routes */}
        <Route element={<ErrorLayout />}>
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/500" element={<ServerErrorPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
        </Route>

        {/* Catch-all Redirect to 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}
