import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import './Signup.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const showAlert = (title, message, type = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showAlert("Error", "Passwords don't match!", "danger");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
      console.log('Sign Up successful:', response.data);

      if (response.data.token) {
        login(response.data.user, response.data.token);
        navigate('/');
      } else {
        navigate('/login');
      }

    } catch (error) {
      console.log('Sign Up failed:', error.response?.data || error.message);
      showAlert("Error", error.response?.data?.message || 'Sign Up failed', "danger");
    }
  };

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>

      {/* Global Modal for Alerts */}
      {modalConfig.isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalConfig.title}</h2>
              <button onClick={closeModal} className="btn-close" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                padding: '0.6rem',
                borderRadius: '50%',
                display: 'flex',
                transition: 'all 0.3s ease'
              }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>{modalConfig.message}</p>
            </div>
            <div className="modal-actions">
              <button onClick={closeModal} className="btn-modal-primary">
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
