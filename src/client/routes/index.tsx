import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { ErrorLayout } from '../layouts/ErrorLayout';
import { AppSpinner } from '../components/feedback/AppSpinner';

// Lazy loaded pages for optimal bundle splitting
const LandingPage = lazy(() => import('../pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const JobsPage = lazy(() => import('../pages/JobsPage').then((m) => ({ default: m.JobsPage })));
const CompaniesPage = lazy(() => import('../pages/CompaniesPage').then((m) => ({ default: m.CompaniesPage })));
const PricingPage = lazy(() => import('../pages/PricingPage').then((m) => ({ default: m.PricingPage })));
const AboutPage = lazy(() => import('../pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('../pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const CareerResourcesPage = lazy(() => import('../pages/CareerResourcesPage').then((m) => ({ default: m.CareerResourcesPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));
const ServerErrorPage = lazy(() => import('../pages/ServerErrorPage').then((m) => ({ default: m.ServerErrorPage })));
const MaintenancePage = lazy(() => import('../pages/MaintenancePage').then((m) => ({ default: m.MaintenancePage })));

export function AppRoutes() {
  return (
    <Suspense fallback={<AppSpinner fullPage label="Loading Page..." />}>
      <Routes>
        {/* Public Website Layout Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/career-resources" element={<CareerResourcesPage />} />
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
