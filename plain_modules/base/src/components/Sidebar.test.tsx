import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';
import { useStore } from '@/store/useStore';

// Mock the zustand store
jest.mock('@/store/useStore');

describe('Sidebar Component - User Profile', () => {
  beforeEach(() => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      user: {
        name: 'Alex Anderson',
        email: 'alex.anderson@example.com',
        avatarInitials: 'AA'
      },
      credits: 10
    });
  });

  it('renders user initials "AA"', () => {
    render(<Sidebar />);
    expect(screen.getByText('AA')).toBeInTheDocument();
  });

  it('renders user name and email', () => {
    render(<Sidebar />);
    expect(screen.getByText('Alex Anderson')).toBeInTheDocument();
    expect(screen.getByText('alex.anderson@example.com')).toBeInTheDocument();
  });

  it('renders the Pro upgrade promo card', () => {
    render(<Sidebar />);
    expect(screen.getByText(/Upgrade to Pro/i)).toBeInTheDocument();
    expect(screen.getByText(/Get unlimited AI insights/i)).toBeInTheDocument();
  });
});