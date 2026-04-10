import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, CheckSquare,
    Plus, Calendar, Clock, Timer
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PomodoroWidget, { timeAgo } from '../../components/PomodoroWidget';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // State management
    const [tasks, setTasks] = useState([]);
    const [painScore, setPainScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [multiplier, setMultiplier] = useState(1.0);
    const [dramaMsg, setDramaMsg] = useState(0);
    const [dramaFade, setDramaFade] = useState(false);

    // Mode Configuration
    const getModeConfig = (score) => {
        if (score >= 80) return { mode: 'Doom', color: '#ef4444', class: 'mode-doom' }; // Red
        if (score >= 60) return { mode: 'Panic', color: '#f97316', class: 'mode-panic' }; // Orange
        if (score >= 30) return { mode: 'Grind', color: '#f59e0b', class: 'mode-grind' }; // Amber/Yellow
        return { mode: 'Relaxed', color: '#10b981', class: 'mode-relaxed' }; // Green/Teal
    };

    const currentMode = getModeConfig(painScore);

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
                        _id: task._id,
                        name: task.title,
                        deadline: task.deadline ? task.deadline.split('T')[0] : '',
                        difficulty: task.difficulty,
                        weight: task.weight,
                        course: task.course ? task.course.courseCode : task.category || 'General',
                        courseColor: task.course ? task.course.color : '#6b7280',
                        completed: task.status === 'completed',
                        overdue: task.status === 'overdue',
                        status: task.status,
                        lastAttemptedAt: task.lastAttemptedAt || null,
                        pomoDraftSeconds: task.pomoDraftSeconds || null,
                        pomoPlannedSeconds: task.pomoPlannedSeconds || null,
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

    // Fetch speed multiplier for the widget
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:5000/api/pomodoro/speed-multiplier', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => setMultiplier(d.multiplier ?? 1.0))
            .catch(() => { });
    }, []);

    // Dramatic cycling banner
    const DRAMA = [
        '"Your task weeps in your absence…"',
        '"The database is disappointed in you."',
        '"Time waits for no one. Especially not you."',
        '"Your future self is filing a complaint."',
        '"Even the compiler gave up on you."',
    ];
    const overdueCount = tasks.filter(t => t.overdue).length;
    useEffect(() => {
        if (overdueCount === 0) return;
        const id = setInterval(() => {
            setDramaFade(true);
            setTimeout(() => {
                setDramaMsg(i => (i + 1) % DRAMA.length);
                setDramaFade(false);
            }, 500);
        }, 8000);
        return () => clearInterval(id);
    }, [overdueCount]); // eslint-disable-line react-hooks/exhaustive-deps


    //Pain score formula
    const calculatePainScore = (taskList) => {
        const activeTasks = taskList.filter(t => !t.completed);

        if (activeTasks.length === 0) {
            setPainScore(0);
            return;
        }

        const MAX_DIFFICULTY = 5;
        const REFERENCE_TASK_COUNT = 10;

        const taskCount = activeTasks.length;

        let totalDifficulty = 0;
        let urgencySum = 0;
        let procrastinationSum = 0;

        const now = new Date();

        activeTasks.forEach(task => {

            const difficultyNorm = (task.difficulty || 1) / MAX_DIFFICULTY;
            const weightNorm = (task.weight || 1) / 100;

            totalDifficulty += difficultyNorm;

            const deadlineDate = new Date(task.deadline || now);
            const timeDiff = deadlineDate - now;
            const daysRemaining = Math.max(
                1,
                Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
            );

            // Softer urgency growth
            const urgency =
                difficultyNorm *
                weightNorm *
                (1 / Math.sqrt(daysRemaining));

            urgencySum += urgency;

            // Panic boost when very close
            if (daysRemaining <= 2) {
                const procrastination =
                    difficultyNorm *
                    weightNorm *
                    (1 / Math.sqrt(daysRemaining));

                procrastinationSum += procrastination;
            }
        });

        const avgDifficulty = totalDifficulty / taskCount;
        const avgUrgency = urgencySum / taskCount;
        const avgProcrastination = procrastinationSum / taskCount;

        // Workload grows slowly with more tasks
        const workloadPressure =
            Math.log(taskCount + 1) /
            Math.log(REFERENCE_TASK_COUNT + 1);

        const combined =
            (0.30 * avgDifficulty)
            + (0.35 * avgUrgency)
            + (0.25 * workloadPressure)
            + (0.10 * avgProcrastination);

        // Compression curve so 100 is rare
        let finalScore = Math.pow(combined, 0.8) * 100;

        finalScore = Math.round(finalScore);
        finalScore = Math.min(100, Math.max(1, finalScore));

        setPainScore(finalScore);
    };

    // Toggle task completion
    const toggleTask = async (taskId, currentStatus) => {

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
        <div className={`dashboard-container ${currentMode.class}`} data-theme="dark">
            {/* New Header Section */}
            <header className="dashboard-header">
                <div className="header-title">
                    <h1>RPS Dashboard</h1>
                    <span className="mode-badge" style={{ backgroundColor: currentMode.color }}>
                        {currentMode.mode} Mode
                    </span>
                </div>
                <div className="header-controls">
                    {/* User Badge */}
                    <div className="user-badge">
                        <div className="user-avatar">{user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}</div>
                        <span className="user-name">{user?.name || 'User'}</span>
                    </div>
                </div>
            </header>

            {/* Dramatic Alert Banner — visible when overdue tasks exist */}
            {overdueCount > 0 && (
                <div className="drama-banner" style={{ opacity: dramaFade ? 0 : 1 }}>
                    <span className="drama-icon">⚠️</span>
                    <span className="drama-text">{DRAMA[dramaMsg]}</span>
                    <span className="drama-count">{overdueCount} overdue task{overdueCount !== 1 ? 's' : ''}</span>
                </div>
            )}

            <div className="main-content">
                {/* Hero Status - Notion Style */}
                <div className="hero-section">
                    <div className="pain-score-header">
                        <h2 className="pain-score-value" style={{ color: currentMode.color }}>
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
                                backgroundColor: currentMode.color
                            }}
                        ></div>
                    </div>

                    <p className="active-tasks-text">
                        {tasks.filter(t => !t.completed).length} active tasks across your courses
                    </p>
                </div>

                {/* Pomodoro Widget */}
                <PomodoroWidget
                    tasks={tasks.filter(t => !t.completed)}
                    multiplier={multiplier}
                />

                {/* Quick Actions - Minimal Style */}
                <div className="quick-actions">
                    <button className="action-btn primary" onClick={() => navigate('/taskpicker')}>
                        <Plus size={16} />
                        New Task
                    </button>
                    <button className="action-btn secondary" onClick={() => console.log('Calendar clicked')}>
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
                                className={`task-item ${task.completed ? 'completed' : ''
                                    } ${task.overdue ? 'overdue' : ''
                                    }`}
                                onClick={() => navigate(`/tasks/${task.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTask(task.id, task.completed)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="task-checkbox"
                                />

                                {/* Course Color */}
                                <div
                                    className="task-course-dot"
                                    style={{ backgroundColor: task.overdue ? '#ef4444' : task.courseColor }}
                                ></div>

                                {/* Task Info */}
                                <div className="task-content">
                                    <div className="task-title">
                                        {task.overdue && <span className="overdue-badge">🔴 Overdue</span>}
                                        {task.name}
                                    </div>
                                    <div className="task-subtitle">
                                        <span>{task.course}</span>
                                        <span>•</span>
                                        <span>{task.deadline}</span>
                                        <span>•</span>
                                        <span className="last-attempted">
                                            {timeAgo(task.lastAttemptedAt)}
                                        </span>
                                        {task.pomoDraftSeconds && (
                                            <>
                                                <span>•</span>
                                                <span className="draft-chip-sm">💾 Draft</span>
                                            </>
                                        )}
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

        </div>
    );
};



export default Dashboard;