import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Save } from 'lucide-react';
import { usePomodoroTimer } from '../../hooks/usePomodoroTimer';
import './Pomodoro.css';

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
    { label: '1h',  value: 60 * 60 },
    { label: '2h',  value: 120 * 60 },
];

// ── Circular Timer SVG ────────────────────────────────────────────────────────
function CircularTimer({ progress, isRunning, isUrgent, secondsLeft, totalSeconds, taskTitle }) {
    const size = 300;
    const cx = size / 2;
    const cy = size / 2;

    const mainR = 118;
    const mainCircumference = 2 * Math.PI * mainR;
    const mainOffset = mainCircumference * (1 - Math.min(100, Math.max(0, progress)) / 100);

    const dotRingR = 138;
    const dotCount = 60;
    const dots = Array.from({ length: dotCount }, (_, i) => {
        const angle = (i / dotCount) * 2 * Math.PI - Math.PI / 2;
        const x = cx + dotRingR * Math.cos(angle);
        const y = cy + dotRingR * Math.sin(angle);
        const filledAngle = (progress / 100) * dotCount;
        const isFilled = i <= filledAngle;
        return { x, y, isFilled };
    });

    const tickRingR = 98;
    const tickCount = 12;
    const ticks = Array.from({ length: tickCount }, (_, i) => {
        const angle = (i / tickCount) * 2 * Math.PI - Math.PI / 2;
        const innerR = tickRingR - 6;
        const outerR = tickRingR + (i % 3 === 0 ? 10 : 5);
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
                        <stop offset="0%"   stopColor={isUrgent ? '#dc2626' : '#6d28d9'} />
                        <stop offset="100%" stopColor={isUrgent ? '#f87171' : '#c4b5fd'} />
                    </linearGradient>
                    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%"   stopColor={glowColor} stopOpacity="0.15" />
                        <stop offset="100%" stopColor={glowColor} stopOpacity="0"    />
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
                        r={d.isFilled ? 2.8 : 1.8}
                        fill={d.isFilled ? glowColor : 'rgba(255,255,255,0.12)'}
                        opacity={d.isFilled ? 1 : 0.6}
                        filter={d.isFilled ? 'url(#glow)' : undefined}
                    />
                ))}

                <circle cx={cx} cy={cy} r={mainR}
                    fill="none" stroke="url(#arcGrad)" strokeWidth="10"
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
                    return <circle cx={hx} cy={hy} r="7" fill={glowColor} filter="url(#glow-strong)" opacity="0.9" />;
                })()}

                <text x={cx} y={cy - 14} textAnchor="middle" dominantBaseline="middle"
                    fill={isUrgent ? '#f87171' : isRunning ? '#c4b5fd' : 'rgba(255,255,255,0.85)'}
                    style={{
                        fontSize: totalSeconds >= 3600 ? '36px' : '44px',
                        fontWeight: 800,
                        fontFamily: "'Inter', monospace",
                        letterSpacing: '-1px',
                        filter: isRunning ? `drop-shadow(0 0 16px ${glowColor})` : 'none',
                        transition: 'fill 0.4s ease, filter 0.4s ease',
                    }}
                >
                    {fmt(secondsLeft)}
                </text>

                <text x={cx} y={cy + 26} textAnchor="middle"
                    fill="rgba(255,255,255,0.35)"
                    style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '3px' }}
                >
                    {statusText}
                </text>

                {taskTitle && (
                    <text x={cx} y={cy + 46} textAnchor="middle"
                        fill="rgba(255,255,255,0.22)"
                        style={{ fontSize: '10px', fontWeight: 500 }}
                    >
                        {taskTitle.length > 24 ? taskTitle.slice(0, 22) + '…' : taskTitle}
                    </text>
                )}
            </svg>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Pomodoro() {
    const navigate = useNavigate();

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
            .catch(() => {});
    }, []);

    // ── Load tasks ──
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${API}/tasks`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => setTasks(Array.isArray(data) ? data.filter(t => t.status !== 'completed') : []))
            .catch(() => {});
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
            new Audio(FINISH_SOUND).play().catch(() => {});
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
            {/* ── Header ── */}
            <header className="pomo-header">
                <div className="pomo-header-left">
                    <h1 className="pomo-title">🐼 Panda Pomodoro</h1>
                    <span className="pomo-subtitle">Time to focus</span>
                </div>
                {multiplier > 1.0 && (
                    <div className="penalty-badge">⚡ +{penaltyPct}% speed</div>
                )}
            </header>

            {/* ── Task Selector ── */}
            <div className="pomo-task-selector">
                <label>Focus on task</label>
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
                    <div className="draft-chip">
                        💾 Draft — {fmt(draftInfo.remaining)} remaining
                    </div>
                )}
            </div>

            {/* ── Circular Timer ── */}
            <CircularTimer
                progress={progress}
                isRunning={isRunning}
                isUrgent={isUrgent}
                secondsLeft={secondsLeft}
                totalSeconds={totalSeconds}
                taskTitle={selectedTask?.title}
            />

            {/* ── Duration Controls (always visible when not running) ── */}
            {!isRunning && (
                <div className="pomo-duration-section">
                    <span className="pomo-duration-label">Set duration</span>

                    {/* Preset buttons */}
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

                    {/* H : M : S manual inputs */}
                    <div className="pomo-custom-row">
                        <div className="pomo-hms-inputs">
                            <div className="pomo-hms-field">
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="pomo-custom-input"
                                    value={customH}
                                    min={0}
                                    onChange={e => setCustomH(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleCustomSet()}
                                />
                                <span className="pomo-hms-label">h</span>
                            </div>
                            <div className="pomo-hms-field">
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="pomo-custom-input"
                                    value={customM}
                                    min={0}
                                    max={59}
                                    onChange={e => setCustomM(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleCustomSet()}
                                />
                                <span className="pomo-hms-label">m</span>
                            </div>
                            <div className="pomo-hms-field">
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="pomo-custom-input"
                                    value={customS}
                                    min={0}
                                    max={59}
                                    onChange={e => setCustomS(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleCustomSet()}
                                />
                                <span className="pomo-hms-label">s</span>
                            </div>
                        </div>
                        <button
                            className="pomo-set-btn"
                            onClick={handleCustomSet}
                            disabled={!customH && !customM && !customS}
                        >
                            Set
                        </button>
                    </div>
                </div>
            )}

            {/* ── Controls ── */}
            <div className="pomo-controls">
                {!isRunning ? (
                    <button
                        className="pomo-btn pomo-btn-start"
                        onClick={handleStart}
                        disabled={secondsLeft <= 0}
                    >
                        <Play size={20} fill="currentColor" />
                        <span>{selectedTaskId ? 'Start' : 'Select a task first'}</span>
                    </button>
                ) : (
                    <button className="pomo-btn pomo-btn-pause" onClick={pause}>
                        <Pause size={20} fill="currentColor" />
                        <span>Pause</span>
                    </button>
                )}

                <button
                    className="pomo-btn pomo-btn-draft"
                    onClick={handleSaveDraft}
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

            {/* ── Done Modal ── */}
            {isDone && (
                <div className="pomo-done-overlay">
                    <div className="pomo-done-card">
                        <div className="pomo-done-confetti">🎉</div>
                        <h2>Time's Up!</h2>
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
