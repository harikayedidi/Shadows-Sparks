import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ITEMS } from '../data/cards';
import { KIND_STYLE } from '../data/themes';

const TAGS = [
  ['safe', 'DARK', 'Safe. Nothing hurts you.'],
  ['trap', 'BRIGHT', 'A light trap. You lose 1 or 2 health.'],
  ['choice', 'EVENT', 'Something happens. You get to pick.'],
  ['supply', 'LOOT', 'A free item!'],
];

const STEPS = [
  ['Draw doors', <>Tap the deck or press <kbd>Space</kbd>. You get 3 doors.</>],
  ['Pick one', <>Each door has a tag that hints what's inside. Tags are <b>usually</b> right, but not always!</>],
  ['Climb', <>Get through 10 floors without running out of health. That's it!</>],
];

export default function HelpModal({ onClose, welcome = false }) {
  const startRef = useRef(null);
  // Focus the start button without scrolling the rules out of view.
  useEffect(() => startRef.current?.focus({ preventScroll: true }), []);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="How to play"
      // Let Enter/Space press the focused button instead of reaching the game's key bindings.
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.tagName === 'BUTTON') e.stopPropagation();
      }}
    >
      <motion.div
        className="panel w-full max-w-2xl max-h-[88vh] overflow-y-auto p-6 sm:p-8 text-left"
        initial={{ y: 30, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            {welcome && <p className="hud-label mb-1">Welcome! Quick rules before you start</p>}
            <h2 className="font-display text-2xl neon-text">How to play</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <p className="mt-2 text-slate-300">You are SPARK, a little robot. Light hurts you. Dark rooms are safe.</p>

        <ol className="mt-5 grid sm:grid-cols-3 gap-3">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="bg-white/5 p-3">
              <span className="font-display text-2xl" style={{ color: 'var(--accent)' }}>{i + 1}</span>
              <b className="block text-white mt-1">{title}</b>
              <span className="block text-sm text-slate-300 mt-1">{text}</span>
            </li>
          ))}
        </ol>

        <h3 className="hud-label mt-6 mb-2">Door tags</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {TAGS.map(([kind, label, text]) => (
            <div key={kind} className="flex items-center gap-3 bg-white/5 px-3 py-2">
              <span className="font-mono text-xs px-2 py-0.5 w-16 text-center" style={{ color: KIND_STYLE[kind].color, border: `1px solid ${KIND_STYLE[kind].color}66` }}>
                {label}
              </span>
              <span className="text-sm text-slate-300">{text}</span>
            </div>
          ))}
        </div>

        {welcome ? (
          <>
            <p className="mt-5 text-sm text-slate-400">Items, bosses and twists get a quick tip the first time you see them. Tap the <b>?</b> button anytime to see all the rules.</p>
            <p className="mt-2 text-xs text-slate-500">Too much flashing? Open ⚙ Settings to turn down motion and glow.</p>
            <div className="mt-6 flex justify-center">
              <button ref={startRef} className="btn-neon text-sm" onClick={onClose}>
                Got it, let's play!
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="hud-label mt-6 mb-2">Items</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {Object.values(ITEMS).map((item) => (
                <div key={item.id} className="flex items-start gap-3 bg-white/5 px-3 py-2">
                  <span className="text-xl leading-none" style={{ color: 'var(--accent)' }}>{item.glyph}</span>
                  <span className="text-sm">
                    <b className="text-slate-100">{item.title}</b>
                    <span className="block text-slate-400">{item.description}</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-slate-400">Tap an item to use it, or drag it onto your health.</p>

            <h3 className="hud-label mt-6 mb-2">Along the way</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><b className="text-white">Upgrades:</b> after some floors, pick 1 of 3 upgrades. They last the whole run.</li>
              <li><b className="text-rose-300">Bosses:</b> floors 5 and 10 have a boss. Find enough dark rooms to get past it.</li>
              <li><b className="text-amber-300">Twists:</b> some floors have a special rule, like a timer or no tags. Check the yellow banner.</li>
              <li><b className="text-white">Difficulty:</b> pick Easy, Normal or Hard on the title screen. Beat Normal to unlock Hard.</li>
            </ul>

            <h3 className="hud-label mt-6 mb-2">Keys</h3>
            <p className="text-sm text-slate-300 flex flex-wrap gap-x-5 gap-y-2">
              <span><kbd>Space</kbd> draw doors</span>
              <span><kbd>1</kbd>–<kbd>4</kbd> pick</span>
              <span><kbd>Q</kbd><kbd>W</kbd><kbd>E</kbd><kbd>R</kbd> items</span>
              <span><kbd>M</kbd> sound</span>
              <span><kbd>H</kbd> help</span>
              <span><kbd>Esc</kbd> close</span>
            </p>
            <p className="mt-4 text-xs text-slate-500">Too much flashing? Open ⚙ Settings to turn down motion and glow.</p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
