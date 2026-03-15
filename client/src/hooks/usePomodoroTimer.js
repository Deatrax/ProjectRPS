import { useState, useEffect, useRef, useCallback } from 'react';

const API = 'http://localhost:5000/api';

/**
 * usePomodoroTimer
 * ─────────────────
 * Shared timer logic used by both the full Pomodoro page and the dashboard mini-widget.
 *
 * @param {string|null} taskId  – MongoDB Task ID currently selected
 * @param {number}      initialSeconds – Seconds to start from (0 = user sets manually)
 * @param {number}      multiplier – Speed multiplier from backend (1.0 = normal, 1.1 = 10% faster)
 */
export function usePomodoroTimer(taskId, initialSeconds = 0, multiplier = 1.0) {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionId, setSessionId] = useState(null);  // PomodoroSession._id
    const [isDone, setIsDone] = useState(false);  // true when timer hits 0

    // Refs so interval callbacks always see latest values
    const secondsRef = useRef(secondsLeft);
    const elapsedRef = useRef(0);           // elapsed ticks (in real seconds)
    const intervalRef = useRef(null);
    const sessionIdRef = useRef(sessionId);

    useEffect(() => { secondsRef.current = secondsLeft; }, [secondsLeft]);
    useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);

    // ── Reset when task or initial seconds change ──────────────────────────────
    useEffect(() => {
        stop(false); // stop without saving draft
        setSecondsLeft(initialSeconds);
        setTotalSeconds(initialSeconds);
        setIsDone(false);
        elapsedRef.current = 0;
    }, [taskId, initialSeconds]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Internal tick ──────────────────────────────────────────────────────────
    const tick = useCallback(() => {
        const next = secondsRef.current - 1;
        elapsedRef.current += 1;
        if (next <= 0) {
            setSecondsLeft(0);
            secondsRef.current = 0;
            setIsRunning(false);
            clearInterval(intervalRef.current);
            setIsDone(true);
        } else {
            setSecondsLeft(next);
        }
    }, []);

    // ── Start ──────────────────────────────────────────────────────────────────
    const start = useCallback(async () => {
        if (!taskId || secondsRef.current <= 0) return;
        setIsDone(false);

        // Create session on backend if not already active
        if (!sessionIdRef.current) {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API}/pomodoro/start`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ taskId, plannedSeconds: totalSeconds })
                });
                const data = await res.json();
                if (data.session?._id) {
                    setSessionId(data.session._id);
                    sessionIdRef.current = data.session._id;
                }
            } catch (e) {
                console.error('Pomodoro start error:', e);
            }
        }

        // Calculate real-world interval: 1000ms / multiplier
        // e.g. multiplier 1.1 → ~909 ms per tick → 60 min becomes ~54.5 min
        const intervalMs = Math.round(1000 / multiplier);
        intervalRef.current = setInterval(tick, intervalMs);
        setIsRunning(true);
    }, [taskId, totalSeconds, multiplier, tick]);

    // ── Pause ──────────────────────────────────────────────────────────────────
    const pause = useCallback(() => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
    }, []);

    // ── Stop (internal helper) ────────────────────────────────────────────────
    const stop = useCallback((shouldSaveDraft = true) => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
    }, []);

    // ── Save Draft ─────────────────────────────────────────────────────────────
    const saveDraft = useCallback(async () => {
        pause();
        const sid = sessionIdRef.current;
        if (!sid) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API}/pomodoro/${sid}/save-draft`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    remainingSeconds: secondsRef.current,
                    elapsedSeconds: elapsedRef.current
                })
            });
        } catch (e) {
            console.error('Pomodoro save-draft error:', e);
        }
        setSessionId(null);
        sessionIdRef.current = null;
        elapsedRef.current = 0;
    }, [pause]);

    // ── Finish (timer done or user declares done) ──────────────────────────────
    const finish = useCallback(async (markTaskDone = false) => {
        pause();
        const sid = sessionIdRef.current;
        if (!sid) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API}/pomodoro/${sid}/finish`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    elapsedSeconds: elapsedRef.current,
                    markTaskDone
                })
            });
        } catch (e) {
            console.error('Pomodoro finish error:', e);
        }
        setSessionId(null);
        sessionIdRef.current = null;
        elapsedRef.current = 0;
        setIsDone(false);
    }, [pause]);

    // ── Set custom duration (before starting) ──────────────────────────────────
    const setDuration = useCallback((seconds) => {
        if (isRunning) return;
        setSecondsLeft(seconds);
        setTotalSeconds(seconds);
        setIsDone(false);
        elapsedRef.current = 0;
    }, [isRunning]);

    // Cleanup on unmount
    useEffect(() => () => clearInterval(intervalRef.current), []);

    return {
        secondsLeft,
        totalSeconds,
        isRunning,
        isDone,
        sessionId,
        start,
        pause,
        saveDraft,
        finish,
        setDuration
    };
}
