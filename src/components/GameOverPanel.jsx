import { motion } from 'framer-motion';
import { KIND_STYLE } from '../data/themes';

export default function GameOverPanel({ result, mode, depth, best, newBest, justUnlocked, history, endlessUnlocked, onRestart, onEndless, onMenu }) {
  const won = result === 'victory';
  const damageTaken = history.reduce((sum, h) => sum + (h.damage || 0), 0);
  const signals = history.filter((h) => h.kind === 'choice').length;
  const title = won ? 'ESCAPED' : 'SIGNAL LOST';
  const color = won ? 'var(--accent)' : '#ff3c5a';

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/75"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.6 } }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <motion.div
        className="panel w-full max-w-lg p-6 sm:p-8 text-center"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0, transition: { delay: 0.7, type: 'spring', stiffness: 200, damping: 18 } }}
      >
        <p className="hud-label">{won ? 'Surface hatch open' : 'Core integrity 0%'}</p>
        <h2
          className="glitch font-display font-black text-4xl sm:text-5xl mt-2"
          data-text={title}
          style={{ color, textShadow: `0 0 20px ${color}` }}
        >
          {title}
        </h2>
        <p className="mt-3 text-slate-300">
          {won
            ? 'Cool night air hits your sensors. Above you, real stars. Darkness never felt so safe.'
            : mode === 'endless'
              ? `The Spire swallows you at depth ${depth}.`
              : 'The light finds you. Your last transmission flickers out.'}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {[
            [mode === 'endless' ? 'Depth' : 'Sectors', depth],
            ['Damage', damageTaken],
            ['Signals', signals],
          ].map(([label, value]) => (
            <div key={label} className="bg-white/5 py-3">
              <div className="font-display text-2xl text-white">{value}</div>
              <div className="hud-label mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-1 flex-wrap" aria-label="Your path">
          {history.map((h, i) => (
            <span
              key={i}
              className="w-3 h-3 rotate-45"
              title={h.title}
              style={{ background: h.kind === 'cloak' ? 'var(--accent)' : KIND_STYLE[h.kind]?.color }}
            />
          ))}
        </div>

        {newBest && <p className="mt-4 font-display text-sm tracking-widest" style={{ color: 'var(--accent)' }}>NEW RECORD · DEPTH {depth}</p>}
        {mode === 'endless' && !newBest && best > 0 && <p className="mt-4 hud-label">Best depth {best}</p>}
        {justUnlocked && <p className="mt-4 font-display text-sm tracking-widest" style={{ color: 'var(--accent)' }}>ENDLESS DESCENT UNLOCKED</p>}

        <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center">
          <button className="btn-neon text-xs whitespace-nowrap" onClick={() => onRestart(mode)} autoFocus>
            {won ? 'Run again' : 'Reboot'} <kbd className="ml-1 !text-black !border-black/40 !bg-black/10">R</kbd>
          </button>
          {endlessUnlocked && mode !== 'endless' && (
            <button className="btn-ghost text-xs whitespace-nowrap" onClick={onEndless}>Go endless</button>
          )}
          <button className="btn-ghost text-xs whitespace-nowrap" onClick={onMenu}>Title</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
