// src/App.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './index.css';

function App() {
  const [count, setCount] = useState(0);
  const { user, logout } = useAuth();

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {/* Link to the login page */}
      <div>
        {user ? (
          <div>
            <h2>Welcome, {user.name}!</h2>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <div>
            <Link to="/login">Go to Login</Link>
            <br />
            <Link to="/signup">Go to Sign Up</Link>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
