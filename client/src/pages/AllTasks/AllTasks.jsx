import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Filter, Clock, CheckCircle, BookOpen, Tag, ArrowLeft, Plus, CheckSquare, FileQuestion } from 'lucide-react';
import './AllTasks.css';

const AllTasks = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, completed
    const [sortBy, setSortBy] = useState('deadline'); // deadline, priority
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [selectedType, setSelectedType] = useState('all');

    const [isHovered, setIsHovered] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.token) return;
            try {
                // Fetch Tasks
                const tasksRes = await axios.get('http://localhost:5000/api/tasks', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setTasks(tasksRes.data);

                // Fetch Courses
                const coursesRes = await axios.get('http://localhost:5000/api/courses', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setCourses(coursesRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

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

    const getPriorityColor = (difficulty) => {
        if (difficulty >= 8) return 'priority-high';
        if (difficulty >= 5) return 'priority-med';
        return 'priority-low';
    };

    const toggleTaskStatus = async (e, task) => {
        e.stopPropagation();
        try {
            const newStatus = task.status === 'completed' ? 'pending' : 'completed';
            await axios.put(`http://localhost:5000/api/tasks/${task._id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            // Optimistic update
            setTasks(tasks.map(t =>
                t._id === task._id ? { ...t, status: newStatus } : t
            ));
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    const filteredTasks = tasks
        .filter(task => {
            // Status Filter
            if (filter === 'pending' && task.status === 'completed') return false;
            if (filter === 'completed' && task.status !== 'completed') return false;

            // Course Filter
            if (selectedCourse !== 'all') {
                const taskCourseId = task.course ? task.course._id : null;
                if (taskCourseId !== selectedCourse) return false;
            }

            // Type Filter
            if (selectedType !== 'all') {
                if (task.category !== selectedType) return false;
            }

            return true;
        })
        .sort((a, b) => {
            // First group by status (incomplete first)
            const aComp = a.status === 'completed';
            const bComp = b.status === 'completed';
            if (aComp !== bComp) return aComp ? 1 : -1;

            if (sortBy === 'deadline') {
                return new Date(a.deadline) - new Date(b.deadline);
            } else if (sortBy === 'priority') {
                return b.difficulty - a.difficulty;
            }
            return 0;
        });

    if (loading) return <div className="all-tasks-page-wrapper"><div className="container"><div className="content-limit">Loading...</div></div></div>;

    return (
        <div className="all-tasks-page-wrapper">
            <div className="container">
                <div className="content-limit">
                    {/* Header Section */}
                    <div className="header-section">
                        <div className="header-content">
                            <Link to="/dashboard" className="back-btn">
                                <ArrowLeft size={20}/>
                            </Link>
                            <div className="header-text">
                                <h1>My Tasks</h1>
                                <p>Manage and track all your academic commitments</p>
                            </div>

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
                                <Plus size={28} />
                                </button>

                                {isHovered || isMenuOpen ? (
                                <>
                                    <button
                                    className={`action-btn btn-bottom ${hoveredButton === 2 ? 'is-hovered' : ''}`}
                                    onMouseEnter={() => setHoveredButton(2)}
                                    onClick={() => navigate('/taskpicker')}
                                    >
                                    <CheckSquare size={18} /> Add Task
                                    </button>
                                </>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="thin-line"></div>

                    <div className="tasks-filter-bar">
                        <div className="filter-group">
                            <Filter size={18} color="#aaa" />
                            <select
                                className="filter-select"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">All Tasks</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <Clock size={18} color="#aaa" />
                            <select
                                className="filter-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="deadline">Sort by Deadline</option>
                                <option value="priority">Sort by Difficulty</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <BookOpen size={18} color="#aaa" />
                            <select
                                className="filter-select"
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            >
                                <option value="all">All Courses</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>
                                        {course.courseCode}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <Tag size={18} color="#aaa" />
                            <select
                                className="filter-select"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                {['Exam', 'Assignment', 'Lab Task', 'Presentation', 'Project', 'General'].map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="tasks-grid">
                        {filteredTasks.length === 0 ? (
                            <div className="empty-state">
                                <h3>No tasks found</h3>
                                <p>You're all caught up!</p>
                            </div>
                        ) : (
                            filteredTasks.map(task => (
                                <div
                                    key={task._id}
                                    className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}
                                    onClick={() => navigate(`/tasks/${task._id}`)}
                                >
                                    <div className="task-card-header">
                                        <span className="task-course-badge">
                                            {task.course ? task.course.courseCode : task.category || 'General'}
                                        </span>
                                        <span className={`task-priority-badge ${getPriorityColor(task.difficulty)}`}>
                                            Diff: {task.difficulty}
                                        </span>
                                    </div>

                                    <h3 className="task-card-title">{task.title}</h3>
                                    <p className="task-card-desc">{task.description || 'No description provided.'}</p>

                                    <div className="task-card-footer">
                                        <div className="date-display">
                                            <Calendar size={14} />
                                            <span>
                                                {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No Deadline'}
                                            </span>
                                        </div>

                                        <button
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: task.status === 'completed' ? '#10b981' : 'rgba(255,255,255,0.3)'
                                            }}
                                            onClick={(e) => toggleTaskStatus(e, task)}
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllTasks;
