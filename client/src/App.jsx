import { Routes, Route, Link } from 'react-router-dom';
import './index.css';
import PandaLamp from './components/PandaLamp';
import AddTask from './components/AddTask';

function App() {
  return (
    <div>
      <Routes>
        {/* Change path="/" to path="*" to match all sub-routes */}
        <Route path="/" element={<PandaLamp />} />
        <Route path="/AddTask" element={<AddTask />} />
      </Routes>
    </div>
  );
}

export default App;
