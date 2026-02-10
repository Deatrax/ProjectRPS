import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PandaLogin = ({ onSignupClick, onPasswordFocus, onPasswordBlur }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log('Login successful:', response.data);

      const token = response.data.token;
      // Decode token to get user data (payload)
      const payload = JSON.parse(atob(token.split('.')[1]));

      login(payload, token);
      navigate('/dashboard');
    } catch (error) {
      console.log('Login failed:', error.response?.data || error.message);
      // Handle error (e.g., show error message)
    }
  };
  return (
    <div className="card form" id="loginCard">
      <h2>Login</h2>
      <form id="loginForm" onSubmit={handleSubmit}>
        <label>Email
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>Password
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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