// src/App.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './index.css';
import PandaLamp from './components/PandaLamp';

function App() {
  const [count, setCount] = useState(0);
  const { user, logout } = useAuth();

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <button onClick={logout}>Logout</button>
          <Link to="/dashboard">Go to Dashboard</Link>
        </div>
      ) : (
        <PandaLamp />
      )}
    </div>
  );
}

export default App;
