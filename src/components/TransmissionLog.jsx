import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Typewriter from './Typewriter';
import { useSettings } from '../hooks/useSettings';

const TONE = {
  info: 'text-slate-300',
  story: 'text-slate-200',
  good: 'text-emerald-300',
  warn: 'text-amber-300',
  danger: 'text-rose-400',
};

export default function TransmissionLog({ entries }) {
  const listRef = useRef(null);
  const { full } = useSettings();

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: full ? 'smooth' : 'auto' });
  }, [entries.length, full]);

  return (
    <section className="panel px-3 py-2 sm:px-4 sm:py-3 min-w-0 flex flex-col" aria-label="What happened">
      <p className="hud-label mb-2 flex items-center gap-2">
        <motion.span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: 'var(--accent)' }}
          animate={{ opacity: full ? [1, 0.2, 1] : 1 }}
          transition={full ? { repeat: Infinity, duration: 1.2 } : {}}
        />
        What happened
      </p>
      <ul ref={listRef} className="log-scroll overflow-y-auto max-h-28 sm:max-h-32 space-y-1 pr-1" aria-live="polite">
        {entries.map((entry, i) => {
          const latest = i === entries.length - 1;
          return (
            <motion.li
              key={entry.id}
              className={`font-mono text-sm leading-snug ${TONE[entry.tone] ?? TONE.info} ${latest ? '' : 'opacity-85'}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: latest ? 1 : 0.85, x: 0 }}
            >
              <span className="text-slate-400 mr-2">&gt;</span>
              {latest ? <Typewriter text={entry.text} speed={12} /> : entry.text}
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
