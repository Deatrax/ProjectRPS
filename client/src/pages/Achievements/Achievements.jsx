import React from 'react';
import { Award, Star, Zap, Flame, Trophy, Target, Shield, Crown } from 'lucide-react';
import './Achievements.css';
import Navbar from '../../components/Navbar';

const Achievements = () => {
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
                    <div className="header-content">
                        <h1>Your Achievements</h1>
                        <p>Track your progress and unlock rewards</p>
                    </div>
                    <div className="rank-badge">
                        <Award size={24} />
                        <span>{stats.rank}</span>
                    </div>
                </header>

                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-value">{stats.totalPoints}</span>
                        <span className="stat-label">Total Points</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{stats.unlockedCount}/{stats.totalCount}</span>
                        <span className="stat-label">Unlocked</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{Math.round((stats.unlockedCount / stats.totalCount) * 100)}%</span>
                        <span className="stat-label">Completion</span>
                    </div>
                </div>

                <div className="achievements-grid">
                    {achievements.map((achievement) => (
                        <div 
                            key={achievement.id} 
                            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                        >
                            <div className="achievement-icon-wrapper" style={{ backgroundColor: achievement.unlocked ? `${achievement.color}20` : '#f3f4f6' }}>
                                <achievement.icon 
                                    size={32} 
                                    color={achievement.unlocked ? achievement.color : '#9ca3af'} 
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
                                            backgroundColor: achievement.unlocked ? achievement.color : '#d1d5db'
                                        }}
                                    ></div>
                                </div>
                                <span className="progress-text">{achievement.progress}%</span>
                            </div>
                            {!achievement.unlocked && <div className="lock-overlay"><Star size={16} /> Locked</div>}
                        </div>
                    ))}
                </div>
            </div>
            <Navbar />
        </div>
    );
};

export default Achievements;
