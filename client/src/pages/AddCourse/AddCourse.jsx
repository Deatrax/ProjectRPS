import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import './AddCourse.css';

const AddCourse = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        courseTitle: '',
        courseCode: '',
        semester: 'Spring 2026',
        color: '#3b82f6'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const colors = [
        '#3b82f6', // Blue
        '#6366f1', // Indigo
        '#8b5cf6', // Violet
        '#ec4899', // Pink
        '#ef4444', // Red
        '#f59e0b', // Amber
        '#10b981', // Emerald
        '#06b6d4', // Cyan
        '#14b8a6', // Teal
        '#64748b', // Slate
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleColorSelect = (color) => {
        setFormData({ ...formData, color });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token'); // Assuming token is stored here
            if (!token) {
                // If using Context, might need to get token from there, but for now try localStorage
                // Or assume AuthContext handles it. Let's try fetching with header.
                console.error("No token found");
                setError("You must be logged in to add a course.");
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create course');
            }

            // Success
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-course-container">
            <div className="add-course-header">
                <Link to="/dashboard" className="back-btn">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="page-title">Add New Course</h1>
            </div>

            <div className="add-course-form-card">
                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Course Title</label>
                        <input
                            type="text"
                            name="courseTitle"
                            className="form-input"
                            placeholder="e.g. Web Programming"
                            value={formData.courseTitle}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Course Code</label>
                        <input
                            type="text"
                            name="courseCode"
                            className="form-input"
                            placeholder="e.g. CSE 4540"
                            value={formData.courseCode}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Semester</label>
                        <select
                            name="semester"
                            className="form-input"
                            value={formData.semester}
                            onChange={handleChange}
                        >
                            <option value="Spring 2026">Spring 2026</option>
                            <option value="Fall 2025">Fall 2025</option>
                            <option value="Summer 2026">Summer 2026</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Course Color</label>
                        <div className="color-options">
                            {colors.map((c) => (
                                <div
                                    key={c}
                                    className={`color-option ${formData.color === c ? 'selected' : ''}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => handleColorSelect(c)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <Link to="/dashboard" className="btn-secondary">
                            Cancel
                        </Link>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCourse;
