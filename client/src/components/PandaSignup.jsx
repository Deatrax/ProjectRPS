import React, { useState } from 'react';
import axios from 'axios';

const PandaSignup = ({ onLoginClick, onPasswordFocus, onPasswordBlur }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { 
        name, 
        email, 
        password 
      });
      console.log('Sign Up successful:', response.data);
      
      // On success, redirect to login
      onLoginClick(); 
    } catch (error) {
      console.error('Sign Up failed:', error.response?.data);
      setError(error.response?.data?.message || 'Sign up failed. Please try again.');
    }
  };

  return (
    <div className="card form" id="signupCard">
      <h2>Sign Up</h2>
      <form id="signupForm" autoComplete="on" onSubmit={handleSignupSubmit}>
        <label>
          Name
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // Trigger animation
            onFocus={onPasswordFocus}
            onBlur={onPasswordBlur}
            required
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            // Trigger animation
            onFocus={onPasswordFocus}
            onBlur={onPasswordBlur}
            required
          />
        </label>

        {error && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

        <p className="switch-text">
          Already have an account?{' '}
          <button type="button" className="link-btn" onClick={onLoginClick}>
            Log in
          </button>
        </p>

        <button className="primary" type="submit">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default PandaSignup;