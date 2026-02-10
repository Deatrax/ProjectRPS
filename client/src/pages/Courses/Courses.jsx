import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, BookOpen, FileText, CheckSquare, Trash2, FileQuestion, X } from 'lucide-react';
import './Courses.css';
import axios from 'axios';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseColor, setNewCourseColor] = useState(''); // New state for color
  const [newCourseSemester, setNewCourseSemester] = useState(''); // New state for semester
  const [addingCourse, setAddingCourse] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user || !user.token) {
        setLoading(false);
        setError('User not authenticated.');
        return;
      }

      setLoading(true);
      setError(null);

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
        { courseTitle: newCourseName, courseCode: newCourseCode, color: newCourseColor, semester: newCourseSemester }, // Map to backend schema
        config
      );
      setCourses([...courses, response.data]);
      setNewCourseName('');
      setNewCourseCode('');
      setNewCourseColor(''); // Reset color
      setNewCourseSemester(''); // Reset semester
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

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null); // Stores the course object to be deleted

  const handleDeleteCourse = (course) => {
    setCourseToDelete(course);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete || !user || !user.token) {
      setError('Course or user not identified for deletion.');
      setShowDeleteConfirm(false);
      return;
    }

    setLoading(true); // Can reuse loading for delete operation
    setError(null);

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
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="courses-page-wrapper">
      <div className="container">
        <div className="content-limit">
          
          {/* Header Section */}
          <div className="header-section">
            <div className="header-content">
              <div className="header-text">
                <h1 className="header-title">My Courses</h1>
                <p className="header-description">Manage your courses and learning materials</p>
              </div>
              
              <div 
                className="floating-button-wrapper"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setHoveredButton(null);
                }}
              >
                <button className={`add-button ${isHovered ? 'plus-active' : ''}`}>
                  <Plus size={28} />
                </button>

                {isHovered && (
                  <>
                    <button 
                      className={`action-btn btn-left ${hoveredButton === 1 ? 'is-hovered' : ''}`}
                      onMouseEnter={() => setHoveredButton(1)}
                      onClick={() => setShowAddCourse(true)} // Added onClick
                    >
                      <BookOpen size={18} /> Add Course
                    </button>

                    <button 
                      className={`action-btn btn-bottom ${hoveredButton === 2 ? 'is-hovered' : ''}`}
                      onMouseEnter={() => setHoveredButton(2)}
                    >
                      <CheckSquare size={18} /> Add Task
                    </button>

                    <button 
                      className={`action-btn btn-right ${hoveredButton === 3 ? 'is-hovered' : ''}`}
                      onMouseEnter={() => setHoveredButton(3)}
                    >
                      <FileQuestion size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="thin-line"></div>

          {/* Add Course Modal */}
          {showAddCourse && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>New Course</h2>
                  <button onClick={() => {setShowAddCourse(false); setError(null); setNewCourseName(''); setNewCourseCode(''); setNewCourseColor(''); setNewCourseSemester('');}} className="btn-close">
                    <X size={24} />
                  </button>
                </div>
                {error && <p className="error-message">{error}</p>}
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
                <input // New input for color
                  type="text"
                  placeholder="Course Color (e.g., #3b82f6)"
                  value={newCourseColor}
                  onChange={(e) => setNewCourseColor(e.target.value)}
                  className="input-field"
                />
                <input // New input for semester
                  type="text"
                  placeholder="Semester (e.g., Fall 2023)"
                  value={newCourseSemester}
                  onChange={(e) => setNewCourseSemester(e.target.value)}
                  className="input-field"
                />
                <button onClick={addCourse} className="btn-submit" disabled={addingCourse}>
                  {addingCourse ? 'Adding...' : 'Create Course'}
                </button>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && courseToDelete && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>Confirm Deletion</h2>
                  <button onClick={() => {setShowDeleteConfirm(false); setError(null);}} className="btn-close">
                    <X size={24} />
                  </button>
                </div>
                {error && <p className="error-message">{error}</p>}
                <p>Are you sure you want to delete the course "{courseToDelete.courseTitle}"?</p>
                <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <button onClick={() => {setShowDeleteConfirm(false); setCourseToDelete(null);}} className="btn-secondary">
                    Cancel
                  </button>
                  <button onClick={confirmDelete} className="btn-primary" disabled={loading}>
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Course Rows */}
          <div className="course-list">
            {courses.map(course => (
              <div key={course._id} className="course-card">
                <div className="course-info">
                  <p className="course-code">{course.courseCode}</p>
                  <h3 className="course-title">{course.courseTitle}</h3>
                  <p className="course-meta">0 assignments total</p>
                </div>

                <div className="icon-group-container">
                  <div className="stat-item">
                    <div className="stat-icon task-bg"><CheckSquare size={18} /></div>
                    <span className="stat-count">0</span>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon assignment-bg"><FileText size={18} /></div>
                    <span className="stat-count">0</span>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon material-bg"><BookOpen size={18} /></div>
                    <span className="stat-count">0</span>
                  </div>
                  <button className="delete-row-btn" title="Delete Course" onClick={() => handleDeleteCourse(course)}>
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Courses;