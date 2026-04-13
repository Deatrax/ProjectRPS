import React, { useState, useEffect, useRef } from 'react';
import './ApologyModal.css';

// Cycling dramatic messages
const DRAMA_MESSAGES = [
    '"Your task weeps in your absence…"',
    '"The database is disappointed in you."',
    '"Time waits for no one. Especially not you."',
    '"Your future self is filing a complaint."',
    '"The deadline passed. The deadline mourned."',
    '"Even the compiler gave up on you."',
    '"Somewhere, a progress bar remains at 0%."',
    '"Your task opened a therapy session."',
    '"The codebase silently judges your choices."',
    '"A deadline missed is a dream deferred… indefinitely."',
];

// Count words in a string
const countWords = (str) => str.trim().split(/\s+/).filter(Boolean).length;

// Apology done key for today
const getTodayKey = () => {
    const d = new Date();
    return `apology_done_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * ApologyModal
 *
 * Shows a full-screen shame modal when the user has overdue tasks and
 * hasn't written their apology letter yet today.
 *
 * @param {Array}    overdueTasks  – list of overdue task objects { id, name }
 * @param {Function} onDismiss     – called when the user successfully submits
 */
export default function ApologyModal({ overdueTasks = [], onDismiss }) {
    const [text, setText] = useState('');
    const [dramaIdx, setDramaIdx] = useState(0);
    const [fading, setFading] = useState(false);
    const intervalRef = useRef(null);

    // Cycle through dramatic messages every 5 seconds with a fade
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setFading(true);
            setTimeout(() => {
                setDramaIdx(i => (i + 1) % DRAMA_MESSAGES.length);
                setFading(false);
            }, 500);
        }, 5000);
        return () => clearInterval(intervalRef.current);
    }, []);

    const wordCount = countWords(text);
    const enough = wordCount >= 50;

    const handleSubmit = () => {
        if (!enough) return;
        localStorage.setItem(getTodayKey(), 'true');
        onDismiss();
    };

    // Word count color tier
    const countClass = enough ? 'enough' : wordCount >= 35 ? 'close' : 'low';

    return (
        <div className="apology-overlay">
            <div className="apology-card">

                {/* Header */}
                <div className="apology-header">
                    <span className="apology-skull">💀</span>
                    <h2 className="apology-title">You Have Failed.</h2>
                    <p className="apology-subtitle">
                        The deadline(s) below have passed. The system is not amused.
                        Write a 50-word apology letter to your future self to regain access.
                    </p>
                </div>

                {/* Overdue task list */}
                {overdueTasks.length > 0 && (
                    <div className="apology-overdue-list">
                        {overdueTasks.map(t => (
                            <span key={t.id}>🔴 {t.name}</span>
                        ))}
                    </div>
                )}

                {/* Dramatic cycling quote */}
                <div className={`apology-drama ${fading ? 'fading' : ''}`}>
                    {DRAMA_MESSAGES[dramaIdx]}
                </div>

                {/* Apology textarea */}
                <div>
                    <label className="apology-label" htmlFor="apology-text">
                        Your apology letter
                    </label>
                    <textarea
                        id="apology-text"
                        className="apology-textarea"
                        placeholder="Dear future me, I am deeply sorry for my inability to respect deadlines…"
                        value={text}
                        onChange={e => setText(e.target.value)}
                    />
                </div>

                {/* Word count */}
                <div className="apology-word-count">
                    <span>
                        <span className={`word-count-num ${countClass}`}>{wordCount}</span>
                        <span className="word-count-label"> / 50 words</span>
                    </span>
                    <span className="word-count-label">
                        {enough ? '✅ Ready to submit' : `${50 - wordCount} more word${50 - wordCount !== 1 ? 's' : ''} needed`}
                    </span>
                </div>

                {/* Submit */}
                <button
                    className="apology-submit"
                    disabled={!enough}
                    onClick={handleSubmit}
                >
                    {enough ? '🙏 Submit Apology & Unlock Dashboard' : `Write ${50 - wordCount} more word${50 - wordCount !== 1 ? 's' : ''}…`}
                </button>

            </div>
        </div>
    );
}

/**
 * hasApologyForToday — utility to check localStorage flag
 */
export function hasApologyForToday() {
    return localStorage.getItem(getTodayKey()) === 'true';
}
