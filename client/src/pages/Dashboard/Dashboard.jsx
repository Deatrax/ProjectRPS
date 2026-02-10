import React, { useState, useEffect } from 'react';
import {
    Home, BookOpen, CheckSquare, TrendingUp, Award, Settings, User,
    Plus, Calendar, Clock, Moon, Sun
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    // State management
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [painScore, setPainScore] = useState(45);
    const [tasks, setTasks] = useState([
        { id: 1, name: 'Database Lab Report', deadline: '2026-02-10', difficulty: 8, weight: 15, course: 'CSE 4541', courseColor: '#3b82f6', completed: false },
        { id: 2, name: 'Web Programming Midterm Prep', deadline: '2026-02-12', difficulty: 7, weight: 20, course: 'CSE 4540', courseColor: '#8b5cf6', completed: false },
        { id: 3, name: 'Algorithm Assignment 3', deadline: '2026-02-09', difficulty: 9, weight: 10, course: 'CSE 3501', courseColor: '#06b6d4', completed: false },
        { id: 4, name: 'Software Engineering UML Diagrams', deadline: '2026-02-14', difficulty: 5, weight: 8, course: 'CSE 4503', courseColor: '#10b981', completed: false },
        { id: 5, name: 'Computer Networks Quiz Study', deadline: '2026-02-11', difficulty: 6, weight: 5, course: 'CSE 4561', courseColor: '#f59e0b', completed: false },
        { id: 6, name: 'Machine Learning Lab 4', deadline: '2026-02-15', difficulty: 8, weight: 12, course: 'CSE 4643', courseColor: '#ec4899', completed: false },
        { id: 7, name: 'Read Chapter 8 - OS Concepts', deadline: '2026-02-13', difficulty: 4, weight: 3, course: 'CSE 4521', courseColor: '#6366f1', completed: false },
        { id: 8, name: 'Project Proposal Presentation', deadline: '2026-02-18', difficulty: 7, weight: 15, course: 'CSE 4540', courseColor: '#8b5cf6', completed: false },
        { id: 9, name: 'Compiler Design Assignment', deadline: '2026-02-16', difficulty: 9, weight: 12, course: 'CSE 4641', courseColor: '#14b8a6', completed: false },
        { id: 10, name: 'Weekly Problem Set', deadline: '2026-02-10', difficulty: 5, weight: 5, course: 'CSE 3501', courseColor: '#06b6d4', completed: false },
    ]);

    // Dock items
    const dockItems = [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: BookOpen, label: 'Courses', path: '/courses' },
        { icon: CheckSquare, label: 'All Tasks', path: '/tasks' },
        { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
        { icon: Award, label: 'Achievements', path: '/achievements' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    // Toggle task completion
    const toggleTask = (taskId) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
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
                        <div className="user-avatar">SM</div>
                        <span className="user-name">Sadman</span>
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
                            style={{ width: `${painScore}%` }}
                        ></div>
                    </div>

                    <p className="active-tasks-text">
                        {tasks.filter(t => !t.completed).length} active tasks across your courses
                    </p>
                </div>

                {/* Quick Actions - Minimal Style */}
                <div className="quick-actions">
                    <button className="action-btn primary">
                        <Plus size={16} />
                        New Task
                    </button>
                    <button className="action-btn secondary">
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
                                onClick={() => window.location.href = `/tasks/${task.id}`}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        toggleTask(task.id);
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
    // Basic active state simulation (in real app, use useLocation)
    const isActive = path === '/';

    return (
        <button className={`nav-item ${isActive ? 'active' : ''}`}>
            <div className="nav-item-icon">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            {/* Optional label if space permits, or just icon for cleanliness 
            <span className="nav-label">{label}</span>
            */}
        </button>
    );
};

export default Dashboard;