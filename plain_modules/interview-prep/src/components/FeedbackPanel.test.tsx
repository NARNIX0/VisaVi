import React from 'react';
import { render, screen } from '@testing-library/react';
import { FeedbackPanel } from './FeedbackPanel';
import { InterviewMetrics } from '../types';

const mockMetrics: InterviewMetrics = {
  communication: 8.5,
  confidence: 7.8,
  structure: 8.0,
  relevance: 9.0,
  technicalDepth: 7.2,
  questionsAnswered: 3,
  totalQuestions: 8,
  suggestions: [
    "Good structure in your answer",
    "Try to quantify your impact",
    "Add more about teamwork"
  ]
};

describe('FeedbackPanel Conformance', () => {
  test('renders all specific score categories', () => {
    render(<FeedbackPanel metrics={mockMetrics} />);
    
    expect(screen.getByText(/Communication/i)).toBeInTheDocument();
    expect(screen.getByText(/8.5\/10/)).toBeInTheDocument();
    expect(screen.getByText(/Confidence/i)).toBeInTheDocument();
    expect(screen.getByText(/Structure/i)).toBeInTheDocument();
  });

  test('renders circular progress question count', () => {
    render(<FeedbackPanel metrics={mockMetrics} />);
    const questionProgress = screen.getByText('3/8');
    expect(questionProgress).toBeInTheDocument();
  });

  test('renders live AI suggestions from requirements', () => {
    render(<FeedbackPanel metrics={mockMetrics} />);
    
    expect(screen.getByText("Good structure in your answer")).toBeInTheDocument();
    expect(screen.getByText("Try to quantify your impact")).toBeInTheDocument();
    expect(screen.getByText("Add more about teamwork")).toBeInTheDocument();
  });

  test('handles empty suggestions array gracefully', () => {
    const emptyMetrics: InterviewMetrics = {
      ...mockMetrics,
      suggestions: []
    };
    render(<FeedbackPanel metrics={emptyMetrics} />);
    expect(screen.getByText(/Awaiting AI analysis/i)).toBeInTheDocument();
  });

  test('handles zero values correctly for debugging safety', () => {
    const zeroMetrics: InterviewMetrics = {
      communication: 0,
      confidence: 0,
      structure: 0,
      relevance: 0,
      technicalDepth: 0,
      questionsAnswered: 0,
      totalQuestions: 10,
      suggestions: []
    };
    render(<FeedbackPanel metrics={zeroMetrics} />);
    // Check that we display 0.0 for scores
    const scores = screen.getAllByText(/0.0\/10/);
    expect(scores.length).toBeGreaterThan(0);
    expect(screen.getByText('0/10')).toBeInTheDocument();
  });
});