import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { UPGRADES } from '../data/cards';

// Pick one of a few run-long upgrades.
const UpgradePicker = forwardRef(function UpgradePicker({ offer, onPick }, ref) {
  return (
    <motion.section
      ref={ref}
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      aria-label="Pick an upgrade"
    >
      <div className="text-center">
        <p className="hud-label">Floor cleared!</p>
        <h2 className="font-display text-xl sm:text-2xl neon-text mt-1">Pick an upgrade</h2>
        <p className="text-sm text-slate-400 mt-1">It lasts the whole run.</p>
      </div>
      <div className="flex justify-center gap-2 sm:gap-3">
        {offer.map((id, i) => {
          const upgrade = UPGRADES[id];
          return (
            <motion.button
              key={id}
              className="panel w-[min(11rem,calc((100vw-2.5rem)/3))] min-h-[10rem] sm:min-h-[11rem] p-2 sm:p-4 flex flex-col items-center text-center gap-1.5 sm:gap-2"
              style={{ border: '1px solid var(--accent)' }}
              initial={{ opacity: 0, y: 30, rotate: (i - 1) * 4 }}
              animate={{ opacity: 1, y: 0, rotate: 0, transition: { delay: 0.1 + i * 0.08 } }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onPick(i)}
              aria-label={`${upgrade.title}: ${upgrade.text} (press ${i + 1})`}
            >
              <kbd className="self-end">{i + 1}</kbd>
              <span className="text-3xl sm:text-4xl leading-none" style={{ color: 'var(--accent)', textShadow: '0 0 14px var(--accent)' }}>
                {upgrade.glyph}
              </span>
              <span className="font-display text-xs sm:text-base text-white">{upgrade.title}</span>
              <span className="text-xs sm:text-sm text-slate-300 leading-snug">{upgrade.text}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
});

export default UpgradePicker;
