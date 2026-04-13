import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, BookOpen, CheckSquare, Clock, AlertTriangle,
    BarChart2, Mail, Calendar, Zap, ArrowLeft,
    Award, Star, Flame, Trophy, Target, Shield, Crown, Moon, Layers, AlertCircle, ShieldAlert
} from 'lucide-react';
import './Profile.css';
import achievementService from '../../services/achievementService';

const API = 'http://localhost:5000/api';

const iconMap = {
    Target,
    Zap,
    Flame,
    Trophy,
    Shield,
    Crown,
    Clock,
    Moon,
    Layers,
    AlertCircle,
    Award,
    Star,
    ShieldAlert
};

// Format a Date string nicely
const fmtDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};

// Format member duration
const memberSince = (iso) => {
    if (!iso) return '';
    const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (days < 1) return 'Joined today';
    if (days < 30) return `Member for ${days} day${days !== 1 ? 's' : ''}`;
    const months = Math.floor(days / 30);
    if (months < 12) return `Member for ${months} month${months !== 1 ? 's' : ''}`;
    const yrs = Math.floor(months / 12);
    return `Member for ${yrs} year${yrs !== 1 ? 's' : ''}`;
};

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [achievementStats, setAchievementStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const fetchData = async () => {
            try {
                const [profileData, statsData, achData] = await Promise.all([
                    fetch(`${API}/auth/me`, { headers }).then(r => r.json()),
                    fetch(`${API}/auth/stats`, { headers }).then(r => r.json()),
                    achievementService.getAchievements()
                ]);
                
                setProfile(profileData);
                setStats(statsData);
                setAchievements(achData.achievements);
                setAchievementStats(achData.stats);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="profile-skeleton">Loading profile…</div>;
    }

    const initials = profile?.name
        ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    const unlockedAchievements = achievements.filter(a => a.unlocked);

    return (
        <div className="profile-page-wrapper">
            <div className="container">
                <div className="content-limit">
                    {/* Header Section */}
                    <div className="header-section">
                        <div className="header-content">
                            <button onClick={() => navigate(-1)} className="back-btn">
                                <ArrowLeft size={20} />
                            </button>
                            <div className="header-text">
                                <h1>My Profile</h1>
                                <p>Manage your account settings and track your progress</p>
                            </div>
                        </div>
                    </div>

                    <div className="thin-line"></div>

                    <div className="profile-content">

                        {/* ── Identity Card ── */}
                        <div className="profile-card">
                            <div className="card-label">
                                <User size={12} /> Account
                            </div>
                            <div className="profile-identity">
                                <div className="profile-avatar">{initials}</div>
                                <div className="profile-name-group">
                                    <h2 className="profile-name">{profile?.name || 'User'}</h2>
                                    <p className="profile-email">{profile?.email || '—'}</p>
                                    <p className="profile-since">{memberSince(profile?.createdAt)}</p>
                                </div>
                            </div>
                        </div>

                        {/* ── Achievements Highlights ── */}
                        <div className="profile-card">
                            <div className="card-label" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Award size={12} /> Achievements
                                </div>
                                <span style={{ color: 'var(--light-accent)', cursor: 'pointer', fontSize: '0.7rem' }} onClick={() => navigate('/achievements')}>
                                    View All
                                </span>
                            </div>
                            
                            <div className="achievement-highlights">
                                {unlockedAchievements.length > 0 ? (
                                    <div className="achievement-badges-row">
                                        {unlockedAchievements.slice(0, 5).map(achievement => {
                                            const IconComponent = iconMap[achievement.icon] || Star;
                                            return (
                                                <div key={achievement.id} className="mini-achievement-badge" title={achievement.title}>
                                                    <div className="mini-badge-icon" style={{ backgroundColor: `${achievement.color}20` }}>
                                                        <IconComponent size={18} color={achievement.color} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {unlockedAchievements.length > 5 && (
                                            <div className="mini-achievement-badge more" onClick={() => navigate('/achievements')}>
                                                +{unlockedAchievements.length - 5}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="empty-achievements">No achievements unlocked yet. Keep grinding!</p>
                                )}
                                
                                {achievementStats && (
                                    <div className="achievement-summary-row">
                                        <div className="ach-stat">
                                            <span className="ach-val">{achievementStats.unlockedCount}</span>
                                            <span className="ach-lab">Unlocked</span>
                                        </div>
                                        <div className="ach-stat">
                                            <span className="ach-val">{achievementStats.totalPoints}</span>
                                            <span className="ach-lab">Points</span>
                                        </div>
                                        <div className="ach-stat rank">
                                            <span className="ach-val-small">{achievementStats.rank}</span>
                                            <span className="ach-lab">Current Rank</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Stats Grid ── */}
                        {stats && (
                            <div className="profile-card">
                                <div className="card-label">
                                    <BarChart2 size={12} /> Task Statistics
                                </div>

                                {/* Completion Rate */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div className="completion-row">
                                        <span className="completion-label">Completion Rate</span>
                                        <span className="completion-pct">{stats.completionRate}%</span>
                                    </div>
                                    <div className="completion-bar-bg">
                                        <div
                                            className="completion-bar-fill"
                                            style={{ width: `${stats.completionRate}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Stat Tiles */}
                                <div className="stats-grid">
                                    <div className="stat-tile total">
                                        <span className="stat-value">{stats.total}</span>
                                        <span className="stat-name">Total Tasks</span>
                                    </div>
                                    <div className="stat-tile completed">
                                        <span className="stat-value">{stats.completed}</span>
                                        <span className="stat-name">Completed ✅</span>
                                    </div>
                                    <div className="stat-tile overdue">
                                        <span className="stat-value">{stats.overdue}</span>
                                        <span className="stat-name">Overdue 🔴</span>
                                    </div>
                                    <div className="stat-tile inprogress">
                                        <span className="stat-value">{stats.inProgress}</span>
                                        <span className="stat-name">In Progress</span>
                                    </div>
                                    <div className="stat-tile pending">
                                        <span className="stat-value">{stats.pending}</span>
                                        <span className="stat-name">Pending</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Account Info ── */}
                        <div className="profile-card">
                            <div className="card-label">
                                <Mail size={12} /> Account Info
                            </div>
                            <div className="info-row">
                                <span className="info-key">Full Name</span>
                                <span className="info-val">{profile?.name || '—'}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-key">Email</span>
                                <span className="info-val">{profile?.email || '—'}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-key">Member Since</span>
                                <span className="info-val">{fmtDate(profile?.createdAt)}</span>
                            </div>
                        </div>

                        {/* ── Quick links ── */}
                        <div className="profile-card">
                            <div className="card-label">
                                <Zap size={12} /> Quick Links
                            </div>
                            {[
                                { label: 'View All Tasks', icon: CheckSquare, path: '/tasks' },
                                { label: 'My Courses', icon: BookOpen, path: '/courses' },
                                { label: 'Analytics', icon: BarChart2, path: '/analytics' },
                                { label: 'Pomodoro Timer', icon: Clock, path: '/pomodoro' },
                            ].map(({ label, icon: Icon, path }) => (
                                <div
                                    key={path}
                                    className="info-row"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(path)}
                                >
                                    <span className="info-key" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Icon size={13} /> {label}
                                    </span>
                                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>→</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
