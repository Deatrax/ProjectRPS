// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Keep Router here
import './index.css';
import App from './App.jsx';
import Login from './pages/Login/Login.jsx';  // Import Login page
import SignUp from './pages/Signup/Signup.jsx';  // Import SignUp pag
import Dashboard from './pages/Dashboard/Dashboard.jsx'; // Import Dashboard page
import AddCourse from './pages/Courses/AddCourse.jsx'; // Import AddCourse page
import AddCourse2 from './pages/AddCourse/AddCourse.jsx'; // Import AddCourse page
import TaskPicker from './components/TaskPicker.jsx'; // Import TaskPicker component
import CourseDetails from './components/CourseDetails.jsx'; // Import CourseDetails component
import TaskDetails from './components/TaskDetails.jsx'; // Import TaskDetails component
import Courses from './pages/Courses/Courses.jsx'; // Import Courses page
import CourseDetail from './pages/CourseDetail/CourseDetail.jsx'; // Import CourseDetail page
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Define your routes here */}
          {/* Public Routes */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses/new" element={<AddCourse />} />
            <Route path="/taskpicker" element={<TaskPicker />} />
            <Route path="/coursedetails" element={<CourseDetails />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            {/* Removed duplicate /courses/add as /courses/new exists, but keeping if user uses both */}
            <Route path="/courses/add" element={<AddCourse2 />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);
