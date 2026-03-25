import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Star, Zap, Flame, Trophy, Target, Shield, Crown, ArrowLeft } from 'lucide-react';
import './Achievements.css';
import Navbar from '../../components/Navbar';

const Achievements = () => {
    const navigate = useNavigate();

    // Mock achievements data
    const achievements = [
        {
            id: 1,
            title: "First Step",
            description: "Complete your first task",
            icon: Target,
            unlocked: true,
            progress: 100,
            color: "#4ade80"
        },
        {
            id: 2,
            title: "Early Bird",
            description: "Complete a task before its deadline",
            icon: Zap,
            unlocked: true,
            progress: 100,
            color: "#fbbf24"
        },
        {
            id: 3,
            title: "On Fire",
            description: "Maintain a 3-day streak",
            icon: Flame,
            unlocked: false,
            progress: 66,
            color: "#f87171"
        },
        {
            id: 4,
            title: "Course Master",
            description: "Complete all tasks in a course",
            icon: Trophy,
            unlocked: false,
            progress: 25,
            color: "#60a5fa"
        },
        {
            id: 5,
            title: "Scholar",
            description: "Add 5 courses to your dashboard",
            icon: Shield,
            unlocked: true,
            progress: 100,
            color: "#a78bfa"
        },
        {
            id: 6,
            title: "Procrastination Slayer",
            description: "Complete 10 tasks in one day",
            icon: Crown,
            unlocked: false,
            progress: 10,
            color: "#f472b6"
        }
    ];

    const stats = {
        totalPoints: 450,
        unlockedCount: 3,
        totalCount: achievements.length,
        rank: "Novice Scholar"
    };

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

                {/* New Rank Section below header */}
                <div className="achievements-rank-section">
                    <div className="achievements-rank-badge">
                        <Award size={20} />
                        <span>{stats.rank}</span>
                    </div>
                </div>

                <div className="achievements-stats-grid">
                    <div className="achievement-stat-card">
                        <span className="achievement-stat-value">{stats.totalPoints}</span>
                        <span className="achievement-stat-label">Total Points</span>
                    </div>
                    <div className="achievement-stat-card">
                        <span className="achievement-stat-value">{stats.unlockedCount}/{stats.totalCount}</span>
                        <span className="achievement-stat-label">Unlocked</span>
                    </div>
                    <div className="achievement-stat-card">
                        <span className="achievement-stat-value">{Math.round((stats.unlockedCount / stats.totalCount) * 100)}%</span>
                        <span className="achievement-stat-label">Completion</span>
                    </div>
                </div>

                <div className="achievements-grid">
                    {achievements.map((achievement) => (
                        <div 
                            key={achievement.id} 
                            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                            style={{ '--achievement-color': achievement.color }}
                        >
                            <div className="achievement-icon-wrapper" style={{ backgroundColor: achievement.unlocked ? `${achievement.color}20` : 'rgba(255,255,255,0.05)' }}>
                                <achievement.icon 
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
                            {!achievement.unlocked && <div className="lock-overlay"><Star size={14} /> Locked</div>}
                        </div>
                    ))}
                </div>
            </div>
            <Navbar />
        </div>
    );
};

export default Achievements;
