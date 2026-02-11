import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    return user ? (
        <>
            <Outlet />
            <Navbar />
        </>
    ) : <Navigate to="/login" />;
};

export default PrivateRoute;
