import React from 'react';

function Auth({
  authMode,
  setAuthMode,
  authUsername,
  setAuthUsername,
  authPassword,
  setAuthPassword,
  handleLogin,
  handleRegister,
  authError,
  isLoading,
}) {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{authMode === 'login' ? 'Login' : 'Create Account'}</h2>
        {authError && <p className="auth-error">{authError}</p>}
        <form onSubmit={authMode === 'login' ? handleLogin : handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={authUsername}
            onChange={(e) => setAuthUsername(e.target.value)}
            minLength={3}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            minLength={authMode === 'register' ? 6 : 1}
            required
            disabled={isLoading}
          />
          {authMode === 'register' && authPassword.length > 0 && authPassword.length < 6 && (
            <p className="auth-hint">Password must be at least 6 characters</p>
          )}
          <button className="auth-btn" disabled={isLoading}>
            {isLoading ? 'Loading...' : (authMode === 'login' ? 'Login' : 'Register')}
          </button>
        </form>
        <p
          className="auth-link"
          onClick={() => {
            if (!isLoading) setAuthMode(authMode === 'login' ? 'register' : 'login');
          }}
        >
          {authMode === 'login' ? 'Don\'t have an account? Register' : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  );
}

export default Auth;
