import { useState } from 'react';
import { motion } from 'framer-motion';
import { resetTips } from '../hooks/useTips';

const MOTION_OPTIONS = [
  ['full', 'Full', 'All the effects'],
  ['reduced', 'Reduced', 'No shaking, tilting or looping'],
  ['off', 'Off', 'No animation at all'],
];

function Segmented({ label, value, options, onChange }) {
  return (
    <fieldset>
      <legend className="hud-label mb-2">{label}</legend>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }} role="radiogroup" aria-label={label}>
        {options.map(([id, name, hint]) => {
          const active = value === id;
          return (
            <button
              key={id}
              role="radio"
              aria-checked={active}
              className="px-2 py-2 text-left border"
              style={{ borderColor: active ? 'var(--accent)' : 'rgba(255,255,255,0.12)', background: active ? 'var(--accent-soft)' : 'rgba(0,0,0,0.3)' }}
              onClick={() => onChange(id)}
            >
              <span className="block font-display text-sm text-white">{name}</span>
              <span className="block text-sm text-slate-300 leading-tight">{hint}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function SettingsModal({ settings, muted, onChange, onToggleMute, onHelp, onQuit, onClose }) {
  const [tipsReset, setTipsReset] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <motion.div
        className="panel w-full max-w-md max-h-[92vh] overflow-y-auto p-6 text-left flex flex-col gap-5"
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="font-display text-2xl neon-text">Settings</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={`grid gap-2 ${onQuit ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <button className="btn-ghost text-sm" onClick={onHelp}>? How to play</button>
          {onQuit && <button className="btn-ghost text-sm" onClick={onQuit}>⏏ Quit run</button>}
        </div>

        <Segmented label="Motion" value={settings.motion} options={MOTION_OPTIONS} onChange={(motion) => onChange({ motion })} />
        <Segmented
          label="Glow"
          value={settings.glow ? 'on' : 'off'}
          options={[
            ['on', 'On', 'Neon glow'],
            ['off', 'Off', 'Flat and calm'],
          ]}
          onChange={(v) => onChange({ glow: v === 'on' })}
        />
        <Segmented
          label="Sound"
          value={muted ? 'off' : 'on'}
          options={[
            ['on', 'On', 'Music and sounds'],
            ['off', 'Off', 'Silent'],
          ]}
          onChange={(v) => (v === 'off') !== muted && onToggleMute()}
        />

        <button
          className="btn-ghost text-sm self-start"
          onClick={() => {
            resetTips();
            setTipsReset(true);
          }}
          disabled={tipsReset}
        >
          {tipsReset ? 'Tips will show again' : 'Show beginner tips again'}
        </button>
      </motion.div>
    </motion.div>
  );
}
