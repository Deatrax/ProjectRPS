// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Keep Router here
import './index.css';
import App from './App.jsx';  // Import App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router> {/* Router at the root level */}
      <Routes>
        {/* Define the main route */}
        <Route path="/" element={<App />} /> {/* App renders PandaLamp with routing */}
      </Routes>
    </Router>
  </StrictMode>
);
