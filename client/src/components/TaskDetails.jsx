import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, BarChart2, Tag, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './TaskDetails.css';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchTask = async () => {
            if (!user || !user.token) return;

            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const res = await fetch(`http://localhost:5000/api/tasks/${id}`, config);
                if (!res.ok) throw new Error('Failed to fetch task');

                const data = await res.json();
                setTask(data);
            } catch (err) {
                console.error("Error fetching task:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id, user]);

    if (loading) return (
        <div className="task-details-page-wrapper">
            <div className="container">
                <div className="content-limit">
                    <div className="loading-state">Loading task details...</div>
                </div>
            </div>
        </div>
    );

    if (!task) return (
        <div className="task-details-page-wrapper">
            <div className="container">
                <div className="content-limit">
                    <div className="error-state">Task not found</div>
                </div>
            </div>
        </div>
    );

    const formatDate = (date) => {
        if (!date) return 'No Date';
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDifficultyColor = (difficulty) => {
        if (difficulty >= 8) return '#ef4444'; // Red
        if (difficulty >= 5) return '#f59e0b'; // Amber
        return '#10b981'; // Green
    };

    return (
        <div className="task-details-page-wrapper">
            <div className="container">
                <div className="content-limit">
                    {/* Header Section */}
                    <div className="header-section">
                        <div className="header-content">
                            <Link to="/tasks" className="back-btn">
                                <ArrowLeft size={20} />
                            </Link>
                            <div className="header-text">
                                <h1>Task Details</h1>
                                <p>{task.course ? `${task.course.courseCode} • ${task.course.courseTitle}` : task.category || 'General Task'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="thin-line"></div>

                    <div className="task-details-grid">
                        {/* Main Info Card */}
                        <div className="detail-main-card">
                            <div className="card-header-row">
                                <h2 className="detail-title">{task.title}</h2>
                                <span className={`status-badge ${task.status === 'completed' ? 'completed' : 'pending'}`}>
                                    {task.status === 'completed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                    {task.status || 'Pending'}
                                </span>
                            </div>

                            <div className="detail-description">
                                <h3>Description</h3>
                                <p>{task.description || 'No description provided for this task.'}</p>
                            </div>

                            <div className="detail-meta-grid">
                                <div className="meta-item">
                                    <Calendar className="meta-icon" size={20} />
                                    <div className="meta-info">
                                        <span className="meta-label">Deadline</span>
                                        <span className="meta-value">{formatDate(task.deadline || task.date)}</span>
                                    </div>
                                </div>

                                <div className="meta-item">
                                    <Tag className="meta-icon" size={20} />
                                    <div className="meta-info">
                                        <span className="meta-label">Category</span>
                                        <span className="meta-value">{task.category || 'General'}</span>
                                    </div>
                                </div>

                                <div className="meta-item">
                                    <BarChart2 className="meta-icon" size={20} />
                                    <div className="meta-info">
                                        <span className="meta-label">Difficulty</span>
                                        <span className="meta-value" style={{ color: getDifficultyColor(task.difficulty) }}>
                                            {task.difficulty}/10
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Cards */}
                        <div className="detail-sidebar">
                            <div className="sidebar-card priority-card" style={{ borderColor: getDifficultyColor(task.difficulty) }}>
                                <h3>Task Priority</h3>
                                <div className="difficulty-meter">
                                    <div className="meter-bg">
                                        <div 
                                            className="meter-fill" 
                                            style={{ 
                                                width: `${task.difficulty * 10}%`,
                                                background: getDifficultyColor(task.difficulty)
                                            }}
                                        ></div>
                                    </div>
                                    <span>{task.difficulty >= 8 ? 'High Priority' : task.difficulty >= 5 ? 'Medium Priority' : 'Low Priority'}</span>
                                </div>
                            </div>

                            {task.materials && (
                                <div className="sidebar-card materials-card">
                                    <h3>Resources</h3>
                                    <a href={task.materials} target="_blank" rel="noopener noreferrer" className="resource-link">
                                        <FileText size={18} />
                                        <span>View Materials</span>
                                    </a>
                                </div>
                            )}

                            <div className="sidebar-card info-card">
                                <h3>Quick Info</h3>
                                <div className="info-row">
                                    <span>Created</span>
                                    <span>{new Date(task.createdAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                                {task.weight && (
                                    <div className="info-row">
                                        <span>Weight</span>
                                        <span>{task.weight}%</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
