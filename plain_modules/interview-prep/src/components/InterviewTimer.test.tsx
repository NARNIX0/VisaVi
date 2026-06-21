import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { InterviewTimer } from './InterviewTimer';

test('renders initial time 00:00', () => {
  render(<InterviewTimer isActive={true} />);
  expect(screen.getByText('00:00')).toBeInTheDocument();
});

test('increments time after 1 second', () => {
  jest.useFakeTimers();
  render(<InterviewTimer isActive={true} />);
  
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  
  expect(screen.getByText('00:01')).toBeInTheDocument();
  jest.useRealTimers();
});