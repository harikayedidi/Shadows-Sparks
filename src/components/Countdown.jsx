import { useEffect, useRef, useState } from 'react';

// A draining bar for the "Hurry!" twist. Calls onDone once when it runs out.
export default function Countdown({ seconds, paused, onDone }) {
  const [left, setLeft] = useState(seconds * 1000);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => setLeft((ms) => Math.max(0, ms - 100)), 100);
    return () => clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    if (left === 0) doneRef.current();
  }, [left]);

  const pct = (left / (seconds * 1000)) * 100;
  const urgent = left <= 3000;
  return (
    <div className="w-full max-w-md mx-auto" role="timer" aria-label={`${Math.ceil(left / 1000)} seconds left`}>
      <div className="flex justify-between hud-label mb-1">
        <span>⏱ Hurry!{paused ? ' (paused)' : ''}</span>
        <span style={{ color: urgent ? '#ff3c5a' : undefined }}>{Math.ceil(left / 1000)}s</span>
      </div>
      <div className="h-1.5 bg-white/10">
        <div className="h-full" style={{ width: `${pct}%`, background: urgent ? '#ff3c5a' : '#ffc857', transition: 'width 0.1s linear' }} />
      </div>
    </div>
  );
}
