import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home, BookOpen, CheckSquare, TrendingUp, Timer, LogOut, UserCircle, Award, Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Dock items configuration
    const dockItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: BookOpen, label: 'Courses', path: '/courses' },
        { icon: CheckSquare, label: 'All Tasks', path: '/tasks' },
        { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
        { icon: Timer, label: 'Pomodoro', path: '/pomodoro' },
        { icon: Award, label: 'Achievements', path: '/achievements' },   // Updated path
        // { icon: Settings, label: 'Settings', path: '/dashboard' }, // Placeholder paths as in original
        { icon: UserCircle, label: 'Profile', path: '/profile' },
        { icon: LogOut, label: 'Logout', action: handleLogout },
    ];

    // Determine active color based on some global state or default
    // For now we  use  default accent color or maybe pass it as a prop coz we want dynamic coloring.
    // If the requirement is "universal" sticking to a theme color or allowing context overrides is best.
    // Let's us a default blue accent for now.
    const defaultColor = '#3b82f6';

    //  to support the dynamic "Pain Score" color globally, we need a Context.
    // Assuming for now we want a consistent look or a default look for pages outside Dashboard.

    return (
        <div className="notch-navbar-container">
            <nav className="notch-navbar" style={{
                borderTop: `2px solid ${defaultColor}`,
                boxShadow: `0 -4px 20px -5px ${defaultColor}40`
            }}>
                {dockItems.map((item, index) => (
                    <BottomNavItem
                        key={index}
                        {...item}
                        isActive={location.pathname === item.path}
                        activeColor={defaultColor}
                    />
                ))}
            </nav>
        </div>
    );
};

// Bottom Nav Item Helper Component
const BottomNavItem = ({ icon: Icon, label, path, action, isActive, activeColor }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (action) {
            action();
        } else if (path) {
            navigate(path);
        }
    };

    return (
        <div className="nav-item-wrapper group">
            <button
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={handleClick}
                style={isActive ? { color: activeColor } : {}}
            >
                <div className="nav-item-icon">
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
            </button>
            <span className="nav-tooltip">
                {label}
            </span>
        </div>
    );
};

export default Navbar;
