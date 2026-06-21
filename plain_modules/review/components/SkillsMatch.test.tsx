import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AIVerdictCard } from './AIVerdictCard';
import { AIVerdict } from '@/types/job';

const mockVerdict: AIVerdict = {
  matchPercentage: 92,
  interviewChance: 64,
  offerChance: 14,
  verdictText: 'Strong Apply',
  skillsAlignment: [
    { name: 'Financial Analysis', percentage: 100 },
    { name: 'Excel', percentage: 90 },
    { name: 'Data Analysis', percentage: 80 },
    { name: 'PowerPoint', percentage: 70 },
  ],
};

describe('AIVerdictCard - Skills Match Section', () => {
  it('renders all skills with correct percentages', () => {
    render(<AIVerdictCard verdict={mockVerdict} />);
    
    expect(screen.getByText('Financial Analysis')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    
    expect(screen.getByText('Excel')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
    
    expect(screen.getByText('Data Analysis')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    
    expect(screen.getByText('PowerPoint')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('renders the "View all requirements" link', () => {
    render(<AIVerdictCard verdict={mockVerdict} />);
    expect(screen.getByText('View all requirements')).toBeInTheDocument();
  });

  it('renders progress bars with correct widths', () => {
    render(<AIVerdictCard verdict={mockVerdict} />);
    const progressBars = screen.getAllByRole('progressbar');
    
    // Financial Analysis (100%)
    expect(progressBars[0]).toHaveStyle('width: 100%');
    // PowerPoint (70%)
    expect(progressBars[3]).toHaveStyle('width: 70%');
  });

  it('throws error if skillsAlignment is missing', () => {
    const invalidVerdict = { ...mockVerdict, skillsAlignment: undefined } as any;
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<AIVerdictCard verdict={invalidVerdict} />)).toThrow(
      "AIVerdictCard: skillsAlignment data is missing or invalid."
    );
    
    consoleSpy.mockRestore();
  });
});