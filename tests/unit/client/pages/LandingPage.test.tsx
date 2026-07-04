import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LandingPage } from '../../../../src/client/pages/LandingPage';

vi.mock('../../../../src/client/features/jobs/services/jobApi', () => ({
  jobApi: {
    searchJobs: vi.fn().mockResolvedValue({ jobs: [], total: 0 }),
  },
}));

vi.mock('../../../../src/client/features/company/services/companyApi', () => ({
  companyApi: {
    getAllCompanies: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('../../../../src/client/features/stats/statsApi', () => ({
  statsApi: {
    getPublicStats: vi.fn().mockResolvedValue({
      totalJobs: 10,
      totalCompanies: 5,
      totalCandidates: 50,
      totalApplications: 100,
    }),
  },
}));

describe('LandingPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders main hero heading', async () => {
    await act(async () => {
      render(
        <HelmetProvider>
          <BrowserRouter>
            <LandingPage />
          </BrowserRouter>
        </HelmetProvider>
      );
    });
    expect(screen.getByText(/Discover Your Next/i)).toBeInTheDocument();
    expect(screen.getByText(/Career Opportunity/i)).toBeInTheDocument();
  });

  it('renders search button and input fields', async () => {
    await act(async () => {
      render(
        <HelmetProvider>
          <BrowserRouter>
            <LandingPage />
          </BrowserRouter>
        </HelmetProvider>
      );
    });
    expect(screen.getByPlaceholderText(/Job title, keywords/i)).toBeInTheDocument();
    expect(screen.getByText('Search Jobs')).toBeInTheDocument();
  });
});
