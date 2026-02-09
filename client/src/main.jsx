// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import routing components
import './index.css';
import App from './App.jsx';
import Login from './pages/Login/Login.jsx';  // Import Login page
import SignUp from './pages/Signup/Signup.jsx';  // Import SignUp pag
import Dashboard from './pages/Dashboard/Dashboard.jsx'; // Import Dashboard page
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Define your routes here */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />  {/* Login Route */}
          <Route path="/signup" element={<SignUp />} />  {/* Sign Up Route */}
          <Route path="/dashboard" element={<Dashboard />} />  {/* Dashboard Route */}
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);
