import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LandingPage } from '../../../../src/client/pages/LandingPage';

describe('LandingPage Component', () => {
  it('renders main hero heading', () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <LandingPage />
        </BrowserRouter>
      </HelmetProvider>
    );
    expect(screen.getByText(/Discover Your Next/i)).toBeInTheDocument();
    expect(screen.getByText(/Career Opportunity/i)).toBeInTheDocument();
  });

  it('renders search button and input fields', () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <LandingPage />
        </BrowserRouter>
      </HelmetProvider>
    );
    expect(screen.getByPlaceholderText(/Job title, keywords/i)).toBeInTheDocument();
    expect(screen.getByText('Search Jobs')).toBeInTheDocument();
  });
});
