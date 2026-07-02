import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppButton } from '../../../../src/client/components/ui/AppButton';

describe('AppButton Component', () => {
  it('renders children correctly', () => {
    render(<AppButton>Click Me</AppButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(<AppButton isLoading>Submit</AppButton>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when disabled prop is set', () => {
    render(<AppButton disabled>Disabled Button</AppButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
