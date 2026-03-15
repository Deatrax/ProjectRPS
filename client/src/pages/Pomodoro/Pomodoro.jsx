import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Save, RefreshCw } from 'lucide-react';
import Panda from '../../components/Panda';
import { usePomodoroTimer } from '../../hooks/usePomodoroTimer';
import './Pomodoro.css';
import '../../components/PandaLamp.css';

const API = 'http://localhost:5000/api';

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const PRESETS = [
    { label: '25 min', value: 25 * 60 },
    { label: '45 min', value: 45 * 60 },
    { label: '1 hr', value: 60 * 60 },
    { label: '2 hr', value: 120 * 60 },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Pomodoro() {
    const navigate = useNavigate();

    // Data state
    const [tasks, setTasks] = useState([]);
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [multiplier, setMultiplier] = useState(1.0);
    const [draftSeconds, setDraftSeconds] = useState(null);
    const [customMin, setCustomMin] = useState('');
    const [activePreset, setActivePreset] = useState(null);

    // Initial seconds: from draft or 0 (user picks preset / custom)
    const [initSecs, setInitSecs] = useState(0);

    const {
        secondsLeft,
        totalSeconds,
        isRunning,
        isDone,
        start,
        pause,
        saveDraft,
        finish,
        setDuration,
    } = usePomodoroTimer(selectedTaskId, initSecs, multiplier);

    // ── Fetch multiplier once ───────────────────────────────────────────────
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${API}/pomodoro/speed-multiplier`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => setMultiplier(d.multiplier ?? 1.0))
            .catch(() => { });
    }, []);

    // ── Fetch tasks ─────────────────────────────────────────────────────────
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${API}/tasks`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => setTasks(Array.isArray(data) ? data.filter(t => t.status !== 'completed') : []))
            .catch(() => { });
    }, []);

    // ── When task changes, check for a draft ────────────────────────────────
    useEffect(() => {
        setDraftSeconds(null);
        setActivePreset(null);
        setInitSecs(0);
        setDuration(0);
        if (!selectedTaskId) return;
        const token = localStorage.getItem('token');
        fetch(`${API}/pomodoro/task/${selectedTaskId}/draft`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => {
                if (d.pomoDraftSeconds) {
                    setDraftSeconds(d.pomoDraftSeconds);
                    setInitSecs(d.pomoDraftSeconds);
                    setDuration(d.pomoDraftSeconds);
                }
            })
            .catch(() => { });
    }, [selectedTaskId]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Preset click ────────────────────────────────────────────────────────
    const handlePreset = (secs, label) => {
        if (isRunning) return;
        setActivePreset(label);
        setDraftSeconds(null);
        setInitSecs(secs);
        setDuration(secs);
    };

    // ── Custom input ────────────────────────────────────────────────────────
    const handleCustomSet = () => {
        const mins = parseInt(customMin, 10);
        if (isNaN(mins) || mins <= 0) return;
        const secs = mins * 60;
        setActivePreset(null);
        setDraftSeconds(null);
        setInitSecs(secs);
        setDuration(secs);
        setCustomMin('');
    };

    // ── Save draft handler ───────────────────────────────────────────────────
    const handleSaveDraft = async () => {
        await saveDraft();
        navigate('/dashboard');
    };

    // ── Finish modal: YES ────────────────────────────────────────────────────
    const handleFinishYes = async () => {
        await finish(true);
        navigate('/dashboard');
    };

    // ── Finish modal: NO ─────────────────────────────────────────────────────
    const handleFinishNo = async () => {
        await finish(false);
    };

    // ── Derived display values ───────────────────────────────────────────────
    const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
    const isUrgent = secondsLeft > 0 && secondsLeft < 60;
    const selectedTask = tasks.find(t => t._id === selectedTaskId);
    const penaltyPct = Math.round((multiplier - 1) * 100);

    return (
        <div className="pomodoro-page">
            {/* ── Header ── */}
            <header className="pomo-header">
                <h1 className="pomo-title">🐼 Panda Pomodoro</h1>
                {multiplier > 1.0 && (
                    <div className="penalty-badge">
                        ⚡ Penalty: +{penaltyPct}% speed
                    </div>
                )}
            </header>

            {/* ── Panda Mascot ── */}
            <div className="pomo-panda-wrap">
                <div className={`panda-area state-panda ${isRunning ? 'state-welcome' : ''}`}>
                    <Panda />
                </div>
            </div>

            {/* ── Task Selector ── */}
            <div className="pomo-task-selector">
                <label>Select a task to focus on</label>
                <select
                    className="pomo-task-select"
                    value={selectedTaskId}
                    onChange={e => setSelectedTaskId(e.target.value)}
                    disabled={isRunning}
                >
                    <option value="">— choose a task —</option>
                    {tasks.map(t => (
                        <option key={t._id} value={t._id}>
                            {t.status === 'overdue' ? '🔴 ' : ''}
                            {t.title}
                            {t.course?.courseCode ? ` [${t.course.courseCode}]` : ''}
                        </option>
                    ))}
                </select>
                {draftSeconds !== null && (
                    <div className="draft-chip">
                        💾 Draft saved — {fmt(draftSeconds)} remaining
                    </div>
                )}
            </div>

            {/* ── Timer Card ── */}
            <div className="pomo-timer-card">

                {/* Time Display */}
                <div className="pomo-time-display">
                    <div className={`pomo-digits ${isRunning ? 'running' : 'paused'} ${isUrgent ? 'urgent' : ''}`}>
                        {fmt(secondsLeft)}
                    </div>
                    {selectedTask && (
                        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.4rem' }}>
                            {selectedTask.title}
                        </div>
                    )}
                </div>

                {/* Progress bar */}
                <div className="pomo-progress-ring">
                    <div
                        className={`pomo-progress-fill ${isUrgent ? 'urgent' : ''}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Duration presets (only shown when not running) */}
                {!isRunning && (
                    <div className="pomo-duration-set">
                        <label>Set duration</label>
                        <div className="pomo-preset-btns">
                            {PRESETS.map(p => (
                                <button
                                    key={p.label}
                                    className={`pomo-preset-btn ${activePreset === p.label ? 'active' : ''}`}
                                    onClick={() => handlePreset(p.value, p.label)}
                                    disabled={!selectedTaskId}
                                >
                                    {p.label}
                                </button>
                            ))}
                            <div className="pomo-custom-input-row">
                                <input
                                    type="number"
                                    placeholder="min"
                                    className="pomo-custom-input"
                                    value={customMin}
                                    min={1}
                                    onChange={e => setCustomMin(e.target.value)}
                                    disabled={!selectedTaskId}
                                />
                                <button
                                    className="pomo-set-btn"
                                    onClick={handleCustomSet}
                                    disabled={!selectedTaskId || !customMin}
                                >
                                    Set
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="pomo-controls">
                    {!isRunning ? (
                        <button
                            className="pomo-btn pomo-btn-start"
                            onClick={start}
                            disabled={!selectedTaskId || secondsLeft <= 0}
                        >
                            <Play size={18} /> Start
                        </button>
                    ) : (
                        <button className="pomo-btn pomo-btn-pause" onClick={pause}>
                            <Pause size={18} /> Pause
                        </button>
                    )}
                    <button
                        className="pomo-btn pomo-btn-draft"
                        onClick={handleSaveDraft}
                        disabled={!selectedTaskId || secondsLeft <= 0}
                    >
                        <Save size={18} /> Save Draft
                    </button>
                </div>

                {multiplier > 1.0 && (
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                        Timer runs {penaltyPct}% faster due to overdue / untouched tasks
                    </div>
                )}
            </div>

            {/* ── "Did you finish?" Modal ── */}
            {isDone && (
                <div className="pomo-done-overlay">
                    <div className="pomo-done-card">
                        <div className="pomo-done-emoji">🎉</div>
                        <h2>Time's up!</h2>
                        <p>Did you finish <strong>{selectedTask?.title || 'this task'}</strong>?</p>
                        <div className="pomo-done-actions">
                            <button className="pomo-done-yes" onClick={handleFinishYes}>
                                ✅ Yes, mark complete!
                            </button>
                            <button className="pomo-done-no" onClick={handleFinishNo}>
                                Not yet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
