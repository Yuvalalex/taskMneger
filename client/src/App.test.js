import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios');

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/task manager/i)).toBeInTheDocument();
  });

  it('renders Auth component when not logged in', () => {
    localStorage.clear();
    render(<App />);
    // Auth component should be rendered
    const element = document.querySelector('[data-testid="auth-form"]');
    expect(element).toBeInTheDocument();
  });

  it('renders main app when logged in', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('username', 'testuser');
    render(<App />);
    const sidebar = document.querySelector('[data-testid="sidebar"]');
    expect(sidebar).toBeInTheDocument();
  });
});
