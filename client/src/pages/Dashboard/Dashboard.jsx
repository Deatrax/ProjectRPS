import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home, BookOpen, CheckSquare, TrendingUp, Award, Settings, User,
    Plus, Calendar, Clock, Moon, Sun
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // State management
    const [tasks, setTasks] = useState([]);
    const [painScore, setPainScore] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch tasks from API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:5000/api/tasks', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    // Transform data to match UI needs
                    const formattedTasks = data.map(task => ({
                        id: task._id,
                        name: task.title,
                        deadline: task.deadline ? task.deadline.split('T')[0] : '', // Format date string
                        difficulty: task.difficulty,
                        weight: task.weight,
                        course: task.course ? task.course.courseCode : task.category || 'General',
                        courseColor: task.course ? task.course.color : '#6b7280', // Default gray for general
                        completed: task.status === 'completed',
                        createdAt: task.createdAt
                    }));

                    setTasks(formattedTasks);
                    calculatePainScore(formattedTasks);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // Pain Score Formula:
    // (Task Count * Avg Difficulty) + Sum((Weight * Difficulty) / Days Remaining) + Procrastination Score
    const calculatePainScore = (taskList) => {
        const activeTasks = taskList.filter(t => !t.completed);
        if (activeTasks.length === 0) {
            setPainScore(0);
            return;
        }

        const taskCount = activeTasks.length;
        const totalDifficulty = activeTasks.reduce((acc, t) => acc + t.difficulty, 0);
        const avgDifficulty = totalDifficulty / taskCount;

        let weightedSum = 0;
        let procrastinationScore = 0;
        const now = new Date();

        activeTasks.forEach(task => {
            // Calculate days remaining (min 1 to avoid division by zero)
            const deadlineDate = new Date(task.deadline || now);
            const timeDiff = deadlineDate - now;
            const daysRemaining = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24))); // Min 1 day

            // Weighted Component: (Weight * Difficulty) / Days Remaining
            weightedSum += (task.weight * task.difficulty) / daysRemaining;

            // Procrastination Score (Approximation)
            // Logic: If close to deadline (e.g. < 3 days) and difficulty is high, add penalty
            if (daysRemaining <= 3) {
                procrastinationScore += (10 / daysRemaining) * (task.difficulty / 5);
            }
        });

        const score = (taskCount * avgDifficulty) + weightedSum + procrastinationScore;

        // Normalize/Cap score to 100 for display (though it can technically exceed, we cap UI bar)
        setPainScore(Math.round(score));
    };

    // Dock items
    const dockItems = [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: BookOpen, label: 'Courses', path: '/courses/new' },
        { icon: CheckSquare, label: 'All Tasks', path: '/tasks' },
        { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
        { icon: Award, label: 'Achievements', path: '/achievements' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    // Toggle task completion
    const toggleTask = async (taskId, currentStatus) => {
        // Optimistic UI update
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, completed: !currentStatus } : task
        );
        setTasks(updatedTasks);
        calculatePainScore(updatedTasks);

        // API Call
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ completed: !currentStatus })
            });
        } catch (error) {
            console.error("Error updating task:", error);
            // Revert on error (optional, for now simple log)
        }
    };

    // Get timeline data
    const getNotionTimeline = () => {
        const today = new Date();
        const timeline = [];

        for (let i = 0; i < 21; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];

            timeline.push({
                date: dateStr,
                dayNum: date.getDate(),
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                monthName: date.toLocaleDateString('en-US', { month: 'short' }),
                isToday: i === 0,
                isWeekend: date.getDay() === 0 || date.getDay() === 6,
            });
        }

        return timeline;
    };

    const timeline = getNotionTimeline();

    // Get tasks on timeline
    const getTasksOnTimeline = () => {
        const tasksWithPosition = [];

        tasks.filter(t => !t.completed).forEach(task => {
            if (!task.deadline) return;
            const deadlineIndex = timeline.findIndex(day => day.date === task.deadline);
            if (deadlineIndex !== -1) {
                tasksWithPosition.push({
                    ...task,
                    position: deadlineIndex,
                });
            }
        });

        return tasksWithPosition;
    };

    const timelineTasks = getTasksOnTimeline();

    if (loading) {
        return <div className="dashboard-container center-content">Loading your pain...</div>;
    }

    return (
        <div className="dashboard-container" data-theme="dark">
            {/* New Header Section */}
            <header className="dashboard-header">
                <div className="header-title">
                    <h1>RPS Dashboard</h1>
                </div>
                <div className="header-controls">
                    {/* User Badge */}
                    <div className="user-badge">
                        <div className="user-avatar">{user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}</div>
                        <span className="user-name">{user?.name || 'User'}</span>
                    </div>
                </div>
            </header>

            <div className="main-content">
                {/* Hero Status - Notion Style */}
                <div className="hero-section">
                    <div className="pain-score-header">
                        <h2 className="pain-score-value">
                            {painScore}
                        </h2>
                        <span className="pain-score-label">
                            Pain Score
                        </span>
                    </div>

                    <div className="progress-bar-container">
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${Math.min(painScore, 100)}%`,
                                backgroundColor: painScore > 80 ? '#ef4444' : painScore > 50 ? '#f59e0b' : '#10b981'
                            }}
                        ></div>
                    </div>

                    <p className="active-tasks-text">
                        {tasks.filter(t => !t.completed).length} active tasks across your courses
                    </p>
                </div>

                {/* Quick Actions - Minimal Style */}
                <div className="quick-actions">
                    <button className="action-btn primary" onClick={() => navigate('/taskpicker')}>
                        <Plus size={16} />
                        New Task
                    </button>
                    <button className="action-btn secondary" onClick={() => navigate('/courses/new')}>
                        <BookOpen size={16} />
                        Add Course
                    </button>
                    <button className="action-btn secondary">
                        <Calendar size={16} />
                        Calendar
                    </button>
                </div>

                {/* Timeline Section - Notion Style */}
                <div className="timeline-section">
                    <div className="section-header">
                        <Clock size={18} className="text-muted" style={{ color: 'var(--text-muted)' }} />
                        <h3 className="section-title">
                            Timeline
                        </h3>
                        <span className="section-subtitle">• Next 3 weeks</span>
                    </div>

                    <div className="timeline-wrapper">
                        <div className="timeline-scroll-area">
                            <div className="timeline-content" style={{ minWidth: `${timeline.length * 80}px` }}>
                                {/* Timeline Base Line */}
                                <div className="timeline-base-line"></div>

                                {/* Date Markers */}
                                <div className="timeline-grid">
                                    {timeline.map((day, index) => (
                                        <div
                                            key={index}
                                            className="timeline-day"
                                        >
                                            {/* Today indicator */}
                                            {day.isToday && (
                                                <div className="today-indicator"></div>
                                            )}

                                            {/* Date marker */}
                                            <div className="date-marker">
                                                <div className={`marker-dot ${day.isToday ? 'today' : ''}`}></div>

                                                {/* Date label */}
                                                <div className={`date-label ${day.isToday ? 'today' : ''}`}>
                                                    <div className="day-name">
                                                        {day.dayName}
                                                    </div>
                                                    <div className="day-num">
                                                        {day.dayNum}
                                                    </div>
                                                    {(index === 0 || day.dayNum === 1) && (
                                                        <div className="month-name">{day.monthName}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Task Dots */}
                                <div className="timeline-tasks-layer">
                                    {timelineTasks.map((task, idx) => {
                                        const leftPosition = task.position * 80 + 30; // Center in 80px column (roughly)
                                        const sameDateTasks = timelineTasks.filter(t => t.position === task.position);
                                        const taskIndex = sameDateTasks.findIndex(t => t.id === task.id);
                                        // Increased spacing to 28px for better visual stacking
                                        const verticalOffset = taskIndex * 28;

                                        return (
                                            <div
                                                key={task.id}
                                                className="timeline-task-marker"
                                                style={{
                                                    left: `${leftPosition}px`,
                                                    top: `${verticalOffset}px`
                                                }}
                                            >
                                                {/* Connection line */}
                                                <div className="task-connection-line"
                                                    style={{ height: `${9 + (verticalOffset / 16)}rem` }}
                                                ></div>

                                                {/* Dot */}
                                                <div
                                                    className="task-dot"
                                                    style={{
                                                        backgroundColor: task.courseColor,
                                                    }}
                                                >
                                                    <div
                                                        className="task-ping"
                                                        style={{ backgroundColor: task.courseColor }}
                                                    ></div>
                                                </div>

                                                {/* Hover Card */}
                                                <div className="task-hover-card">
                                                    <div className="card-content">
                                                        {/* Arrow (optional, handled by CSS placement mostly) */}
                                                        {/* <div className="card-arrow"></div> */}

                                                        <div className="card-body">
                                                            <div
                                                                className="course-stripe"
                                                                style={{ backgroundColor: task.courseColor }}
                                                            ></div>
                                                            <div className="card-details">
                                                                <div className="card-course">
                                                                    {task.course}
                                                                </div>
                                                                <div className="card-title">
                                                                    {task.name}
                                                                </div>
                                                                <div className="card-meta">
                                                                    <div className="meta-item">
                                                                        <span className="meta-label">Diff:</span>
                                                                        <span className="meta-value">{task.difficulty}/10</span>
                                                                    </div>
                                                                    <div className="meta-item">
                                                                        <span className="meta-label">Weight:</span>
                                                                        <span className="meta-value">{task.weight}%</span>
                                                                    </div>
                                                                </div>
                                                                <div className="card-date">
                                                                    {new Date(task.deadline).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tasks List - Notion Style */}
                <div>
                    <div className="section-header">
                        <CheckSquare size={18} className="text-muted" style={{ color: 'var(--text-muted)' }} />
                        <h3 className="section-title">
                            Tasks
                        </h3>
                        <span className="section-subtitle">• Sorted by priority</span>
                    </div>

                    <div className="task-list">
                        {tasks.slice(0, 10).map((task, index) => (
                            <div
                                key={task.id}
                                className={`task-item ${task.completed ? 'completed' : ''}`}
                                onClick={() => navigate(`/tasks/${task.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        toggleTask(task.id, task.completed);
                                    }}
                                    className="task-checkbox"
                                />

                                {/* Course Color */}
                                <div
                                    className="task-course-dot"
                                    style={{ backgroundColor: task.courseColor }}
                                ></div>

                                {/* Task Info */}
                                <div className="task-content">
                                    <div className="task-title">
                                        {task.name}
                                    </div>
                                    <div className="task-subtitle">
                                        <span>{task.course}</span>
                                        <span>•</span>
                                        <span>{task.deadline}</span>
                                    </div>
                                </div>

                                {/* Stats - Minimal */}
                                <div className="task-stats">
                                    <div className="meta-item">
                                        <span className="meta-label">Diff</span>
                                        <span className="meta-value">{task.difficulty}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label">Wt</span>
                                        <span className="meta-value">{task.weight}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {tasks.length === 0 && (
                            <div className="empty-state">
                                No tasks found. Create one to get started!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Notification-style Bottom Navbar (Notch) */}
            <div className="notch-navbar-container">
                <nav className="notch-navbar">
                    {dockItems.map((item, index) => (
                        <BottomNavItem key={index} {...item} />
                    ))}
                </nav>
            </div>
        </div>
    );
};

// Bottom Nav Item
const BottomNavItem = ({ icon: Icon, label, path }) => {
    const navigate = useNavigate();
    // Basic active state simulation (in real app, use useLocation)
    const isActive = window.location.pathname === path;

    return (
        <button
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(path)}
        >
            <div className="nav-item-icon">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
        </button>
    );
};

export default Dashboard;