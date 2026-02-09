import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, BookOpen, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Courses.css';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [addingCourse, setAddingCourse] = useState(false); 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const fetchCourses = async () => {
    if (!user || !user.token) {
      setLoading(false);
      setError('User not authenticated.');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get('http://localhost:5000/api/courses', config);
      setCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to fetch courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const addCourse = async () => {
    if (!newCourseName.trim() || !newCourseCode.trim()) {
      setError('Course name and code are required.');
      return;
    }
    if (!user || !user.token) {
      setError('User not authenticated. Please log in.');
      return;
    }

    setAddingCourse(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.post(
        'http://localhost:5000/api/courses',
        { name: newCourseName, code: newCourseCode, description: newCourseDesc },
        config
      );
      setCourses([...courses, response.data]);
      setNewCourseName('');
      setNewCourseCode('');
      setNewCourseDesc('');
      setShowAddCourse(false);
    } catch (err) {
      console.error('Error adding course:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add course.';
      if (errorMessage.includes('Course with this code already exists')) {
        setError('A course with this code already exists. Please use a different code.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setAddingCourse(false);
    }
  };

  const confirmDelete = async () => {
    if (!courseToDelete || !user || !user.token) {
        setError('Course or user not identified for deletion.');
        setShowDeleteConfirm(false);
        return;
    }

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        await axios.delete(`http://localhost:5000/api/courses/${courseToDelete._id}`, config);
        setCourses(courses.filter((course) => course._id !== courseToDelete._id));
        setShowDeleteConfirm(false);
        setCourseToDelete(null);
    } catch (err) {
        console.error('Error deleting course:', err);
        setError(err.response?.data?.message || 'Failed to delete course.');
        setShowDeleteConfirm(false);
        setCourseToDelete(null);
    }
  };

  const handleDeleteCourse = (e, course) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    setCourseToDelete(course);
    setShowDeleteConfirm(true);
  };

  if (loading) {
    return <div className="container"><div className="content-wrapper">Loading courses...</div></div>;
  }

  if (error && !showAddCourse) { // Display error only if not in add course modal
    return <div className="container"><div className="content-wrapper error-message">{error}</div></div>;
  }

  return (
    <div className="container">
      <div className="content-wrapper">
        <div className="header">
          <div className="header-text">
            <h1>My Courses</h1>
            <p className="subtitle">Manage your courses and learning materials</p>
          </div>
          <button onClick={() => setShowAddCourse(true)} className="btn-primary">
            <Plus size={20} />
            Add Course
          </button>
        </div>

        {/* Add Course */}
        {showAddCourse && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>New Course</h2>
                <button onClick={() => {setShowAddCourse(false); setError(null); setNewCourseName(''); setNewCourseCode(''); setNewCourseDesc('');}} className="btn-close">
                  <X size={24} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Course name"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Course code"
                value={newCourseCode}
                onChange={(e) => setNewCourseCode(e.target.value)}
                className="input-field"
              />
              <textarea
                placeholder="Course description"
                value={newCourseDesc}
                onChange={(e) => setNewCourseDesc(e.target.value)}
                className="textarea-field"
                rows="3"
              />
              <button onClick={addCourse} className="btn-submit" disabled={addingCourse}>
                {addingCourse ? 'Adding...' : 'Create Course'}
              </button>
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>
        )}

        {showDeleteConfirm && courseToDelete && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Confirm Deletion</h2>
              </div>
              <p>Are you sure you want to delete the course "{courseToDelete.name}"?</p>
              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => {setShowDeleteConfirm(false); setCourseToDelete(null);}} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="btn-primary">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Course Grid */}
        <div className="course-grid">
          {courses.length === 0 ? (
            <p className="empty-message">No courses added yet. Add some courses!</p>
          ) : (
            courses.map(course => (
              <Link to={`/courses/${course._id}`} key={course._id} className="course-card-link">
                <div className="course-card">
                  <div className="course-card-header">
                    <BookOpen size={48} />
                  </div>
                  <div className="course-card-body">
                    <h3>{course.name} ({course.code})</h3>
                    <p className="course-description">{course.description}</p>
                    <div className="course-stats">
                      <span>0 tasks</span>
                      <span>0 assignments</span>
                      <span>0 materials</span>
                    </div>
                     <button
                      onClick={(e) => handleDeleteCourse(e, course)}
                      className="delete-btn-card"
                      title="Delete Course"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
