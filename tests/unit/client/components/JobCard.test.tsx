import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JobCard } from '../../../../src/client/components/cards/JobCard';

describe('JobCard Component', () => {
  const mockProps = {
    id: 'job-1',
    title: 'Senior React Engineer',
    companyName: 'Acme Corp',
    location: 'San Francisco, CA',
    salary: '$150k - $180k',
    jobType: 'Full-time',
    postedDate: '2 days ago',
    tags: ['React', 'TypeScript'],
  };

  it('renders job title and company name', () => {
    render(<JobCard {...mockProps} />);
    expect(screen.getByText('Senior React Engineer')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  it('renders location and salary information', () => {
    render(<JobCard {...mockProps} />);
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
    expect(screen.getByText('$150k - $180k')).toBeInTheDocument();
  });

  it('renders tags correctly', () => {
    render(<JobCard {...mockProps} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });
});
