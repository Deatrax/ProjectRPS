import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './CourseDetails.css'; // Make sure your CSS file is imported here

const CourseDetails = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('id');
    const { user } = useAuth();

    // State for the active tab ('tasks' or 'materials')
    const [activeTab, setActiveTab] = useState('tasks');
    const [course, setCourse] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.token || !courseId) return;

            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };

                // Fetch Course Details
                const courseRes = await axios.get(`http://localhost:5000/api/courses/${courseId}`, config);
                setCourse(courseRes.data);

                // Fetch Tasks for this Course
                const tasksRes = await axios.get(`http://localhost:5000/api/tasks/course/${courseId}`, config);
                // Map backend tasks to frontend structure
                const formattedTasks = tasksRes.data.map(t => ({
                    id: t._id,
                    text: t.title,
                    completed: false, // Defaulting to false as 'completed' field is not in Task model yet
                    type: t.category
                }));
                setTasks(formattedTasks);

            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, courseId]);

    // Function to toggle task completion status (Frontend only for now)
    const toggleTask = (id) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (!course) return <div className="error-message">Course not found.</div>;

    return (
        <div className="course-details-root">
            <div className="picker-container">

                <div className="header-section">
                    <div className="header-content">
                        <div className="header-text">
                            <h1 className="header-title">{course.courseTitle}</h1>
                            <p className="header-description">{course.courseCode} - {course.semester}</p>
                        </div>
                    </div>
                </div>

                <div className="thin-line"></div>

                <div className="stats-container">
                    <div className="stats-box">
                        <h3>Total Tasks</h3>
                        <p>{tasks.length}</p>
                    </div>
                    <div className="stats-box">
                        <h3>Course progress</h3>
                        <p>0%</p>
                    </div>
                    <div className="stats-box">
                        <h3>Pain Points</h3>
                        <p>5</p>
                    </div>
                    <div className="stats-box">
                        <h3>Nearest Deadline Deadlines</h3>
                        <p>3</p>
                    </div>
                </div>

                {/* Main Glassmorphic Box */}
                <div className="glass-panel">

                    {/* Toggle Switch */}
                    <div className="toggle-container">
                        <button
                            id="btn-tasks"
                            className={`toggle-btn ${activeTab === 'tasks' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tasks')}
                        >
                            Tasks
                        </button>
                        <button
                            id="btn-materials"
                            className={`toggle-btn ${activeTab === 'materials' ? 'active' : ''}`}
                            onClick={() => setActiveTab('materials')}
                        >
                            Course Materials
                        </button>

                        {/* Animated sliding background */}
                        <div
                            id="toggle-slider"
                            className={`toggle-slider ${activeTab === 'materials' ? 'slide-right' : ''}`}
                        ></div>
                    </div>

                    {/* Content Area */}
                    <div className="panel-content">

                        {/* 1. TASKS LIST SECTION */}
                        {activeTab === 'tasks' && (
                            <div id="tasks-section" className="list-container" style={{ display: 'flex' }}>

                                {tasks.length === 0 ? (
                                    <p style={{ color: 'white', opacity: 0.7, textAlign: 'center', width: '100%', marginTop: '20px' }}>No tasks found for this course.</p>
                                ) : (
                                    tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className={`list-item task-item ${task.completed ? 'is-completed' : ''}`}
                                            onClick={() => navigate(`/tasks/${task.id}`)}
                                        >
                                            <div
                                                className="custom-checkbox"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleTask(task.id);
                                                }}
                                            >
                                                <svg viewBox="0 0 24 24" className="check-icon">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                            <span className="item-text">{task.text}</span>
                                        </div>
                                    ))
                                )}

                            </div>
                        )}

                        {/* 2. MATERIALS LIST SECTION */}
                        {activeTab === 'materials' && (
                            <div id="materials-section" className="list-container" style={{ display: 'flex' }}>

                                {/* Material 1 */}
                                <div className="list-item material-item">
                                    <div className="file-icon pdf">PDF</div>
                                    <div className="material-info">
                                        <span className="item-text">Lecture 1 Slides</span>
                                        <span className="item-subtext">2.4 MB</span>
                                    </div>
                                    <button className="download-btn">↓</button>
                                </div>

                                {/* Material 2 */}
                                <div className="list-item material-item">
                                    <div className="file-icon doc">DOC</div>
                                    <div className="material-info">
                                        <span className="item-text">React Hooks Cheat Sheet</span>
                                        <span className="item-subtext">1.1 MB</span>
                                    </div>
                                    <button className="download-btn">↓</button>
                                </div>

                                {/* Material 3 */}
                                <div className="list-item material-item">
                                    <div className="file-icon pdf">PDF</div>
                                    <div className="material-info">
                                        <span className="item-text">Project Guidelines</span>
                                        <span className="item-subtext">500 KB</span>
                                    </div>
                                    <button className="download-btn">↓</button>
                                </div>

                                {/* Material 4 */}
                                <div className="list-item material-item">
                                    <div className="file-icon zip">ZIP</div>
                                    <div className="material-info">
                                        <span className="item-text">Source Code - Demo</span>
                                        <span className="item-subtext">12 MB</span>
                                    </div>
                                    <button className="download-btn">↓</button>
                                </div>

                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;