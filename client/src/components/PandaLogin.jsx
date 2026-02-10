import React, { useState } from 'react';
import axios from 'axios';

const PandaLogin = ({ onSignupClick, onPasswordFocus, onPasswordBlur }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log('Login successful:', response.data);

      // Save token or handle successful login logic (e.g., redirect to dashboard)
      localStorage.setItem('token', response.data.token);  // Save the JWT token in local storage
      // Redirect or update UI accordingly
    } catch (error) {
      console.log('Login failed:', error.response.data);
      // Handle error (e.g., show error message)
    }
  };
  return (
    <div className="card form" id="loginCard">
      <h2>Login</h2>
      <form id="loginForm" onSubmit={handleSubmit}>
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