import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Auth from './Auth';

describe('Auth Component', () => {
  const mockSetToken = jest.fn();
  const mockSetAuthError = jest.fn();

  it('renders login form by default', () => {
    render(
      <Auth
        authMode="login"
        setAuthMode={jest.fn()}
        setToken={mockSetToken}
        setAuthError={mockSetAuthError}
      />
    );
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows register form when authMode is register', () => {
    render(
      <Auth
        authMode="register"
        setAuthMode={jest.fn()}
        setToken={mockSetToken}
        setAuthError={mockSetAuthError}
      />
    );
    const registerButton = screen.getByText(/create account/i);
    expect(registerButton).toBeInTheDocument();
  });

  it('toggles between login and register modes', () => {
    const setAuthMode = jest.fn();
    const { rerender } = render(
      <Auth
        authMode="login"
        setAuthMode={setAuthMode}
        setToken={mockSetToken}
        setAuthError={mockSetAuthError}
      />
    );

    const toggleButton = screen.getByText(/sign up/i);
    fireEvent.click(toggleButton);
    expect(setAuthMode).toHaveBeenCalledWith('register');
  });
});
