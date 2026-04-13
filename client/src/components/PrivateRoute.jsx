import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import ApologyModal, { hasApologyForToday } from './ApologyModal';

const API = 'http://localhost:5000/api';

const PrivateRoute = () => {
    const { user, loading, logout } = useAuth();

    const [overdueTasks, setOverdueTasks] = useState([]);
    const [apologyDone, setApologyDone] = useState(true); // start true to avoid flash
    const [tasksChecked, setTasksChecked] = useState(false);

    // Automatically log out when the token expires (even if idle)
    useEffect(() => {
        if (user && user.token) {
            try {
                const payload = JSON.parse(atob(user.token.split('.')[1]));
                const expirationTime = payload.exp * 1000;
                const timeRemaining = expirationTime - Date.now();

                if (timeRemaining <= 0) {
                    alert("Session expired. Logging out...");
                    logout();
                    window.location.href = "/"; // Force redirect to root
                } else {
                    // Set a timer to automatically log out when idle
                    const timer = setTimeout(() => {
                        alert("Session expired while idle. Logging out...");
                        logout();
                        window.location.href = "/"; // Force redirect to root
                    }, timeRemaining);

                    return () => clearTimeout(timer); // Cleanup if component unmounts or user changes
                }
            } catch (e) {
                console.error("Token decoding failed:", e);
                logout();
            }
        }
    }, [user, logout]);

    // deny access if not authenticated
    if (!user && !loading) return <Navigate to="/" replace />;

    // Fetch tasks to detect overdue ones (only once, after login)
    useEffect(() => {
        if (!user) return;

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
