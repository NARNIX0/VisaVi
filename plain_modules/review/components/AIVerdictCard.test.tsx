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
};

describe('AIVerdictCard', () => {
  it('renders the verdict text and match percentage', () => {
    render(<AIVerdictCard verdict={mockVerdict} />);
    expect(screen.getByText('Strong Apply')).toBeInTheDocument();
    expect(screen.getByText(/92% match/)).toBeInTheDocument();
  });

  it('renders interview and offer chances correctly', () => {
    render(<AIVerdictCard verdict={mockVerdict} />);
    expect(screen.getByText('Interview Chance')).toBeInTheDocument();
    expect(screen.getByText('64%')).toBeInTheDocument();
    expect(screen.getByText('Offer Chance')).toBeInTheDocument();
    expect(screen.getByText('14%')).toBeInTheDocument();
  });

  it('displays circular progress with the match value', () => {
    render(<AIVerdictCard verdict={mockVerdict} />);
    // CircularProgress displays the percentage text inside
    const percentageElements = screen.getAllByText('92%');
    expect(percentageElements.length).toBeGreaterThan(0);
  });
});