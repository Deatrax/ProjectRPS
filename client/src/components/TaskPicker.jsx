import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './TaskPicker.css';

const TaskPicker = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for comparison

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    difficulty: 5,
    weight: 10
  });

  // Date state (indexes)
  const [dateState, setDateState] = useState({
    dayIndex: today.getDate() - 1,
    monthIndex: today.getMonth(),
    yearIndex: 2 // Default to 2025 (adjust based on years array)
  });

  const [error, setError] = useState('');

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' 
  });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const currentYearVal = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYearVal + i);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Dynamically calculate days
  const currentYear = years[dateState.yearIndex];
  const currentMonth = dateState.monthIndex;
  const numDays = getDaysInMonth(currentMonth, currentYear);
  const days = Array.from({ length: numDays }, (_, i) => i + 1);

  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const ITEM_HEIGHT = 50;

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (user && user.token) {
          const res = await axios.get('http://localhost:5000/api/courses', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setCourses(res.data);
          if (res.data.length > 0) {
            setFormData(prev => ({ ...prev, course: res.data[0]._id }));
          }
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, [user]);

  useEffect(() => {
    // Initial scroll
    if (dayRef.current) dayRef.current.scrollTop = dateState.dayIndex * ITEM_HEIGHT;
    if (monthRef.current) monthRef.current.scrollTop = dateState.monthIndex * ITEM_HEIGHT;
    if (yearRef.current) yearRef.current.scrollTop = dateState.yearIndex * ITEM_HEIGHT;
  }, []);

  // Ensure dayIndex stays within bounds when month/year changes
  useEffect(() => {
    if (dateState.dayIndex >= numDays) {
      const newDayIndex = numDays - 1;
      setDateState(prev => ({ ...prev, dayIndex: newDayIndex }));
      if (dayRef.current) dayRef.current.scrollTop = newDayIndex * ITEM_HEIGHT;
    }
  }, [numDays]);

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
    if (modalConfig.title === 'Success') {
      navigate('/tasks');
    }
  };

  const handleScroll = (e, type) => {
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);

    // Safety check for index range
    let maxIndex = 0;
    if (type === 'dayIndex') maxIndex = numDays - 1;
    if (type === 'monthIndex') maxIndex = months.length - 1;
    if (type === 'yearIndex') maxIndex = years.length - 1;

    const safeIndex = Math.min(Math.max(0, index), maxIndex);
    setDateState(prev => ({ ...prev, [type]: safeIndex }));
    setError(''); // Clear error on scroll
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user || !user.token) {
      setError('You must be logged in to create a task.');
      return;
    }

    const selectedDay = days[dateState.dayIndex];
    const selectedMonth = dateState.monthIndex;
    const selectedYear = years[dateState.yearIndex];

    // Create date object
    const taskDate = new Date(selectedYear, selectedMonth, selectedDay, 23, 59, 59);

    // 1. Validation: Cannot be in the past
    if (taskDate < today) {
      setError('Deadline cannot be in the past. Please select a future date.');
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      difficulty: Number(formData.difficulty),
      weight: Number(formData.weight),
      deadline: taskDate,
      course: formData.course
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      };

      await axios.post('http://localhost:5000/api/tasks', payload, config);
      showAlert('Success', 'Task Created Successfully!');
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.message || 'Error creating task.');
    }
  };

  const categories = ['Exam', 'Assignment', 'Lab Task', 'Presentation', 'Project', 'General'];

  return (
    <div className="task-picker-scope">
      <div className="picker-container">

        <div className="header-section">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft size={20}/>
          </button>
          <h1 className="page-title">Add New Task</h1>
        </div>

        <div className="thin-line"></div>

        {error && (
          <div className="error-alert">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Date Picker */}
        <div className="date-picker-section">
          <div className="wheel" ref={dayRef} onScroll={(e) => handleScroll(e, 'dayIndex')}>
            <div className="wheel-spacer"></div>
            {days.map(d => (
              <div key={d} className={`wheel-item ${d === days[dateState.dayIndex] ? 'active' : ''}`}>{d}</div>
            ))}
            <div className="wheel-spacer"></div>
          </div>

          <div className="wheel" ref={monthRef} onScroll={(e) => handleScroll(e, 'monthIndex')}>
            <div className="wheel-spacer"></div>
            {months.map((m, i) => (
              <div key={i} className={`wheel-item ${i === dateState.monthIndex ? 'active' : ''}`}>{m}</div>
            ))}
            <div className="wheel-spacer"></div>
          </div>

          <div className="wheel" ref={yearRef} onScroll={(e) => handleScroll(e, 'yearIndex')}>
            <div className="wheel-spacer"></div>
            {years.map((y, i) => (
              <div key={y} className={`wheel-item ${i === dateState.yearIndex ? 'active' : ''}`}>{y}</div>
            ))}
            <div className="wheel-spacer"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Task Details</legend>

            <div className="form-group">
              <label>Course</label>
              <select name="course" value={formData.course} onChange={handleChange} required>
                <option value="" disabled>Select a Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.courseCode} - {course.courseTitle}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Task Name</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Calculus Midterm" required />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Provide details..."></textarea>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty (1-5)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="range" min="1" max="5" name="difficulty" value={formData.difficulty} onChange={handleChange} style={{ flex: 1 }} />
                <span style={{ fontWeight: 'bold', color:'white' }}>{formData.difficulty}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Weight (1-100%)</label>
              <input type="number" name="weight" min="1" max="100" value={formData.weight} onChange={handleChange} required />
            </div>

            <button type="submit" className="submit-btn">Create Task</button>
          </fieldset>
        </form>
      </div>

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

export default TaskPicker;