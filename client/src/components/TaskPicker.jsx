import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './TaskPicker.css';

const TaskPicker = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    difficulty: 5,
    weight: 10
  });

  // Date state (indexes)
  // Defaults: Current Date
  const today = new Date();
  const [dateState, setDateState] = useState({
    dayIndex: today.getDate() - 1,
    monthIndex: today.getMonth(),
    yearIndex: 2 // 2025 (index 2 in years array below) - adjust if needed
  });

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = [2023, 2024, 2025, 2026, 2027, 2028];

  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const ITEM_HEIGHT = 50;

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch courses on mount
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

  const handleScroll = (e, type) => {
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    setDateState(prev => ({ ...prev, [type]: index }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      alert('You must be logged in to create a task.');
      return;
    }

    // Calculate actual date
    const dIndex = Math.min(Math.max(0, dateState.dayIndex), days.length - 1);
    const mIndex = Math.min(Math.max(0, dateState.monthIndex), months.length - 1);
    const yIndex = Math.min(Math.max(0, dateState.yearIndex), years.length - 1);

    const selectedDay = days[dIndex];
    const selectedMonth = mIndex; // 0-11
    const selectedYear = years[yIndex];

    // Create date object (set time to noon to avoid timezone issues)
    const taskDate = new Date(selectedYear, selectedMonth, selectedDay, 12, 0, 0);

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
      const token = localStorage.getItem('token'); // Use token from localStorage for reliability
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Standard Bearer token
        }
      };

      const res = await axios.post('http://localhost:5000/api/tasks', payload, config);
      console.log('Task Created:', res.data);
      alert('Task Created Successfully!');

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'General',
        difficulty: 5,
        weight: 10,
        course: courses.length > 0 ? courses[0]._id : ''
      });
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Error creating task. See console for details.');
    }
  };

  const categories = ['Exam', 'Assignment', 'Lab Task', 'Presentation', 'Project', 'General'];

  return (
    <div className="task-picker-scope">
      <div className="picker-container">

        <h1 className="page-title">Add New Task</h1>

        {/* 1. Date Picker */}
        <div className="date-picker-section">
          {/* Day Wheel */}
          <div
            className="wheel"
            id="dayWheel"
            ref={dayRef}
            onScroll={(e) => handleScroll(e, 'dayIndex')}
          >
            <div className="wheel-spacer"></div>
            {days.map(d => (
              <div key={d} className="wheel-item">{d}</div>
            ))}
            <div className="wheel-spacer"></div>
          </div>

          {/* Month Wheel */}
          <div
            className="wheel"
            id="monthWheel"
            ref={monthRef}
            onScroll={(e) => handleScroll(e, 'monthIndex')}
          >
            <div className="wheel-spacer"></div>
            {months.map((m, i) => (
              <div key={i} className="wheel-item">{m}</div>
            ))}
            <div className="wheel-spacer"></div>
          </div>

          {/* Year Wheel */}
          <div
            className="wheel"
            id="yearWheel"
            ref={yearRef}
            onScroll={(e) => handleScroll(e, 'yearIndex')}
          >
            <div className="wheel-spacer"></div>
            {years.map(y => (
              <div key={y} className="wheel-item">{y}</div>
            ))}
            <div className="wheel-spacer"></div>
          </div>
        </div>

        {/* 2. Form */}
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Task Details</legend>

            <div className="form-group">
              <label>Course</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              >
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
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Calculus Midterm"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide the details regarding this task..."
              ></textarea>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#333', color: 'white' }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty (1-10)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  style={{ flex: 1 }}
                />
                <span style={{ fontWeight: 'bold' }}>{formData.difficulty}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Weight (1-100%)</label>
              <input
                type="number"
                name="weight"
                min="1"
                max="100"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Importance %"
                required
              />
            </div>

            <button type="submit" className="submit-btn" style={{ marginTop: '20px' }}>Create Task</button>
          </fieldset>
        </form>

      </div>
    </div>
  );
};

export default TaskPicker;