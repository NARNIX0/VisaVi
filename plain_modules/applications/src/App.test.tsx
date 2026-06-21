import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('Job Tracker Summary Row', () => {
  test('renders all 6 summary cards with correct initial counts', () => {
    render(<App />);
    
    expect(screen.getByText('All Applications')).toBeInTheDocument();
    expect(screen.getByText('Applied')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Interview')).toBeInTheDocument();
    expect(screen.getByText('Offer')).toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  test('verifies specific count for Offer card', () => {
    render(<App />);
    const offerContainer = screen.getByText('Offer').closest('div');
    expect(offerContainer).toHaveTextContent('1');
  });
});