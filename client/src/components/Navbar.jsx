import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home, BookOpen, CheckSquare, TrendingUp, Award, Settings
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Dock items configuration
    const dockItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: BookOpen, label: 'Courses', path: '/courses' },
        { icon: CheckSquare, label: 'All Tasks', path: '/taskpicker' },
        { icon: TrendingUp, label: 'Analytics', path: '/dashboard' }, // Placeholder paths as in original
        { icon: Award, label: 'Achievements', path: '/dashboard' },   // Placeholder paths as in original
        { icon: Settings, label: 'Settings', path: '/dashboard' },    // Placeholder paths as in original
    ];

    // Determine active color based on some global state or default
    // For now, we can use a default accent color, or maybe pass it as a prop if we want dynamic coloring.
    // If the requirement is "universal", sticking to a theme color or allowing context overrides is best.
    // Let's us a default blue accent for now.
    const defaultColor = '#3b82f6';

    // If you wanted to support the dynamic "Pain Score" color globally, you would need a Context.
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
const BottomNavItem = ({ icon: Icon, label, path, isActive, activeColor }) => {
    const navigate = useNavigate();

    return (
        <div className="nav-item-wrapper group">
            <button
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(path)}
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
