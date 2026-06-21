import React from 'react';
import { render, screen } from '@testing-library/react';
import { InterviewList } from './InterviewList';
import { Interview } from '../types';

const mockInterviews: Interview[] = [
  { id: '1', company: 'Deloitte', role: 'Graduate Analyst', date: 'Tomorrow', matchPercentage: 92 },
];

test('renders interview details correctly', () => {
  render(<InterviewList interviews={mockInterviews} />);
  
  const element = screen.getByText(/Deloitte Graduate Analyst/i);
  expect(element).toBeInTheDocument();
  
  const details = screen.getByText(/Tomorrow, 92% match/i);
  expect(details).toBeInTheDocument();
});