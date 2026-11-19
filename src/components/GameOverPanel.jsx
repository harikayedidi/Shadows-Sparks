import { motion } from 'framer-motion';
import { KIND_STYLE } from '../data/themes';

export default function GameOverPanel({ result, mode, difficulty, depth, best, newBest, justUnlocked, hardJustUnlocked, history, upgrades, endlessUnlocked, onRestart, onEndless, onMenu }) {
  const won = result === 'victory';
  const damageTaken = history.reduce((sum, h) => sum + (h.damage || 0), 0);
  const title = won ? 'YOU ESCAPED!' : 'CAUGHT!';
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
        <p className="hud-label">{won ? 'You made it to the roof' : 'Out of health'} · {difficulty}</p>
        <h2
          className="glitch font-display font-black text-4xl sm:text-5xl mt-2"
          data-text={title}
          style={{ color, textShadow: `0 0 20px ${color}` }}
        >
          {title}
        </h2>
        <p className="mt-3 text-slate-300">
          {won
            ? 'Cool night air. Real stars. SPARK is free!'
            : mode === 'endless'
              ? `The light caught you on floor ${depth + 1}.`
              : `The light caught you on floor ${depth + 1}. Try again: every run is different!`}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {[
            ['Floors cleared', depth],
            ['Damage taken', damageTaken],
            ['Upgrades', upgrades.length],
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

        {newBest && <p className="mt-4 font-display text-sm tracking-widest" style={{ color: 'var(--accent)' }}>NEW BEST · {depth} FLOORS</p>}
        {mode === 'endless' && !newBest && best > 0 && <p className="mt-4 hud-label">Best on {difficulty}: {best} floors</p>}
        {justUnlocked && <p className="mt-4 font-display text-sm tracking-widest" style={{ color: 'var(--accent)' }}>ENDLESS MODE UNLOCKED</p>}
        {hardJustUnlocked && <p className="mt-2 font-display text-sm tracking-widest" style={{ color: 'var(--accent)' }}>HARD MODE UNLOCKED</p>}

        <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center">
          <button className="btn-neon text-sm whitespace-nowrap" onClick={() => onRestart(mode)} autoFocus>
            {won ? 'Play again' : 'Try again'} <kbd className="ml-1 !text-black !border-black/40 !bg-black/10">R</kbd>
          </button>
          {endlessUnlocked && mode !== 'endless' && (
            <button className="btn-ghost text-sm whitespace-nowrap" onClick={onEndless}>Try Endless</button>
          )}
          <button className="btn-ghost text-sm whitespace-nowrap" onClick={onMenu}>Menu</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
