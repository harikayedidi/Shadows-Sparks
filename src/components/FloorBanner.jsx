import { motion } from 'framer-motion';
import { BOSSES, TWISTS } from '../data/cards';

// Shows the current boss or floor twist, so the special rule is always on screen.
export default function FloorBanner({ boss, twist }) {
  if (boss) {
    const info = BOSSES[boss.id];
    const done = boss.total - boss.locks;
    return (
      <motion.div
        key={`boss-${boss.id}`}
        className="panel mx-auto w-full max-w-xl px-4 py-2 flex items-center gap-3"
        style={{ border: '1px solid #ff3c5a88' }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        role="status"
      >
        <span className="text-3xl leading-none text-[#ff3c5a]" aria-hidden="true">{info.glyph}</span>
        <div className="flex-1 min-w-0">
          <p className="font-display text-sm tracking-widest text-[#ff8a9c]">BOSS · {info.title}</p>
          <p className="text-sm text-slate-300 leading-snug">{info.text}</p>
        </div>
        <div className="flex flex-col items-end gap-1" aria-label={`${done} of ${boss.total} dark rooms found`}>
          <div className="flex gap-1">
            {Array.from({ length: boss.total }, (_, i) => (
              <span key={i} className="w-3 h-3 rotate-45" style={{ background: i < done ? 'var(--accent)' : 'transparent', border: '1px solid var(--accent)' }} />
            ))}
          </div>
          <span className="hud-label !text-[10px]">{done}/{boss.total} dark</span>
        </div>
      </motion.div>
    );
  }
  if (twist) {
    const info = TWISTS[twist];
    return (
      <motion.div
        key={`twist-${twist}`}
        className="panel mx-auto w-full max-w-xl px-4 py-2 flex items-center gap-3"
        style={{ border: '1px solid #ffc85788' }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        role="status"
      >
        <span className="text-2xl leading-none text-[#ffc857]" aria-hidden="true">{info.glyph}</span>
        <div className="min-w-0">
          <p className="font-display text-sm tracking-widest text-[#ffc857]">TWIST · {info.title}</p>
          <p className="text-sm text-slate-300 leading-snug">{info.text}</p>
        </div>
      </motion.div>
    );
  }
  return null;
}
