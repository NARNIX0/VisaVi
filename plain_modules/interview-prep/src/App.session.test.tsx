import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('starts and ends a mock interview session', () => {
  render(<App />);
  
  // Start session
  const startBtn = screen.getByText(/Start Practice Session/i);
  fireEvent.click(startBtn);
  
  // Check if End button and Timer appear
  expect(screen.getByText(/End Interview/i)).toBeInTheDocument();
  expect(screen.getByText(/00:00/i)).toBeInTheDocument();
  
  // End session
  const endBtn = screen.getByText(/End Interview/i);
  fireEvent.click(endBtn);
  
  // Verify UI returns to initial state
  expect(screen.getByText(/Start Practice Session/i)).toBeInTheDocument();
});