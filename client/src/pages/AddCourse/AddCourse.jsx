import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AddCourse.css';

const AddCourse = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!user || !user.token) {
            setError('User not authenticated. Please log in.');
            setLoading(false);
            return;
        }

        if (!name || !code) {
            setError('Course Name and Code are required.');
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post(
                'http://localhost:5000/api/courses',
                { name, code, description },
                config
            );
            navigate('/courses'); 
        } catch (err) {
            console.error('Error adding course:', err);
            setError(err.response?.data?.message || 'Failed to add course.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-course-page">
            <h2>Add New Course</h2>
            <form onSubmit={handleSubmit} className="add-course-form">
                {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    placeholder="Course Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Course Code (e.g., CSE101)"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Course Description (Optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Course'}
                </button>
            </form>
        </div>
    );
};

export default AddCourse;
