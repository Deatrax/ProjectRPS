// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Logging in with:', { email, password });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      
      {/* Link to Sign Up page */}
      <div>
        <p>Don't have an account?</p>
        <Link to="/signup">Sign up here</Link>
      </div>
    </div>
  );
};

export default Login;
