import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Star, Zap, Flame, Trophy, Target, Shield, Crown, ArrowLeft, Loader2, Clock, Moon, Layers, AlertCircle } from 'lucide-react';
import './Achievements.css';
import Navbar from '../../components/Navbar';
import achievementService from '../../services/achievementService';

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
    Award
};

const Achievements = () => {
    const navigate = useNavigate();
    const [achievements, setAchievements] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const data = await achievementService.getAchievements();
                setAchievements(data.achievements);
                setStats(data.stats);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching achievements:', err);
                setError('Failed to load achievements. Please try again later.');
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    if (loading) {
        return (
            <div className="achievements-page">
                <div className="achievements-container flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-[#ffe9a6] mx-auto mb-4" />
                        <p className="text-var(--text-secondary)">Loading your achievements...</p>
                    </div>
                </div>
                <Navbar />
            </div>
        );
    }

    if (error) {
        return (
            <div className="achievements-page">
                <div className="achievements-container text-center py-20">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="achievements-back-btn mx-auto"
                        style={{ justifySelf: 'center' }}
                    >
                        Retry
                    </button>
                </div>
                <Navbar />
            </div>
        );
    }

    return (
        <div className="achievements-page">
            <div className="achievements-container">
                <header className="achievements-header">
                    <button className="achievements-back-btn" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} />
                    </button>
                    
                    <div className="achievements-header-text">
                        <h1>Your Achievements</h1>
                        <p>Track your progress and unlock rewards</p>
                    </div>

                    <div className="header-spacer"></div>
                </header>

                <div className="thin-line"></div>

                {/* Rank Section below header */}
                <div className="achievements-rank-section">
                    <div className="achievements-rank-badge">
                        <Award size={20} />
                        <span>{stats?.rank || "Novice Scholar"}</span>
                    </div>
                </div>

                <div className="achievements-stats-grid">
                    <div className="achievement-stat-card">
                        <span className="achievement-stat-value">{stats?.totalPoints || 0}</span>
                        <span className="achievement-stat-label">Total Points</span>
                    </div>
                    <div className="achievement-stat-card">
                        <span className="achievement-stat-value">{stats?.unlockedCount || 0}/{stats?.totalCount || 0}</span>
                        <span className="achievement-stat-label">Unlocked</span>
                    </div>
                    <div className="achievement-stat-card">
                        <span className="achievement-stat-value">
                            {stats ? Math.round((stats.unlockedCount / stats.totalCount) * 100) : 0}%
                        </span>
                        <span className="achievement-stat-label">Completion</span>
                    </div>
                </div>

                <div className="achievements-grid">
                    {achievements.map((achievement) => {
                        const IconComponent = iconMap[achievement.icon] || Star;
                        return (
                            <div 
                                key={achievement.id} 
                                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                                style={{ '--achievement-color': achievement.color }}
                            >
                                <div className="achievement-icon-wrapper" style={{ backgroundColor: achievement.unlocked ? `${achievement.color}20` : 'rgba(255,255,255,0.05)' }}>
                                    <IconComponent 
                                        size={30} 
                                        color={achievement.unlocked ? achievement.color : '#6b7280'} 
                                    />
                                </div>
                                <div className="achievement-info">
                                    <h3>{achievement.title}</h3>
                                    <p>{achievement.description}</p>
                                    <div className="progress-bar-container">
                                        <div 
                                            className="progress-bar" 
                                            style={{ 
                                                width: `${achievement.progress}%`,
                                                backgroundColor: achievement.unlocked ? achievement.color : '#4b5563'
                                            }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">{achievement.progress}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Navbar />
        </div>
    );
};

export default Achievements;
