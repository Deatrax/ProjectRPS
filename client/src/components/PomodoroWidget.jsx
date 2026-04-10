import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Timer } from 'lucide-react';
import { usePomodoroTimer } from '../hooks/usePomodoroTimer';
import './PomodoroWidget.css';

const API = 'http://localhost:5000/api';

// Format seconds → MM:SS or HH:MM:SS
const fmt = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

// Simple relative time helper
const timeAgo = (dateStr) => {
    if (!dateStr) return 'Never attempted';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
};

/**
 * PomodoroWidget
 * A compact dashboard card with a mini Pomodoro timer.
 * Clicking the card header opens the full /pomodoro page.
 *
 * @param {Array}  tasks      – list of non-completed tasks from Dashboard
 * @param {number} multiplier – speed multiplier from backend
 */
export default function PomodoroWidget({ tasks = [], multiplier = 1.0 }) {
    const navigate = useNavigate();
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [initSecs, setInitSecs] = useState(25 * 60);
    const [initTotal, setInitTotal] = useState(25 * 60);

    // Load draft if a task is selected
    useEffect(() => {
        if (!selectedTaskId) {
            setInitSecs(25 * 60);
            setInitTotal(25 * 60);
            return;
        }
        const task = tasks.find(t => t._id === selectedTaskId);
        if (task?.pomoDraftSeconds && task?.pomoPlannedSeconds) {
            setInitSecs(task.pomoDraftSeconds);
            setInitTotal(task.pomoPlannedSeconds);
        } else {
            setInitSecs(25 * 60);
            setInitTotal(25 * 60);
        }
    }, [selectedTaskId, tasks]);

    const {
        secondsLeft,
        totalSeconds,
        isRunning,
        isDone,
        start,
        pause,
        finish,
    } = usePomodoroTimer(selectedTaskId, initSecs, initTotal, multiplier);

    // Auto-handle when timer finishes (widget just marks done, no modal)
    useEffect(() => {
        if (isDone && selectedTaskId) {
            finish(false); // Don't auto-complete — let user decide on full page
            navigate('/pomodoro');
        }
    }, [isDone]); // eslint-disable-line react-hooks/exhaustive-deps

    const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
    const isUrgent = secondsLeft > 0 && secondsLeft < 60;
    const selectedTask = tasks.find(t => t._id === selectedTaskId);
    const penaltyPct = Math.round((multiplier - 1) * 100);

    return (
        <div className="pomo-widget" onClick={() => !isRunning && navigate('/pomodoro')}>
            {/* Header */}
            <div className="pomo-widget-header">
                <div className="pomo-widget-title">
                    <Timer size={14} />
                    Panda Pomodoro
                    {multiplier > 1.0 && (
                        <span className="pomo-widget-penalty">⚡ +{penaltyPct}%</span>
                    )}
                </div>
                <span className="pomo-widget-open-hint">↗ Full view</span>
            </div>

            {/* Task selector */}
            <div className="pomo-widget-task-row" onClick={e => e.stopPropagation()}>
                <select
                    className="pomo-widget-select"
                    value={selectedTaskId}
                    onChange={e => setSelectedTaskId(e.target.value)}
                    disabled={isRunning}
                >
                    <option value="">— pick a task —</option>
                    {tasks.map(t => (
                        <option key={t._id} value={t._id}>
                            {t.status === 'overdue' ? '🔴 ' : t.pomoDraftSeconds ? '💾 ' : ''}
                            {t.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Timer + controls */}
            <div className="pomo-widget-timer-row" onClick={e => e.stopPropagation()}>
                <div className={`pomo-widget-digits ${isRunning ? 'running' : ''} ${isUrgent ? 'urgent' : ''}`}>
                    {fmt(secondsLeft)}
                </div>
                {selectedTask && (
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', flex: 1, padding: '0 0.5rem' }}>
                        {timeAgo(selectedTask.lastAttemptedAt)}
                    </div>
                )}
                <div className="pomo-widget-controls">
                    {!isRunning ? (
                        <button
                            className="pomo-w-btn pomo-w-btn-start"
                            onClick={start}
                            disabled={!selectedTaskId || secondsLeft <= 0}
                            title="Start"
                        >
                            <Play size={16} />
                        </button>
                    ) : (
                        <button
                            className="pomo-w-btn pomo-w-btn-pause"
                            onClick={pause}
                            title="Pause"
                        >
                            <Pause size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Progress bar */}
            <div className="pomo-widget-bar">
                <div className={`pomo-widget-bar-fill ${isUrgent ? 'urgent' : ''}`} style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}

// Export the timeAgo helper so Dashboard.jsx can use it too
export { timeAgo };
