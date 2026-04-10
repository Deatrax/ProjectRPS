import { useState, useEffect, useRef, useCallback } from 'react';

const API = 'http://localhost:5000/api';

/**
 * usePomodoroTimer
 * A clean, reliable Pomodoro timer hook using timestamp-based countdown.
 */
export function usePomodoroTimer(multiplier = 1.0) {
    const [secondsLeft, setSecondsLeft] = useState(25 * 60);
    const [totalSeconds, setTotalSeconds] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [sessionId, setSessionId] = useState(null);

    // Refs to avoid stale closures in the interval
    const secondsLeftRef = useRef(25 * 60);
    const totalSecondsRef = useRef(25 * 60);
    const startTimeRef = useRef(null);
    const startSecondsRef = useRef(25 * 60);
    const multiplierRef = useRef(multiplier);
    const intervalRef = useRef(null);
    const sessionIdRef = useRef(null);
    const taskIdRef = useRef(null);

    // Keep refs in sync
    useEffect(() => { multiplierRef.current = multiplier; }, [multiplier]);
    useEffect(() => { secondsLeftRef.current = secondsLeft; }, [secondsLeft]);
    useEffect(() => { totalSecondsRef.current = totalSeconds; }, [totalSeconds]);

    // Cleanup interval on unmount
    useEffect(() => () => clearInterval(intervalRef.current), []);

    // ── Set Duration (called externally when preset/custom is picked or draft loaded) ──
    const setDuration = useCallback((seconds, total) => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        const s = Math.max(1, Math.round(seconds));
        const t = Math.max(s, Math.round(total || seconds));
        setSecondsLeft(s);
        setTotalSeconds(t);
        secondsLeftRef.current = s;
        totalSecondsRef.current = t;
        setIsDone(false);
    }, []);

    // ── Start ──
    const start = useCallback(async (taskId) => {
        if (!taskId || secondsLeftRef.current <= 0) return;
        setIsDone(false);
        taskIdRef.current = taskId;

        // Create/resume session on backend
        let sid = sessionIdRef.current;
        if (!sid) {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API}/pomodoro/start`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ taskId, plannedSeconds: totalSecondsRef.current }),
                });
                const data = await res.json();
                if (data.session?._id) {
                    sid = data.session._id;
                    sessionIdRef.current = sid;
                    setSessionId(sid);
                    localStorage.setItem('pomo_sid', sid);
                }
            } catch (e) {
                console.warn('Failed to create pomodoro session, running local-only:', e);
            }
        }

        startTimeRef.current = Date.now();
        startSecondsRef.current = secondsLeftRef.current;

        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            const elapsed = ((Date.now() - startTimeRef.current) / 1000) * multiplierRef.current;
            const next = Math.max(0, Math.floor(startSecondsRef.current - elapsed));
            setSecondsLeft(next);
            secondsLeftRef.current = next;

            if (next <= 0) {
                clearInterval(intervalRef.current);
                setIsRunning(false);
                setIsDone(true);
                localStorage.removeItem('pomo_sid');
            }
        }, 250);

        setIsRunning(true);
    }, []);

    // ── Pause ──
    const pause = useCallback(() => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
    }, []);

    // ── Save Draft ──
    const saveDraft = useCallback(async () => {
        clearInterval(intervalRef.current);
        setIsRunning(false);

        const sid = sessionIdRef.current;
        if (!sid) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`${API}/pomodoro/${sid}/save-draft`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    remainingSeconds: secondsLeftRef.current,
                    elapsedSeconds: totalSecondsRef.current - secondsLeftRef.current,
                }),
            });
        } catch (e) {
            console.warn('Failed to save draft:', e);
        }

        localStorage.removeItem('pomo_sid');
        sessionIdRef.current = null;
        setSessionId(null);
    }, []);

    // ── Finish ──
    const finish = useCallback(async (markTaskDone = false) => {
        clearInterval(intervalRef.current);
        setIsRunning(false);

        const sid = sessionIdRef.current;
        if (!sid) {
            setIsDone(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await fetch(`${API}/pomodoro/${sid}/finish`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    elapsedSeconds: totalSecondsRef.current - secondsLeftRef.current,
                    markTaskDone,
                }),
            });
        } catch (e) {
            console.warn('Failed to finish session:', e);
        }

        localStorage.removeItem('pomo_sid');
        sessionIdRef.current = null;
        setSessionId(null);
        setIsDone(false);
    }, []);

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
        setDuration,
    };
}
