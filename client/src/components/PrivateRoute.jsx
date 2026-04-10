import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import ApologyModal, { hasApologyForToday } from './ApologyModal';

const API = 'http://localhost:5000/api';

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    const [overdueTasks, setOverdueTasks] = useState([]);
    const [apologyDone, setApologyDone] = useState(true); // start true to avoid flash
    const [tasksChecked, setTasksChecked] = useState(false);

    // deny access if not authenticated
    if (!user) return <Navigate to="/" replace />;

    // Fetch tasks to detect overdue ones (only once, after login)
    useEffect(() => {
        if (!user) return <Navigate to="/" replace />;

        // Check localStorage first — if already apologised today, skip fetch
        if (hasApologyForToday()) {
            setApologyDone(true);
            setTasksChecked(true);
            return;
        }

        const token = localStorage.getItem('token');
        fetch(`${API}/tasks`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                const overdue = Array.isArray(data)
                    ? data
                        .filter(t => t.status === 'overdue')
                        .map(t => ({ id: t._id, name: t.title }))
                    : [];
                setOverdueTasks(overdue);
                setApologyDone(overdue.length === 0); // no overdue = no shame needed
            })
            .catch(() => setApologyDone(true)) // on error, don't block user
            .finally(() => setTasksChecked(true));
    }, [user]);

    if (loading || !tasksChecked) {
        return <div style={{ color: 'rgba(255,255,255,0.5)', padding: '2rem', textAlign: 'center' }}>Loading…</div>;
    }

    if (!user) return <Navigate to="/" />;

    const navbarLocked = !apologyDone;

    return (
        <>
            {/* Shame modal — renders on top of everything. Navbar is visually locked. */}
            {!apologyDone && (
                <ApologyModal
                    overdueTasks={overdueTasks}
                    onDismiss={() => setApologyDone(true)}
                />
            )}

            <Outlet />

            {/* Navbar — pointer-events disabled while modal is active */}
            <div className={navbarLocked ? 'navbar-locked' : ''}>
                <Navbar />
            </div>
        </>
    );
};

export default PrivateRoute;
