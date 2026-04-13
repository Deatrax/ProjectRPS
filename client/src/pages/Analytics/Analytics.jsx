import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    TrendingUp, BookOpen, CheckSquare, Clock, 
    AlertCircle, PieChart, BarChart2, ArrowLeft,
    CheckCircle2, ListTodo, Calendar, Timer, 
    Flame, Zap, LayoutGrid, ClipboardList
} from 'lucide-react';
import './Analytics.css';
import Navbar from '../../components/Navbar';

const Analytics = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        highPriorityTasks: 0,
        tasksByCourse: {},
        tasksByCategory: {},
        monthlyCompletion: {},
        yearlyCompletion: {},
        procrastination: {
            lateCompletions: 0,
            onTimeCompletions: 0,
            averageDelayDays: 0,
            mostDelayedTask: null
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.token) return;
            try {
                const [coursesRes, tasksRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/courses', {
                        headers: { Authorization: `Bearer ${user.token}` }
                    }),
                    axios.get('http://localhost:5000/api/tasks', {
                        headers: { Authorization: `Bearer ${user.token}` }
                    })
                ]);

                setCourses(coursesRes.data);
                setTasks(tasksRes.data);
                processStats(coursesRes.data, tasksRes.data);
            } catch (err) {
                console.error("Error fetching analytics data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const processStats = (coursesData, tasksData) => {
        const completed = tasksData.filter(t => t.status === 'completed');
        const pending = tasksData.length - completed.length;
        const highPriority = tasksData.filter(t => t.difficulty >= 8).length;

        // Tasks by Course
        const byCourse = {};
        tasksData.forEach(task => {
            if (task.course) {
                const courseCode = task.course.courseCode || 'Unknown';
                byCourse[courseCode] = (byCourse[courseCode] || 0) + 1;
            }
        });

        // Tasks by Category
        const byCategory = {};
        tasksData.forEach(task => {
            const cat = task.category || 'General';
            byCategory[cat] = (byCategory[cat] || 0) + 1;
        });

        // Monthly & Yearly Tracks
        const monthly = {};
        const yearly = {};
        tasksData.forEach(task => {
            const date = new Date(task.createdAt);
            const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            const year = date.getFullYear().toString();
            
            monthly[monthYear] = (monthly[monthYear] || 0) + 1;
            yearly[year] = (yearly[year] || 0) + 1;
        });

        // Procrastination Tracker
        let late = 0;
        let onTime = 0;
        let totalDelay = 0;
        let worstTask = null;
        let maxDelay = -Infinity;

        completed.forEach(task => {
            if (task.completedAt && task.deadline) {
                const completedDate = new Date(task.completedAt);
                const deadlineDate = new Date(task.deadline);
                
                const delayMs = completedDate - deadlineDate;
                const delayDays = delayMs / (1000 * 60 * 60 * 24);

                if (delayMs > 0) {
                    late++;
                    totalDelay += delayDays;
                    if (delayDays > maxDelay) {
                        maxDelay = delayDays;
                        worstTask = { title: task.title, delay: Math.round(delayDays) };
                    }
                } else {
                    onTime++;
                }
            }
        });

        setStats({
            totalCourses: coursesData.length,
            totalTasks: tasksData.length,
            completedTasks: completed.length,
            pendingTasks: pending,
            highPriorityTasks: highPriority,
            tasksByCourse: byCourse,
            tasksByCategory: byCategory,
            monthlyCompletion: monthly,
            yearlyCompletion: yearly,
            procrastination: {
                lateCompletions: late,
                onTimeCompletions: onTime,
                averageDelayDays: late > 0 ? (totalDelay / late).toFixed(1) : 0,
                mostDelayedTask: worstTask
            }
        });
    };

    if (loading) {
        return (
            <div className="analytics-page-wrapper">
                <div className="container">
                    <div className="content-limit">Loading Analytics...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-page-wrapper">
            <div className="container">
                <div className="content-limit">
                    {/* Header Section */}
                    <div className="header-section">
                        <div className="header-content">
                            <Link to="/dashboard" className="back-btn">
                                <ArrowLeft size={20} />
                            </Link>
                            <div className="header-text">
                                <h1>Academic Analytics</h1>
                                <p>Comprehensive overview of your academic performance and trends</p>
                            </div>
                        </div>
                    </div>

                    <div className="thin-line"></div>

                    {/* Procrastination Alert */}
                    {stats.procrastination.lateCompletions > 0 && (
                        <div className="procrastination-card alert-theme">
                            <div className="alert-header">
                                <Timer className="pulse-icon" />
                                <h3>Procrastination Alert</h3>
                            </div>
                            <div className="alert-content">
                                <p>You have completed <strong>{stats.procrastination.lateCompletions}</strong> tasks late.</p>
                                {stats.procrastination.mostDelayedTask && (
                                    <div className="worst-offender">
                                        <span>Max Delay: </span>
                                        <strong>{stats.procrastination.mostDelayedTask.title}</strong> 
                                        <span className="delay-badge">{stats.procrastination.mostDelayedTask.delay} days late</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Expanded Stats Grid */}
                    <div className="stats-grid expanded-grid">
                        <div className="stat-card">
                            <div className="stat-icon-wrapper courses-bg"><BookOpen size={22} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Courses</span>
                                <h2 className="stat-value">{stats.totalCourses}</h2>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrapper tasks-bg"><ListTodo size={22} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Total Tasks</span>
                                <h2 className="stat-value">{stats.totalTasks}</h2>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrapper completed-bg"><CheckCircle2 size={22} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Finished</span>
                                <h2 className="stat-value">{stats.completedTasks}</h2>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrapper high-priority-bg"><AlertCircle size={22} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Hard Tasks</span>
                                <h2 className="stat-value">{stats.highPriorityTasks}</h2>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrapper on-time-bg"><Zap size={22} /></div>
                            <div className="stat-info">
                                <span className="stat-label">On-Time</span>
                                <h2 className="stat-value">{stats.procrastination.onTimeCompletions}</h2>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrapper avg-delay-bg"><Clock size={22} /></div>
                            <div className="stat-info">
                                <span className="stat-label">Avg Delay</span>
                                <h2 className="stat-value">{stats.procrastination.averageDelayDays}d</h2>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Section Grid */}
                    <div className="analytics-sections">
                        {/* 1. Tasks by Course */}
                        <div className="analytics-section">
                            <div className="section-header">
                                <PieChart size={20} className="icon-blue" />
                                <h2>Tasks by Course</h2>
                            </div>
                            <div className="data-list">
                                {Object.entries(stats.tasksByCourse).length === 0 ? (
                                    <p className="empty-msg">No data</p>
                                ) : (
                                    Object.entries(stats.tasksByCourse).map(([course, count]) => (
                                        <div key={course} className="data-item">
                                            <span className="item-label">{course}</span>
                                            <div className="progress-container">
                                                <div className="progress-bar blue-bar" style={{ width: `${(count / stats.totalTasks) * 100}%` }}></div>
                                            </div>
                                            <span className="item-value">{count}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* 2. Tasks by Category */}
                        <div className="analytics-section">
                            <div className="section-header">
                                <BarChart2 size={20} className="icon-orange" />
                                <h2>Tasks by Category</h2>
                            </div>
                            <div className="data-list">
                                {Object.entries(stats.tasksByCategory).length === 0 ? (
                                    <p className="empty-msg">No data</p>
                                ) : (
                                    Object.entries(stats.tasksByCategory).map(([cat, count]) => (
                                        <div key={cat} className="data-item">
                                            <span className="item-label">{cat}</span>
                                            <div className="progress-container">
                                                <div className="progress-bar orange-bar" style={{ width: `${(count / stats.totalTasks) * 100}%` }}></div>
                                            </div>
                                            <span className="item-value">{count}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* 3. Monthly Activity */}
                        <div className="analytics-section">
                            <div className="section-header">
                                <Calendar size={20} className="icon-purple" />
                                <h2>Monthly Activity</h2>
                            </div>
                            <div className="data-list">
                                {Object.entries(stats.monthlyCompletion).map(([month, count]) => (
                                    <div key={month} className="data-item">
                                        <span className="item-label">{month}</span>
                                        <div className="progress-container">
                                            <div className="progress-bar purple-bar" style={{ width: `${(count / stats.totalTasks) * 100}%` }}></div>
                                        </div>
                                        <span className="item-value">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 4. Yearly Activity */}
                        <div className="analytics-section">
                            <div className="section-header">
                                <TrendingUp size={20} className="icon-green" />
                                <h2>Yearly Track</h2>
                            </div>
                            <div className="data-list">
                                {Object.entries(stats.yearlyCompletion).map(([year, count]) => (
                                    <div key={year} className="data-item">
                                        <span className="item-label">{year}</span>
                                        <div className="progress-container">
                                            <div className="progress-bar green-bar" style={{ width: `${(count / stats.totalTasks) * 100}%` }}></div>
                                        </div>
                                        <span className="item-value">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Final Efficiency Summary */}
                    <div className="completion-summary-card">
                        <div className="summary-content">
                            <div className="completion-info">
                                <h3>Efficiency & Discipline</h3>
                                <p>Your ratio of on-time completions to total finished tasks.</p>
                            </div>
                            <div className="completion-percentage">
                                {stats.completedTasks > 0 
                                    ? Math.round((stats.procrastination.onTimeCompletions / stats.completedTasks) * 100) 
                                    : 0}%
                            </div>
                        </div>
                        <div className="full-progress-bar">
                            <div 
                                className="full-progress-fill efficiency-fill"
                                style={{ width: `${stats.completedTasks > 0 ? (stats.procrastination.onTimeCompletions / stats.completedTasks) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            <Navbar />
        </div>
    );
};

export default Analytics;
