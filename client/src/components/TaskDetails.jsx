import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, BarChart2, Tag } from 'lucide-react';
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

                // If course is populated, use its title, otherwise use placeholder or ID
                // Note: The backend Task model might need to populate 'course' to get the title.
                // For now, we'll assuming it might be an ID or we need to fetch it.
                // Let's check if the backend populates it. The current backend GET /:id does not populate 'course'.
                // I will update it to populate or just show "Course Info" for now to avoid breaking if not populated.
                // Actually, let's just use the data as is.
                setTask(data);
            } catch (err) {
                console.error("Error fetching task:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id, user]);

    if (!task) return <div className="loading-spinner">Loading...</div>;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="task-details-container">
            <div className="tasks-header">
                <div className="tasks-title-group">
                    <button onClick={() => navigate(-1)} className="back-btn">
                        <ArrowLeft size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Back
                    </button>
                    <h1 className="tasks-title" style={{ marginTop: '20px' }}>{task.title}</h1>
                    <div className="tasks-meta">
                        <div className="meta-tag">
                            <Calendar size={14} />
                            {formatDate(task.date)}
                        </div>
                        <div className="meta-tag">
                            <Tag size={14} />
                            {task.category}
                        </div>
                        <div className="meta-tag" style={{ color: '#a5b4fc', borderColor: '#a5b4fc' }}>
                            {task.course ? (task.course.courseCode || 'Course Info') : 'No Course'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card">
                <div className="description-section">
                    <span className="section-label">Description</span>
                    <p className="description-text">
                        {task.description}
                    </p>
                </div>

                <div className="details-grid">
                    <div className="detail-item">
                        <span className="section-label" style={{ marginBottom: '5px' }}>Difficulty</span>
                        <div className="detail-value">{task.difficulty}/10</div>
                        <div className="difficulty-bar">
                            <div
                                className="difficulty-fill"
                                style={{ width: `${task.difficulty * 10}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="detail-item">
                        <span className="section-label" style={{ marginBottom: '5px' }}>Weight</span>
                        <div className="detail-value">15%</div>
                        <div className="section-label" style={{ fontSize: '0.7rem', marginTop: '5px', opacity: 0.7 }}>of Final Grade</div>
                    </div>

                    <div className="detail-item">
                        <span className="section-label" style={{ marginBottom: '5px' }}>Status</span>
                        <div className="detail-value" style={{ color: '#fbbf24' }}>In Progress</div>
                    </div>
                </div>

                {task.materials && (
                    <div className="materials-section">
                        <span className="section-label">Resources</span>
                        <br />
                        <a href={task.materials} target="_blank" rel="noopener noreferrer" className="material-link">
                            <FileText size={18} />
                            View Attached Materials
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetails;
