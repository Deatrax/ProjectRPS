// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import routing components
import './index.css';
import App from './App.jsx';
import Login from './pages/Login.jsx';  // Import Login page
import SignUp from './pages/Signup.jsx';  // Import SignUp page

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />  {/* Login Route */}
        <Route path="/signup" element={<SignUp />} />  {/* Sign Up Route */}
      </Routes>
    </Router>
  </StrictMode>
);
