import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { JobHeader } from './JobHeader';
import { Job } from '@/types/job';

const mockJob: Job = {
  id: 'test-1',
  companyName: 'Test Inc',
  companyLogoUrl: 'https://example.com/logo.png',
  title: 'Frontend Developer',
  location: 'Remote',
  salaryRange: '$100k',
  employmentType: 'Contract',
  isSponsorshipActive: true,
};

describe('JobHeader Component', () => {
  it('renders all required job information correctly', () => {
    render(<JobHeader job={mockJob} />);
    
    expect(screen.getByText(mockJob.title)).toBeInTheDocument();
    expect(screen.getByText(mockJob.companyName)).toBeInTheDocument();
    expect(screen.getByText(mockJob.location)).toBeInTheDocument();
    expect(screen.getByText(mockJob.employmentType)).toBeInTheDocument();
    expect(screen.getByText(mockJob.salaryRange)).toBeInTheDocument();
    expect(screen.getByAltText(/Test Inc logo/i)).toBeInTheDocument();
  });

  it('shows the sponsorship active badge when true', () => {
    render(<JobHeader job={mockJob} />);
    const badge = screen.getByText(/Sponsorship: Active/i);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('bg-green-100');
  });

  it('does not show the sponsorship badge when false', () => {
    const noSponsorshipJob = { ...mockJob, isSponsorshipActive: false };
    render(<JobHeader job={noSponsorshipJob} />);
    expect(screen.queryByText(/Sponsorship: Active/i)).not.toBeInTheDocument();
  });

  it('throws an error if job prop is missing (Defensive Programming)', () => {
    // Suppress console error for expected throw
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<JobHeader job={null as any} />)).toThrow(
      "JobHeader: 'job' prop is required for rendering."
    );
    spy.mockRestore();
  });
});