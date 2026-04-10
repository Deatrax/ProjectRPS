import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Save } from 'lucide-react';
import { usePomodoroTimer } from '../../hooks/usePomodoroTimer';
import Panda from '../../components/Panda';
import './Pomodoro.css';
import '../../components/PandaAnchor.css';

const API = 'http://localhost:5000/api';
const FINISH_SOUND = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const PRESETS = [
    { label: '25m', value: 25 * 60 },
    { label: '45m', value: 45 * 60 },
    { label: '1h', value: 60 * 60 },
    { label: '2h', value: 120 * 60 },
];

// ── Circular Timer SVG ────────────────────────────────────────────────────────
function CircularTimer({ progress, isRunning, isUrgent, secondsLeft, totalSeconds, taskTitle }) {
    const size = 480;
    const cx = size / 2;
    const cy = size / 2;

    const mainR = 190;
    const mainCircumference = 2 * Math.PI * mainR;
    const mainOffset = mainCircumference * (1 - Math.min(100, Math.max(0, progress)) / 100);

    const dotRingR = 218;
    const dotCount = 72;
    const dots = Array.from({ length: dotCount }, (_, i) => {
        const angle = (i / dotCount) * 2 * Math.PI - Math.PI / 2;
        const x = cx + dotRingR * Math.cos(angle);
        const y = cy + dotRingR * Math.sin(angle);
        const filledAngle = (progress / 100) * dotCount;
        const isFilled = i <= filledAngle;
        return { x, y, isFilled };
    });

    const tickRingR = 158;
    const tickCount = 12;
    const ticks = Array.from({ length: tickCount }, (_, i) => {
        const angle = (i / tickCount) * 2 * Math.PI - Math.PI / 2;
        const innerR = tickRingR - 8;
        const outerR = tickRingR + (i % 3 === 0 ? 14 : 7);
        return {
            x1: cx + innerR * Math.cos(angle),
            y1: cy + innerR * Math.sin(angle),
            x2: cx + outerR * Math.cos(angle),
            y2: cy + outerR * Math.sin(angle),
            isMajor: i % 3 === 0,
        };
    });

    const glowColor = isUrgent ? '#f87171' : isRunning ? '#a78bfa' : '#7c5cfc';
    const trackColor = isUrgent ? 'rgba(248,113,113,0.12)' : 'rgba(167,139,250,0.1)';
    const statusText = isRunning ? 'FOCUSING' : secondsLeft > 0 && totalSeconds > 0 ? 'PAUSED' : 'READY';

    return (
        <div className="pomo-circle-wrap">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="pomo-circle-svg">
                <defs>
                    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="10" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={isUrgent ? '#dc2626' : '#6d28d9'} />
                        <stop offset="100%" stopColor={isUrgent ? '#f87171' : '#c4b5fd'} />
                    </linearGradient>
                    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={glowColor} stopOpacity="0.15" />
                        <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
                    </radialGradient>
                </defs>

                <circle cx={cx} cy={cy} r={mainR} fill="url(#centerGlow)" />
                <circle cx={cx} cy={cy} r={mainR} fill="none" stroke={trackColor} strokeWidth="10" />

                {ticks.map((t, i) => (
                    <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                        stroke={t.isMajor ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'}
                        strokeWidth={t.isMajor ? 2 : 1} strokeLinecap="round" />
                ))}

                {dots.map((d, i) => (
                    <circle key={i} cx={d.x} cy={d.y}
                        r={d.isFilled ? 3.2 : 2}
                        fill={d.isFilled ? glowColor : 'rgba(255,255,255,0.1)'}
                        opacity={d.isFilled ? 1 : 0.55}
                        filter={d.isFilled ? 'url(#glow)' : undefined}
                    />
                ))}

                <circle cx={cx} cy={cy} r={mainR}
                    fill="none" stroke="url(#arcGrad)" strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={mainCircumference}
                    strokeDashoffset={mainOffset}
                    transform={`rotate(-90 ${cx} ${cy})`}
                    filter="url(#glow)"
                    style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                />

                {progress > 1 && (() => {
                    const angle = ((progress / 100) * 360 - 90) * (Math.PI / 180);
                    const hx = cx + mainR * Math.cos(angle);
                    const hy = cy + mainR * Math.sin(angle);
                    return <circle cx={hx} cy={hy} r="9" fill={glowColor} filter="url(#glow-strong)" opacity="0.9" />;
                })()}

                <text x={cx} y={cy - 20} textAnchor="middle" dominantBaseline="middle"
                    fill={isUrgent ? '#f87171' : isRunning ? '#c4b5fd' : 'rgba(255,255,255,0.9)'}
                    style={{
                        fontSize: totalSeconds >= 3600 ? '56px' : '72px',
                        fontWeight: 800,
                        fontFamily: "'Inter', monospace",
                        letterSpacing: '-2px',
                        filter: isRunning ? `drop-shadow(0 0 20px ${glowColor})` : 'none',
                        transition: 'fill 0.4s ease, filter 0.4s ease',
                    }}
                >
                    {fmt(secondsLeft)}
                </text>

                <text x={cx} y={cy + 36} textAnchor="middle"
                    fill="rgba(255,255,255,0.35)"
                    style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '4px' }}
                >
                    {statusText}
                </text>

                {taskTitle && (
                    <text x={cx} y={cy + 64} textAnchor="middle"
                        fill="rgba(255,255,255,0.2)"
                        style={{ fontSize: '12px', fontWeight: 500 }}
                    >
                        {taskTitle.length > 28 ? taskTitle.slice(0, 26) + '…' : taskTitle}
                    </text>
                )}
            </svg>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Pomodoro() {
    const navigate = useNavigate();

    // Motivational quotes for setup phase
    const FOCUS_QUOTES = React.useMemo(() => [
        "The best way to get it done is to begin. 🐼",
        "Focus now, relax later. You got this!",
        "Every minute counts. Let's make progress!",
        "Deep work mode: ON. 🚀",
        "Small steps lead to big results.",
        "Your future self will thank you for this focus."
    ], []);

    // Pick one quote to stay stable until refresh
    const initialQuote = React.useMemo(() =>
        FOCUS_QUOTES[Math.floor(Math.random() * FOCUS_QUOTES.length)],
        [FOCUS_QUOTES]
    );

    const [tasks, setTasks] = useState([]);
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [multiplier, setMultiplier] = useState(1.0);
    const [draftInfo, setDraftInfo] = useState(null);   // { remaining, planned }
    const [activePreset, setActivePreset] = useState(null);
    const [customH, setCustomH] = useState('');
    const [customM, setCustomM] = useState('');
    const [customS, setCustomS] = useState('');

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
    } = usePomodoroTimer(multiplier);

    // ── Load multiplier ──
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${API}/pomodoro/speed-multiplier`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(d => setMultiplier(d.multiplier ?? 1.0))
            .catch(() => { });
    }, []);

    // ── Load tasks ──
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${API}/tasks`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => setTasks(Array.isArray(data) ? data.filter(t => t.status !== 'completed') : []))
            .catch(() => { });
    }, []);

    // ── Load draft when task changes ──
    useEffect(() => {
        if (!selectedTaskId) {
            setDraftInfo(null);
            setActivePreset(null);
            setDuration(25 * 60, 25 * 60);
            return;
        }
        const token = localStorage.getItem('token');
        fetch(`${API}/pomodoro/task/${selectedTaskId}/draft`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(d => {
                if (d.pomoDraftSeconds && d.pomoPlannedSeconds) {
                    setDraftInfo({ remaining: d.pomoDraftSeconds, planned: d.pomoPlannedSeconds });
                    setDuration(d.pomoDraftSeconds, d.pomoPlannedSeconds);
                    setActivePreset('Draft');
                } else {
                    setDraftInfo(null);
                    setDuration(25 * 60, 25 * 60);
                    setActivePreset('25m');
                }
            })
            .catch(() => {
                setDraftInfo(null);
                setDuration(25 * 60, 25 * 60);
                setActivePreset('25m');
            });
    }, [selectedTaskId]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Play sound on finish ──
    useEffect(() => {
        if (isDone) {
            new Audio(FINISH_SOUND).play().catch(() => { });
        }
    }, [isDone]);

    // ── Preset click ──
    const handlePreset = (p) => {
        if (isRunning) return;
        setActivePreset(p.label);
        setDraftInfo(null);
        setDuration(p.value, p.value);
    };

    // ── Custom H/M/S set ──
    const handleCustomSet = () => {
        const h = parseInt(customH || '0', 10) || 0;
        const m = parseInt(customM || '0', 10) || 0;
        const s = parseInt(customS || '0', 10) || 0;
        const total = h * 3600 + m * 60 + s;
        if (total <= 0) return;
        setActivePreset('Custom');
        setDraftInfo(null);
        setDuration(total, total);
        setCustomH('');
        setCustomM('');
        setCustomS('');
    };

    // ── Start: pass taskId into start() ──
    const handleStart = () => {
        if (!selectedTaskId) {
            alert('Please select a task first!');
            return;
        }
        start(selectedTaskId);
    };

    // ── Save draft & go back ──
    const handleSaveDraft = async () => {
        await saveDraft();
        navigate('/dashboard');
    };

    // ── Finish modal actions ──
    const handleFinishYes = async () => {
        await finish(true);
        navigate('/dashboard');
    };
    const handleFinishNo = async () => {
        await finish(false);
    };

    const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
    const isUrgent = secondsLeft > 0 && secondsLeft < 60;
    const selectedTask = tasks.find(t => t._id === selectedTaskId);
    const penaltyPct = Math.round((multiplier - 1) * 100);

    return (
        <div className="pomodoro-page">
            {/* Header */}
            <header className="pomo-header">
                <div className="pomo-header-left">
                    <h1 className="pomo-title">🐼 Panda Pomodoro</h1>
                    <span className="pomo-subtitle">Focus · Rest · Repeat</span>
                </div>
                {multiplier > 1.0 && (
                    <div className="penalty-badge">⚡ +{penaltyPct}% speed penalty</div>
                )}
            </header>

            {/* ── Two-column layout: Clock LEFT, Controls RIGHT ── */}
            <div className="pomo-layout">

                {/* LEFT — Big clock */}
                <div className="pomo-left">
                    <CircularTimer
                        progress={progress}
                        isRunning={isRunning}
                        isUrgent={isUrgent}
                        secondsLeft={secondsLeft}
                        totalSeconds={totalSeconds}
                        taskTitle={selectedTask?.title}
                    />
                </div>

                {/* RIGHT — All controls */}
                <div className="pomo-right">

                    {/* Task selector */}
                    <div className="pomo-section">
                        <span className="pomo-section-label">Select task</span>
                        <div className="pomo-select-wrap">
                            <select
                                className="pomo-task-select"
                                value={selectedTaskId}
                                onChange={e => setSelectedTaskId(e.target.value)}
                                disabled={isRunning}
                            >
                                <option value="">— choose a task —</option>
                                {tasks.map(t => (
                                    <option key={t._id} value={t._id}>
                                        {t.status === 'overdue' ? '🔴 ' : ''}{t.title}
                                        {t.course?.courseCode ? ` [${t.course.courseCode}]` : ''}
                                    </option>
                                ))}
                            </select>
                            <span className="pomo-select-arrow">▾</span>
                        </div>
                        {draftInfo && (
                            <div className="draft-chip">💾 Draft — {fmt(draftInfo.remaining)} remaining</div>
                        )}
                    </div>

                    {/* Duration presets */}
                    {!isRunning && (
                        <div className="pomo-section">
                            <span className="pomo-section-label">Duration</span>
                            <div className="pomo-preset-row">
                                {PRESETS.map(p => (
                                    <button
                                        key={p.label}
                                        className={`pomo-preset-btn ${activePreset === p.label ? 'active' : ''}`}
                                        onClick={() => handlePreset(p)}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>

                            {/* H : M : S inputs */}
                            <div className="pomo-custom-row">
                                <div className="pomo-hms-inputs">
                                    <div className="pomo-hms-field">
                                        <input type="number" placeholder="0" className="pomo-custom-input"
                                            value={customH} min={0}
                                            onChange={e => setCustomH(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleCustomSet()}
                                        />
                                        <span className="pomo-hms-label">h</span>
                                    </div>
                                    <div className="pomo-hms-field">
                                        <input type="number" placeholder="0" className="pomo-custom-input"
                                            value={customM} min={0} max={59}
                                            onChange={e => setCustomM(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleCustomSet()}
                                        />
                                        <span className="pomo-hms-label">m</span>
                                    </div>
                                    <div className="pomo-hms-field">
                                        <input type="number" placeholder="0" className="pomo-custom-input"
                                            value={customS} min={0} max={59}
                                            onChange={e => setCustomS(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleCustomSet()}
                                        />
                                        <span className="pomo-hms-label">s</span>
                                    </div>
                                </div>
                                <button className="pomo-set-btn" onClick={handleCustomSet}
                                    disabled={!customH && !customM && !customS}
                                >
                                    Set
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Main action buttons */}
                    <div className="pomo-section pomo-controls">
                        {!isRunning ? (
                            <button className="pomo-btn pomo-btn-start" onClick={handleStart}
                                disabled={secondsLeft <= 0}
                            >
                                <Play size={22} fill="currentColor" />
                                <span>{selectedTaskId ? 'Start' : 'Select a task first'}</span>
                            </button>
                        ) : (
                            <button className="pomo-btn pomo-btn-pause" onClick={pause}>
                                <Pause size={22} fill="currentColor" />
                                <span>Pause</span>
                            </button>
                        )}

                        <button className="pomo-btn pomo-btn-draft" onClick={handleSaveDraft}
                            disabled={secondsLeft <= 0 || !selectedTaskId}
                        >
                            <Save size={18} />
                            <span>Save Draft</span>
                        </button>
                    </div>

                    {multiplier > 1.0 && (
                        <p className="pomo-penalty-note">
                            ⚡ Timer runs {penaltyPct}% faster due to overdue tasks
                        </p>
                    )}
                </div>
            </div>

            {/* Done modal */}
            {isDone && (
                <div className="pomo-done-overlay">
                    <div className="pomo-done-card">
                        <div className="pomo-done-confetti">🎉</div>
                        <h2>Time's Up!</h2>
                        <p>Did you finish <strong>{selectedTask?.title || 'this task'}</strong>?</p>
                        <div className="pomo-done-actions">
                            <button className="pomo-done-yes" onClick={handleFinishYes}>✅ Yes, mark complete!</button>
                            <button className="pomo-done-no" onClick={handleFinishNo}>Not yet</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Fixed Panda Character (Wishes luck then slides out) */}
            <div className={`panda-dashboard-anchor ${isRunning ? 'slide-out' : ''}`}>
                <div className="panda-speech-bubble">
                    <div className="bubble-box">
                        {isRunning ? "Good luck! 🐼" : initialQuote}
                    </div>
                    <div className="bubble-dots">
                        <div className="dot dot-3"></div>
                        <div className="dot dot-2"></div>
                        <div className="dot dot-1"></div>
                    </div>
                </div>
                <Panda />
            </div>
        </div>
    );
}

