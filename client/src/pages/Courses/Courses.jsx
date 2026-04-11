import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Edit, BookOpen, FileText, CheckSquare, Trash2, FileQuestion, X, ArrowLeft, Plus } from 'lucide-react';
import './Courses.css';
import axios from 'axios';

const Courses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taskCounts, setTaskCounts] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCoursesAndTasks = async () => {
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

        // Fetch courses and tasks in parallel
        const [coursesResponse, tasksResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/courses', config),
          axios.get('http://localhost:5000/api/tasks', config)
        ]);
        
        setCourses(coursesResponse.data);

        // Process tasks to get counts
        const counts = tasksResponse.data.reduce((acc, task) => {
          if (task.course) {
            const courseId = task.course._id || task.course;
            acc[courseId] = (acc[courseId] || 0) + 1;
          }
          return acc;
        }, {});
        setTaskCounts(counts);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch courses or tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndTasks();
  }, [user]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

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

    setLoading(true);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.floating-button-wrapper')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);


  return (
    <div className="courses-page-wrapper">
      <div className="container">
        <div className="content-limit">

          {/* Header Section */}
          <div className="header-section">
            <div className="header-content">
              <Link to="/dashboard" className="back-btn">
                <ArrowLeft size={20}/>
              </Link>
              <div className="header-text">
                <h1>My Courses</h1>
                <p>Manage your courses and learning materials</p>
              </div>

              <div
                className="floating-button-wrapper"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setHoveredButton(null);
                }}
              >
                {/* on click toggle menu open/closed */}
                <button
                  className={`add-button ${isHovered || isMenuOpen ? 'plus-active' : ''}`}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Edit size={28} />
                </button>

                {/* Floating action buttons are shown if menu is open */}
                {isHovered || isMenuOpen ? (
                  <>
                    <button
                      className={`action-btn btn-left ${hoveredButton === 1 ? 'is-hovered' : ''}`}
                      onMouseEnter={() => setHoveredButton(1)}
                      onClick={() => navigate('/courses/add')}
                    >
                      <BookOpen size={18} /> Add Course
                    </button>

                    <button
                      className={`action-btn btn-bottom ${hoveredButton === 2 ? 'is-hovered' : ''}`}
                      onMouseEnter={() => setHoveredButton(2)}
                      onClick={() => navigate('/taskpicker')}
                    >
                      <CheckSquare size={18} /> Add Task
                    </button>

                    <button
                      className={`action-btn btn-right ${hoveredButton === 3 ? 'is-hovered' : ''}`}
                      onMouseEnter={() => setHoveredButton(3)}
                    >
                      <Trash2 size={18} /> Delete All
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          <div className="thin-line"></div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && courseToDelete && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>Confirm Deletion</h2>
                  <button onClick={() => { setShowDeleteConfirm(false); setError(null); }} className="btn-close">
                    <X size={24} />
                  </button>
                </div>
                <div className="modal-body">
                  {error && <p className="error-message">{error}</p>}
                  <p>Are you sure you want to delete the course <span className="highlight-text">"{courseToDelete.courseTitle}"</span>?</p>
                </div>
                <div className="modal-actions">
                  <button onClick={() => { setShowDeleteConfirm(false); setCourseToDelete(null); }} className="btn-modal-secondary">
                    Cancel
                  </button>
                  <button onClick={confirmDelete} className="btn-modal-danger" disabled={loading}>
                    {loading ? 'Deleting...' : 'Delete Course'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Course Rows */}
          <div className="course-list">
            {courses.map(course => (
              <div
                key={course._id}
                className="course-card"
                onClick={() => window.location.href = `/coursedetails?id=${course._id}`}
                style={{ '--course-color': course.color }}
              >
                <div className="course-accent" style={{ backgroundColor: course.color }}></div>
                <div className="course-info">
                  <p className="course-code" style={{ color: course.color }}>{course.courseCode}</p>
                  <h3 className="course-title">{course.courseTitle}</h3>
                  <p className="course-meta">{taskCounts[course._id] || 0} tasks total</p>
                </div>

                <div className="icon-group-container">
                  <div className="stat-item">
                    <div className="stat-icon task-bg"><CheckSquare size={18} /></div>
                    <span className="stat-count">{taskCounts[course._id] || 0}</span>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon assignment-bg"><FileText size={18} /></div>
                    <span className="stat-count">0</span>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon material-bg"><BookOpen size={18} /></div>
                    <span className="stat-count">0</span>
                  </div>
                  <button
                    className="delete-row-btn"
                    title="Delete Course"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCourse(course);
                    }}
                  >
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