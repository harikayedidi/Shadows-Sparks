import { useCallback, useEffect, useRef, useState } from 'react';

const KEY = 'ss.tips';

const TIPS = [
  { id: 'doors', when: (s) => s.phase === 'choosing', text: 'Tap a door to go in. DARK rooms are safe. BRIGHT rooms hurt. Tags can be wrong sometimes!' },
  { id: 'item', when: (s) => s.inventory.some(Boolean), text: 'You got an item! Tap it, or drag it onto your health, to use it.', touchText: 'You got an item! Tap it to see what it does. Double-tap it to use it.' },
  { id: 'event', when: (s) => s.phase === 'deciding', text: 'Events let you pick. Some choices are risky, some are safe.' },
  { id: 'twist', when: (s) => Boolean(s.twist), text: 'A floor twist changes the rules for this floor only. Check the banner.' },
  { id: 'upgrade', when: (s) => s.phase === 'upgrading', text: 'Upgrades last the whole run. Try mixing ones that work together!' },
  { id: 'boss', when: (s) => Boolean(s.boss), text: 'Boss floor! You stay here until you find enough dark rooms.' },
];

const readSeen = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) || '[]'));
  } catch {
    return new Set();
  }
};

export const resetTips = () => {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem('ss.welcomed');
  } catch {
    // Ignore unavailable storage.
  }
};

// Shows each beginner tip once, the first time its situation comes up.
export function useTips(state, mobile = false) {
  const seen = useRef(null);
  const [tip, setTip] = useState(null);
  if (!seen.current) seen.current = readSeen();

  useEffect(() => {
    if (tip) {
      // Tips are about the moment; close once it has passed.
      if (!tip.when(state)) setTip(null);
      return;
    }
    const next = TIPS.find((t) => !seen.current.has(t.id) && t.when(state));
    if (!next) return;
    seen.current.add(next.id);
    try {
      localStorage.setItem(KEY, JSON.stringify([...seen.current]));
    } catch {
      // Ignore unavailable storage.
    }
    setTip(mobile && next.touchText ? { ...next, text: next.touchText } : next);
  }, [state, tip, mobile]);

  useEffect(() => {
    if (!tip) return undefined;
    const timer = setTimeout(() => setTip(null), 8000);
    return () => clearTimeout(timer);
  }, [tip]);

  const dismiss = useCallback(() => setTip(null), []);
  return [tip, dismiss];
}
