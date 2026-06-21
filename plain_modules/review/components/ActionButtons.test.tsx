import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ActionButtons } from './ActionButtons';

describe('ActionButtons Component', () => {
  it('renders all required action buttons', () => {
    render(<ActionButtons />);
    
    expect(screen.getByRole('button', { name: /reject/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save for later/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /outreach/i })).toBeInTheDocument();
    expect(screen.getByText(/One-Click Apply/i)).toBeInTheDocument();
  });

  it('renders the One-Click Apply button with AI subtext and icon', () => {
    render(<ActionButtons />);
    
    const applyButton = screen.getByText(/One-Click Apply/i).closest('button');
    expect(applyButton).toHaveClass('bg-emerald-900'); // Dark green
    expect(screen.getByText(/AI will generate your application/i)).toBeInTheDocument();
    
    // Check for presence of the SVG icon (Sparkles)
    const svg = applyButton?.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders the Reject button with red styling', () => {
    render(<ActionButtons />);
    const rejectButton = screen.getByRole('button', { name: /reject/i });
    expect(rejectButton).toHaveClass('text-red-600', 'border-red-200');
  });

  it('triggers console log on button click (debug check)', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<ActionButtons />);
    
    const rejectButton = screen.getByRole('button', { name: /reject/i });
    fireEvent.click(rejectButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('ActionButtons: Reject clicked.');
    consoleSpy.mockRestore();
  });
});