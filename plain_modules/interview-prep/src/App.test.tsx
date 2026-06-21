import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the "View all applications" button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/View all applications/i);
  expect(buttonElement).toBeInTheDocument();
});

test('renders specific interview entries from requirements', () => {
  render(<App />);
  expect(screen.getByText(/Deloitte Graduate Analyst/i)).toBeInTheDocument();
  expect(screen.getByText(/Google Product Analyst/i)).toBeInTheDocument();
  expect(screen.getByText(/JPMorgan Chase/i)).toBeInTheDocument();
});