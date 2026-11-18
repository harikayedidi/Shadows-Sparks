import { motion } from 'framer-motion';
import { ITEMS } from '../data/cards';
import { KIND_STYLE } from '../data/themes';

const HINT_ROWS = [
  ['safe', 'COLD', 'Usually a dark, safe room.'],
  ['trap', 'LUMEN', 'Usually a light trap: 1–2 damage.'],
  ['choice', 'SIGNAL', 'Usually a choice: risk vs reward.'],
  ['supply', 'CACHE', 'Usually salvage: a free item.'],
];

export default function HelpModal({ onClose }) {
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
            <p className="hud-label">Field manual</p>
            <h2 className="font-display text-2xl neon-text mt-1">How to survive</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <ol className="mt-5 space-y-2 text-slate-300 text-base list-decimal list-inside">
          <li><b>Scan</b> the next sector (click or drag the deck, or press <kbd>Space</kbd>).</li>
          <li>Three sealed <b>doors</b> appear. Each sensor reading hints at what's inside, but sensors only read true about <b>70%</b> of the time.</li>
          <li><b>Enter</b> a door (click it, drag it up, or press <kbd>1</kbd>–<kbd>3</kbd>). Survive 10 sectors with your core intact to escape.</li>
        </ol>

        <h3 className="hud-label mt-6 mb-2">Sensor readings</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {HINT_ROWS.map(([kind, label, text]) => (
            <div key={kind} className="flex items-center gap-3 bg-white/5 px-3 py-2">
              <span className="font-mono text-xs px-2 py-0.5" style={{ color: KIND_STYLE[kind].color, border: `1px solid ${KIND_STYLE[kind].color}66` }}>
                {label}
              </span>
              <span className="text-sm text-slate-300">{text}</span>
            </div>
          ))}
        </div>

        <h3 className="hud-label mt-6 mb-2">Gear (3 slots)</h3>
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
        <p className="mt-3 text-sm text-slate-400">
          Use gear by clicking it, pressing <kbd>Q</kbd> <kbd>W</kbd> <kbd>E</kbd>, or <b>dragging it onto your core</b>.
        </p>

        <h3 className="hud-label mt-6 mb-2">Controls</h3>
        <p className="text-sm text-slate-300 flex flex-wrap gap-x-5 gap-y-2">
          <span><kbd>Space</kbd> scan</span>
          <span><kbd>1</kbd>–<kbd>3</kbd> enter door / choose</span>
          <span><kbd>Q</kbd><kbd>W</kbd><kbd>E</kbd> use gear</span>
          <span><kbd>M</kbd> sound</span>
          <span><kbd>H</kbd> this manual</span>
          <span><kbd>Esc</kbd> close</span>
        </p>
      </motion.div>
    </motion.div>
  );
}
