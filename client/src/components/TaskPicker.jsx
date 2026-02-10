import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './TaskPicker.css';

const TaskPicker = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'lab',
    difficulty: 5,
    weight: 10
  });

  // Date state (indexes)
  // Defaults: Day 15 (index 14), Sep (index 8), 2025 (index 2)
  const [dateState, setDateState] = useState({
    dayIndex: 14,
    monthIndex: 8,
    yearIndex: 2
  });

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = [2023, 2024, 2025, 2026, 2027, 2028];

  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const ITEM_HEIGHT = 50;

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
      date: taskDate
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        }
      };

      const res = await axios.post('http://localhost:5000/api/tasks', payload, config);
      console.log('Task Created:', res.data);
      alert('Task Created Successfully!');

      // Optional: clear form
      setFormData({
        title: '',
        description: '',
        category: 'lab',
        difficulty: 5,
        weight: 10
      });
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Error creating task. See console for details.');
    }
  };

  return (
    <div className="task-picker-scope">
      <div className="picker-container">

        <h1 className="page-title">Add Task</h1>

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
              <div className="radio-group">
                <input
                  type="radio"
                  id="cat-lab"
                  name="category"
                  value="lab"
                  checked={formData.category === 'lab'}
                  onChange={handleChange}
                />
                <label htmlFor="cat-lab">Lab Task</label>

                <input
                  type="radio"
                  id="cat-assign"
                  name="category"
                  value="assign"
                  checked={formData.category === 'assign'}
                  onChange={handleChange}
                />
                <label htmlFor="cat-assign">Assignment</label>

                <input
                  type="radio"
                  id="cat-exam"
                  name="category"
                  value="exam"
                  checked={formData.category === 'exam'}
                  onChange={handleChange}
                />
                <label htmlFor="cat-exam">Exam Prep</label>
              </div>
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5].map((num, index) => (
                  <option key={num} value={num}>
                    {['Auto-pilot Task', 'Ugh, Okay!', 'Time To Be Thoughtful', 'Deep Focus Mode', 'Why Does This Exist!?'][index]}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Weight</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="The value should be within 1-100"
                required
              />
            </div>
            <div className="form-group">
              <label>Materials</label>
              <div className="upload-box" onClick={() => document.getElementById('file-input').click()}>
                <span className="plus-icon">+</span>
                <span>Click to Upload Files</span>
                <input type="file" id="file-input" hidden />
              </div>
            </div>

            <button type="submit" className="submit-btn">Create New Task</button>
          </fieldset>
        </form>

      </div>
    </div>
  );
};

export default TaskPicker;