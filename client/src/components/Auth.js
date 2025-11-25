import React from 'react';

const Auth = ({
    authMode,
    setAuthMode,
    authUsername,
    setAuthUsername,
    authPassword,
    setAuthPassword,
    handleLogin,
    handleRegister,
    authError
}) => {
    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{authMode === 'login' ? 'Login' : 'Register'}</h2>
                {authError && <p style={{color:'red'}}>{authError}</p>}
                <form onSubmit={authMode === 'login' ? handleLogin : handleRegister}>
                    <input
                        type="text"
                        placeholder="User"
                        value={authUsername}
                        onChange={e => setAuthUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Pass"
                        value={authPassword}
                        onChange={e => setAuthPassword(e.target.value)}
                    />
                    <button className="auth-btn">
                        {authMode === 'login' ? 'Login' : 'Register'}
                    </button>
                </form>
                <p className="auth-link" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
                    Switch to {authMode === 'login' ? 'Register' : 'Login'}
                </p>
            </div>
        </div>
    );
};

export default Auth;