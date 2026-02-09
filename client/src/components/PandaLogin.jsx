import React from 'react';

const PandaLogin = ({ onSignupClick, onPasswordFocus, onPasswordBlur }) => {
  return (
    <div className="card form" id="loginCard">
      <h2>Login</h2>
      <form id="loginForm">
        <label>Email
          <input type="email" placeholder="you@example.com" required />
        </label>
        <label>Password
          <input 
            type="password" 
            placeholder="••••••••" 
            onFocus={onPasswordFocus} 
            onBlur={onPasswordBlur}
            required 
          />
        </label>
        <p className="switch-text">
          Don't have an account? 
          <button type="button" className="link-btn" onClick={onSignupClick}>Sign up</button>
        </p>
        <button className="primary" type="submit">Sign in</button>
      </form>
    </div>
  );
};

export default PandaLogin;