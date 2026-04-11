import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Edit, BookOpen, FileText, CheckSquare, Trash2, X, ArrowLeft, Plus, Check } from 'lucide-react';
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

  // Selection Mode State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);

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
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const handleDeleteCourse = (course) => {
    setCourseToDelete(course);
    setIsBulkDelete(false);
    setShowDeleteConfirm(true);
  };

  const handleBulkDeleteInitiate = () => {
    if (selectedCourses.length === 0) {
      setError('Please select at least one course to delete.');
      return;
    }
    setIsBulkDelete(true);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!user || !user.token) {
      setError('User not identified for deletion.');
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

      if (isBulkDelete) {
        await axios.post('http://localhost:5000/api/courses/bulk-delete', { courseIds: selectedCourses }, config);
        setCourses(courses.filter((course) => !selectedCourses.includes(course._id)));
        setSelectedCourses([]);
        setIsSelectionMode(false);
      } else if (courseToDelete) {
        await axios.delete(`http://localhost:5000/api/courses/${courseToDelete._id}`, config);
        setCourses(courses.filter((course) => course._id !== courseToDelete._id));
      }
      
      setShowDeleteConfirm(false);
      setCourseToDelete(null);
      setIsBulkDelete(false);
    } catch (err) {
      console.error('Error deleting course(s):', err);
      setError(err.response?.data?.message || 'Failed to delete course(s).');
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseSelection = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === courses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(courses.map(c => c._id));
    }
  };

  const cancelSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedCourses([]);
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

              {!isSelectionMode && (
                <div
                  className="floating-button-wrapper"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => {
                    setIsHovered(false);
                    setHoveredButton(null);
                  }}
                >
                  <button
                    className={`add-button ${isHovered || isMenuOpen ? 'plus-active' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <Edit size={28} />
                  </button>

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
                        onClick={() => setIsSelectionMode(true)}
                      >
                        <Trash2 size={18} /> Delete All
                      </button>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div className="thin-line"></div>

          {/* Course Rows */}
          <div className={`course-list ${isSelectionMode ? 'selection-active' : ''}`}>
            {courses.map(course => (
              <div
                key={course._id}
                className={`course-card ${selectedCourses.includes(course._id) ? 'selected' : ''}`}
                onClick={() => isSelectionMode ? toggleCourseSelection(course._id) : window.location.href = `/coursedetails?id=${course._id}`}
                style={{ '--course-color': course.color }}
              >
                {isSelectionMode && (
                  <div className="selection-checkbox-wrapper" onClick={(e) => { e.stopPropagation(); toggleCourseSelection(course._id); }}>
                    <div className={`custom-checkbox ${selectedCourses.includes(course._id) ? 'checked' : ''}`}>
                      {selectedCourses.includes(course._id) && <Check size={16} />}
                    </div>
                  </div>
                )}
                <div className="course-accent" style={{ backgroundColor: course.color }}></div>
                <div className="course-info">
                  <p className="course-code" style={{ color: course.color }}>{course.courseCode}</p>
                  <h3 className="course-title">{course.courseTitle}</h3>
                  <p className="course-meta">{taskCounts[course._id] || 0} tasks total</p>
                </div>

                {!isSelectionMode && (
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
                )}
              </div>
            ))}
          </div>

          {/* Selection Bar at the end */}
          {isSelectionMode && (
            <div className="selection-bar animate-slide-up">
              <div className="selection-info">
                <span className="selected-count">{selectedCourses.length} selected</span>
                <button className="btn-select-all" onClick={handleSelectAll}>
                  {selectedCourses.length === courses.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="selection-actions">
                <button className="btn-cancel-selection" onClick={cancelSelectionMode}>
                  Cancel
                </button>
                <button 
                  className="btn-delete-selected" 
                  onClick={handleBulkDeleteInitiate}
                  disabled={selectedCourses.length === 0}
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Courses;