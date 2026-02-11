import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Filter, Clock, CheckCircle } from 'lucide-react';
import './AllTasks.css';

const AllTasks = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, completed
    const [sortBy, setSortBy] = useState('deadline'); // deadline, priority

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user || !user.token) return;
            try {
                const res = await axios.get('http://localhost:5000/api/tasks', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setTasks(res.data);
            } catch (err) {
                console.error("Error fetching tasks:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [user]);

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
            if (filter === 'pending') return task.status !== 'completed';
            if (filter === 'completed') return task.status === 'completed';
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'deadline') {
                return new Date(a.deadline) - new Date(b.deadline);
            } else if (sortBy === 'priority') {
                return b.difficulty - a.difficulty;
            }
            return 0;
        });

    if (loading) return <div className="all-tasks-container">Loading...</div>;

    return (
        <div className="all-tasks-container">
            <div className="tasks-header">
                <h1>All Tasks</h1>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>Manage and track all your academic commitments</p>
            </div>

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
    );
};

export default AllTasks;
