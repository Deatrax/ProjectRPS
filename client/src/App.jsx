import { Routes, Route, Link } from 'react-router-dom';
import './index.css';
import PandaLamp from './components/PandaLamp';

function App() {
  return (
    <div>
      {/* Navigation Links */}
      <nav>
        <Link to="/login">Go to Login</Link>
      </nav>

      <Routes>
        {/* Change path="/" to path="*" to match all sub-routes */}
        <Route path="*" element={<PandaLamp />} />
      </Routes>
    </div>
  );
}

export default App;
